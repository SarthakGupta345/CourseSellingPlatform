import { Request, Response } from "express";
import { prisma } from "../Config/prisma";
import { sendError, sendSuccess } from "../utils/response";
import { v4 as uuidv4 } from "uuid";
import { documentSchema } from "../Schema/eDocument.schema";
import { uploadToS3 } from "../Config/aws/s3/putObject";
import { deleteFromS3 } from "../Config/aws/s3/deleteObject";

// Constants
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_DOCUMENT_TYPES = [
    "application/pdf",
    "application/epub+zip",
    "application/x-mobipocket-ebook",
];
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MIN_PRICE = 0;
const MAX_PRICE = 999999.99;

// Types
interface UploadedFile {
    buffer: Buffer;
    originalname: string;
    mimetype: string;
    size: number;
}

interface UploadResult {
    url: string;
    key: string;
}

interface DocumentUploadFiles {
    file: UploadedFile;
    thumbnail: UploadedFile;
    bgPhoto: UploadedFile;
}

// Validation Helpers
const validateFileType = (file: UploadedFile, allowedTypes: string[]): boolean => {
    return allowedTypes.includes(file.mimetype);
};

const validateFileSize = (file: UploadedFile, maxSize: number): boolean => {
    return file.size <= maxSize;
};

const sanitizeFileName = (filename: string): string => {
    const timestamp = Date.now();
    const randomId = uuidv4().substring(0, 8);
    const extension = filename.split(".").pop() || "";
    const sanitized = filename
        .split(".")[0]
        .replace(/[^a-zA-Z0-9-_]/g, "_")
        .substring(0, 50);

    return `${sanitized}_${timestamp}_${randomId}.${extension}`;
};

const validatePrice = (price: number): boolean => {
    return (
        typeof price === "number" &&
        !isNaN(price) &&
        isFinite(price) &&
        price >= MIN_PRICE &&
        price <= MAX_PRICE
    );
};

// Upload Helper with Rollback Support
const uploadFilesWithRollback = async (
    files: DocumentUploadFiles
): Promise<{
    bookURL: string;
    bookKey: string;
    thumbnailURL: string;
    thumbnailKey: string;
    bgPhotoURL: string;
    bgPhotoKey: string;
}> => {
    const uploadedKeys: string[] = [];

    try {
        // Upload book file
        const bookResult = await uploadToS3(
            files.file.buffer,
            sanitizeFileName(files.file.originalname),
            files.file.mimetype,
            "documents"
        );
        uploadedKeys.push(bookResult.key);

        // Upload thumbnail
        const thumbnailResult = await uploadToS3(
            files.thumbnail.buffer,
            sanitizeFileName(files.thumbnail.originalname),
            files.thumbnail.mimetype,
            "thumbnails"
        );
        uploadedKeys.push(thumbnailResult.key);

        // Upload background photo
        const bgPhotoResult = await uploadToS3(
            files.bgPhoto.buffer,
            sanitizeFileName(files.bgPhoto.originalname),
            files.bgPhoto.mimetype,
            "covers"
        );
        uploadedKeys.push(bgPhotoResult.key);

        return {
            bookURL: bookResult.url,
            bookKey: bookResult.key,
            thumbnailURL: thumbnailResult.url,
            thumbnailKey: thumbnailResult.key,
            bgPhotoURL: bgPhotoResult.url,
            bgPhotoKey: bgPhotoResult.key,
        };
    } catch (error) {
        // Rollback: delete all uploaded files
        console.error("Upload failed, rolling back:", error);
        await Promise.allSettled(
            uploadedKeys.map((key) => deleteFromS3(key))
        );
        throw error;
    }
};

// Main Controller
export const sellDocument = async (
    req: Request,
    res: Response
): Promise<Response> => {
    let uploadedFiles: {
        bookKey?: string;
        thumbnailKey?: string;
        bgPhotoKey?: string;
    } = {};

    try {
        // 1. Validate input schema
        const parsed = documentSchema.safeParse(req.body);
        if (!parsed.success) {
            return sendError(res, 400, "Invalid input", parsed.error.format());
        }

        const { title, description, file, price, bgPhoto, thumbnail } = parsed.data;

        // 2. Validate user authentication
        const user = req.user;
        if (!user?.id || !user?.email) {
            return sendError(res, 401, "Authentication required");
        }

        // 3. Validate files exist
        if (!file || !thumbnail || !bgPhoto) {
            return sendError(res, 400, "All files (document, thumbnail, cover) are required");
        }

        // 4. Validate file types
        if (!validateFileType(file, ALLOWED_DOCUMENT_TYPES)) {
            return sendError(
                res,
                400,
                `Invalid document type. Allowed types: ${ALLOWED_DOCUMENT_TYPES.join(", ")}`
            );
        }

        if (!validateFileType(thumbnail, ALLOWED_IMAGE_TYPES)) {
            return sendError(
                res,
                400,
                `Invalid thumbnail type. Allowed types: ${ALLOWED_IMAGE_TYPES.join(", ")}`
            );
        }

        if (!validateFileType(bgPhoto, ALLOWED_IMAGE_TYPES)) {
            return sendError(
                res,
                400,
                `Invalid cover image type. Allowed types: ${ALLOWED_IMAGE_TYPES.join(", ")}`
            );
        }

        // 5. Validate file sizes
        if (!validateFileSize(file, MAX_FILE_SIZE)) {
            return sendError(
                res,
                400,
                `Document file too large. Maximum size: ${MAX_FILE_SIZE / 1024 / 1024}MB`
            );
        }

        if (!validateFileSize(thumbnail, MAX_IMAGE_SIZE)) {
            return sendError(
                res,
                400,
                `Thumbnail too large. Maximum size: ${MAX_IMAGE_SIZE / 1024 / 1024}MB`
            );
        }

        if (!validateFileSize(bgPhoto, MAX_IMAGE_SIZE)) {
            return sendError(
                res,
                400,
                `Cover image too large. Maximum size: ${MAX_IMAGE_SIZE / 1024 / 1024}MB`
            );
        }

        // 6. Validate price
        if (!validatePrice(price)) {
            return sendError(
                res,
                400,
                `Invalid price. Must be between ${MIN_PRICE} and ${MAX_PRICE}`
            );
        }

        // 7. Validate title and description
        if (!title || title.trim().length === 0) {
            return sendError(res, 400, "Title is required");
        }

        if (title.length > 200) {
            return sendError(res, 400, "Title must be less than 200 characters");
        }

        if (description && description.length > 5000) {
            return sendError(res, 400, "Description must be less than 5000 characters");
        }

        // 8. Verify user exists and has proper role
        const existingUser = await prisma.user.findUnique({
            where: {
                id: user.id,
                email: user.email,
            },
            select: {
                id: true,
                email: true,
                role: true,
            },
        });

        if (!existingUser) {
            return sendError(res, 401, "User not found");
        }

        if (existingUser.role !== "CREATOR") {
            return sendError(
                res,
                403,
                "Only creators can sell documents. Please upgrade your account."
            );
        }

        // 9. Verify creator profile exists
        const creatorProfile = await prisma.creatorProfile.findUnique({
            where: {
                userId: user.id,
            },
            select: {
                id: true,
                userId: true,
                isActive: true,
            },
        });

        if (!creatorProfile) {
            return sendError(
                res,
                403,
                "Creator profile not found. Please complete your creator profile."
            );
        }

        if (!creatorProfile.isActive) {
            return sendError(
                res,
                403,
                "Your creator account is inactive. Please contact support."
            );
        }

        // 10. Check for duplicate titles by the same creator
        const existingProduct = await prisma.product.findFirst({
            where: {
                name: title.trim(),
                creatorId: creatorProfile.id,
            },
            select: {
                id: true,
            },
        });

        if (existingProduct) {
            return sendError(
                res,
                409,
                "You already have a product with this title. Please choose a different title."
            );
        }

        // 11. Upload files to S3
        const uploadResults = await uploadFilesWithRollback({
            file,
            thumbnail,
            bgPhoto,
        });

        uploadedFiles = {
            bookKey: uploadResults.bookKey,
            thumbnailKey: uploadResults.thumbnailKey,
            bgPhotoKey: uploadResults.bgPhotoKey,
        };

        // 12. Create product in database
        const product = await prisma.product.create({
            data: {
                name: title.trim(),
                description: description?.trim() || null,
                price,
                thumbnail: uploadResults.thumbnailURL,
                thumbnailKey: uploadResults.thumbnailKey,
                coverImage: uploadResults.bgPhotoURL,
                coverImageKey: uploadResults.bgPhotoKey,
                productType: "EBOOK",
                book: uploadResults.bookURL,
                bookKey: uploadResults.bookKey,
                creatorId: creatorProfile.id,
                status: "ACTIVE",
                fileSize: file.size,
                mimeType: file.mimetype,
            },
            select: {
                id: true,
                name: true,
                description: true,
                price: true,
                thumbnail: true,
                coverImage: true,
                productType: true,
                createdAt: true,
                status: true,
            },
        });

        // 13. Log the creation event (optional)
        await prisma.activityLog.create({
            data: {
                userId: user.id,
                action: "PRODUCT_CREATED",
                entityType: "PRODUCT",
                entityId: product.id,
                metadata: {
                    productName: product.name,
                    price: product.price,
                },
            },
        }).catch((error) => {
            // Don't fail the request if logging fails
            console.error("Failed to log activity:", error);
        });

        return sendSuccess(res, 201, "Document listed successfully", {
            product,
        });
    } catch (error) {
        console.error("Error in sellDocument:", error);

        // Cleanup uploaded files if database operation failed
        if (uploadedFiles.bookKey || uploadedFiles.thumbnailKey || uploadedFiles.bgPhotoKey) {
            const keysToDelete = [
                uploadedFiles.bookKey,
                uploadedFiles.thumbnailKey,
                uploadedFiles.bgPhotoKey,
            ].filter(Boolean) as string[];

            await Promise.allSettled(
                keysToDelete.map((key) => deleteFromS3(key))
            ).catch((cleanupError) => {
                console.error("Failed to cleanup uploaded files:", cleanupError);
            });
        }

        // Handle specific errors
        if (error instanceof Error) {
            if (error.message.includes("S3") || error.message.includes("upload")) {
                return sendError(res, 500, "File upload failed. Please try again.");
            }

            if (error.message.includes("database") || error.message.includes("prisma")) {
                return sendError(res, 500, "Failed to save document. Please try again.");
            }
        }

        return sendError(res, 500, "Failed to list document. Please try again.");
    }
};

// Additional controller for updating document
export const updateDocument = async (
    req: Request,
    res: Response
): Promise<Response> => {
    try {
        const { productId } = req.params;
        const { title, description, price, status } = req.body;

        const user = req.user;
        if (!user?.id) {
            return sendError(res, 401, "Authentication required");
        }

        // Verify product exists and belongs to user
        const product = await prisma.product.findFirst({
            where: {
                id: productId,
                creator: {
                    userId: user.id,
                },
            },
            include: {
                creator: true,
            },
        });

        if (!product) {
            return sendError(res, 404, "Product not found or unauthorized");
        }

        // Validate updates
        const updates: any = {};

        if (title !== undefined) {
            if (title.trim().length === 0 || title.length > 200) {
                return sendError(res, 400, "Invalid title");
            }
            updates.name = title.trim();
        }

        if (description !== undefined) {
            if (description.length > 5000) {
                return sendError(res, 400, "Description too long");
            }
            updates.description = description.trim();
        }

        if (price !== undefined) {
            if (!validatePrice(price)) {
                return sendError(res, 400, "Invalid price");
            }
            updates.price = price;
        }

        if (status !== undefined) {
            if (!["ACTIVE", "INACTIVE", "DRAFT"].includes(status)) {
                return sendError(res, 400, "Invalid status");
            }
            updates.status = status;
        }

        const updatedProduct = await prisma.product.update({
            where: { id: productId },
            data: updates,
            select: {
                id: true,
                name: true,
                description: true,
                price: true,
                status: true,
                updatedAt: true,
            },
        });

        return sendSuccess(res, 200, "Product updated successfully", {
            product: updatedProduct,
        });
    } catch (error) {
        console.error("Error in updateDocument:", error);
        return sendError(res, 500, "Failed to update document");
    }
};

// Controller for deleting document
export const deleteDocument = async (
    req: Request,
    res: Response
): Promise<Response> => {
    try {
        const { productId } = req.params;

        const user = req.user;
        if (!user?.id) {
            return sendError(res, 401, "Authentication required");
        }

        // Get product with file keys
        const product = await prisma.product.findFirst({
            where: {
                id: productId,
                creator: {
                    userId: user.id,
                },
            },
            select: {
                id: true,
                bookKey: true,
                thumbnailKey: true,
                coverImageKey: true,
            },
        });

        if (!product) {
            return sendError(res, 404, "Product not found or unauthorized");
        }

        // Check if product has active purchases
        const hasPurchases = await prisma.purchase.findFirst({
            where: {
                productId: product.id,
            },
        });

        if (hasPurchases) {
            return sendError(
                res,
                400,
                "Cannot delete product with existing purchases. Set status to INACTIVE instead."
            );
        }

        // Delete from S3
        const filesToDelete = [
            product.bookKey,
            product.thumbnailKey,
            product.coverImageKey,
        ].filter(Boolean) as string[];

        await Promise.allSettled(
            filesToDelete.map((key) => deleteFromS3(key))
        );

        // Delete from database
        await prisma.product.delete({
            where: { id: productId },
        });

        return sendSuccess(res, 200, "Product deleted successfully");
    } catch (error) {
        console.error("Error in deleteDocument:", error);
        return sendError(res, 500, "Failed to delete document");
    }
};