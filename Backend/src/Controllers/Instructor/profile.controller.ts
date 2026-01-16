import { Request, Response } from "express";
import { instructorSchema } from "../../Schema/Instructor.schema";
import { prisma } from "../../Config/prisma";
import { AppError } from "../../utils/error";
import { asyncHandler, sendError, sendSuccess } from "../../utils/response";
import { uploadToS3 } from "../../Config/aws/s3/putObject";
import { deleteFromS3 } from "../../Config/aws/s3/deleteObject";

export const createInstructor = asyncHandler(async (req: Request, res: Response) => {
    const requestData = {
        ...req.body,
        coverPhoto: (req.files as any)?.coverPhoto?.[0],
        bgPhoto: (req.files as any)?.bgPhoto?.[0],
    };

    const parsed = instructorSchema.safeParse(requestData);
    if (!parsed.success) {
        return sendError(res, 400, "Invalid input", parsed.error.issues.map((err) => ({
            field: err.path.join("."),
            message: err.message,
            code: err.code,
        })));
    }

    const { displayName, about, tagline, email, coverPhoto, bgPhoto, twitter, linkedin, youtube, website } = parsed.data;


    const existingProfile = await prisma.creatorProfile.findUnique({
        where: {
            email: email.toLowerCase(),
        }
    });

    if (existingProfile) {
        sendError(res, 409, "You already have an instructor profile");
    }

    const existingName = await prisma.creatorProfile.findFirst({
        where: {
            displayName: displayName.trim(),
        },
    });

    if (existingName) {
        sendError(res, 409, "Display name already taken");
    }

    let coverPhotoUrl: string | undefined;
    let bgPhotoUrl: string | undefined;
    let coverPhotoKey: string | undefined;
    let bgPhotoKey: string | undefined;

    try {
        const coverUpload = await uploadToS3(
            coverPhoto.buffer,
            `instructor-covers/${email}-${Date.now()}-${coverPhoto.originalname}`,
            coverPhoto.mimetype,
            "instructor-covers"
        );
        coverPhotoUrl = coverUpload.url;
        coverPhotoKey = coverUpload.key;

        const bgUpload = await uploadToS3(
            bgPhoto.buffer,
            `instructor-backgrounds/${email}-${Date.now()}-${bgPhoto.originalname}`,
            bgPhoto.mimetype,
            "instructor-backgrounds"
        );
        bgPhotoUrl = bgUpload.url;
        bgPhotoKey = bgUpload.key;
    } catch (error) {
        if (coverPhotoKey) await deleteFromS3(coverPhotoKey).catch(console.error);
        if (bgPhotoKey) await deleteFromS3(bgPhotoKey).catch(console.error);
        console.error("Error uploading files to S3:", error);
        sendError(res, 500, "Something Went Wrong pls try again later");
    }

    try {
        const instructorProfile = await prisma.creatorProfile.create({
            data: {
                displayName: displayName.trim(),
                about: about.trim(),
                tagline: tagline.trim(),
                email: email.toLowerCase(),
                coverPhoto: coverPhotoUrl,
                // coverPhotoKey,
                bgPhoto: bgPhotoUrl,
                // bgPhotoKey,
                twitter: twitter?.trim() || null,
                linkedin: linkedin?.trim() || null,
                youtube: youtube?.trim() || null,
                website: website?.trim() || null,
            },
            select: {
                id: true,
                displayName: true,
                about: true,
                tagline: true,
                email: true,
                coverPhoto: true,
                bgPhoto: true,
                twitter: true,
                linkedin: true,
                youtube: true,
                website: true,
                createdAt: true,
            },
        });


        return sendSuccess(res, 201, "Instructor profile created successfully", {
            profile: instructorProfile,
        });
    } catch (error) {
        // Cleanup uploaded files if database operation fails
        if (coverPhotoKey) await deleteFromS3(coverPhotoKey).catch(console.error);
        if (bgPhotoKey) await deleteFromS3(bgPhotoKey).catch(console.error);

        throw error;
    }
});

/**
 * Update Instructor Profile
 * PATCH /api/instructor
 */
// export const updateInstructor = asyncHandler(async (req: Request, res: Response) => {
//     // Step 1: Authenticate
//     const user = req.user;
//     if (!user?.id) {
//         throw new AppError(401, "Authentication required", ErrorType.AUTHENTICATION);
//     }

//     // Step 2: Get existing profile
//     const existingProfile = await prisma.creatorProfile.findUnique({
//         where: { userId: user.id },
//     });

//     if (!existingProfile) {
//         throw new AppError(404, "Instructor profile not found", ErrorType.NOT_FOUND);
//     }

//     // Step 3: Prepare update data
//     const requestData = {
//         ...req.body,
//         coverPhoto: (req.files as any)?.coverPhoto?.[0],
//         bgPhoto: (req.files as any)?.bgPhoto?.[0],
//     };

//     // Step 4: Validate update data
//     const parsed = instructorUpdateSchema.safeParse(requestData);
//     if (!parsed.success) {
//         throw new AppError(
//             400,
//             "Invalid update data",
//             ErrorType.VALIDATION,
//             parsed.error.errors.map((err) => ({
//                 field: err.path.join("."),
//                 message: err.message,
//             }))
//         );
//     }

//     const updateData: any = {};
//     const oldKeys: string[] = [];

//     // Step 5: Process text updates
//     if (parsed.data.displayName !== undefined) {
//         // Check if display name is taken by another instructor
//         const existingName = await prisma.creatorProfile.findFirst({
//             where: {
//                 displayName: parsed.data.displayName.trim(),
//                 userId: { not: user.id },
//             },
//         });

//         if (existingName) {
//             throw new AppError(
//                 409,
//                 "Display name already taken",
//                 ErrorType.DUPLICATE,
//                 [{ field: "displayName", message: "This display name is already in use" }]
//             );
//         }

//         updateData.displayName = parsed.data.displayName.trim();
//     }

//     if (parsed.data.about !== undefined) {
//         updateData.about = parsed.data.about.trim();
//     }

//     if (parsed.data.tagline !== undefined) {
//         updateData.tagline = parsed.data.tagline.trim();
//     }

//     if (parsed.data.email !== undefined) {
//         // Check if email is taken
//         const existingEmail = await prisma.creatorProfile.findFirst({
//             where: {
//                 email: parsed.data.email.toLowerCase(),
//                 userId: { not: user.id },
//             },
//         });

//         if (existingEmail) {
//             throw new AppError(
//                 409,
//                 "Email already in use",
//                 ErrorType.DUPLICATE,
//                 [{ field: "email", message: "This email is already used by another instructor" }]
//             );
//         }

//         updateData.email = parsed.data.email.toLowerCase();
//     }

//     // Social links
//     if (parsed.data.twitter !== undefined) {
//         updateData.twitter = parsed.data.twitter?.trim() || null;
//     }
//     if (parsed.data.linkedin !== undefined) {
//         updateData.linkedin = parsed.data.linkedin?.trim() || null;
//     }
//     if (parsed.data.youtube !== undefined) {
//         updateData.youtube = parsed.data.youtube?.trim() || null;
//     }
//     if (parsed.data.website !== undefined) {
//         updateData.website = parsed.data.website?.trim() || null;
//     }

//     // Step 6: Handle cover photo update
//     if (parsed.data.coverPhoto) {
//         try {
//             const coverUpload = await uploadToS3(
//                 parsed.data.coverPhoto.buffer,
//                 `instructor-covers/${user.id}-${Date.now()}-${parsed.data.coverPhoto.originalname}`,
//                 parsed.data.coverPhoto.mimetype,
//                 "instructor-covers"
//             );

//             updateData.coverPhoto = coverUpload.url;
//             updateData.coverPhotoKey = coverUpload.key;

//             // Mark old key for deletion
//             if (existingProfile.coverPhotoKey) {
//                 oldKeys.push(existingProfile.coverPhotoKey);
//             }
//         } catch (error) {
//             throw new AppError(
//                 500,
//                 "Failed to upload cover photo",
//                 ErrorType.FILE_UPLOAD
//             );
//         }
//     }

//     // Step 7: Handle background photo update
//     if (parsed.data.bgPhoto) {
//         try {
//             const bgUpload = await uploadToS3(
//                 parsed.data.bgPhoto.buffer,
//                 `instructor-backgrounds/${user.id}-${Date.now()}-${parsed.data.bgPhoto.originalname}`,
//                 parsed.data.bgPhoto.mimetype,
//                 "instructor-backgrounds"
//             );

//             updateData.bgPhoto = bgUpload.url;
//             updateData.bgPhotoKey = bgUpload.key;

//             // Mark old key for deletion
//             if (existingProfile.bgPhotoKey) {
//                 oldKeys.push(existingProfile.bgPhotoKey);
//             }
//         } catch (error) {
//             // Cleanup if cover photo was uploaded but bg failed
//             if (updateData.coverPhotoKey) {
//                 await deleteFromS3(updateData.coverPhotoKey).catch(console.error);
//             }

//             throw new AppError(
//                 500,
//                 "Failed to upload background photo",
//                 ErrorType.FILE_UPLOAD
//             );
//         }
//     }

//     // Step 8: Update profile in database
//     const updatedProfile = await prisma.creatorProfile.update({
//         where: { userId: user.id },
//         data: updateData,
//         select: {
//             id: true,
//             displayName: true,
//             about: true,
//             tagline: true,
//             email: true,
//             coverPhoto: true,
//             bgPhoto: true,
//             twitter: true,
//             linkedin: true,
//             youtube: true,
//             website: true,
//             updatedAt: true,
//         },
//     });

//     // Step 9: Delete old images from S3
//     if (oldKeys.length > 0) {
//         Promise.allSettled(oldKeys.map((key) => deleteFromS3(key))).catch(
//             console.error
//         );
//     }

//     return sendSuccess(res, 200, "Instructor profile updated successfully", {
//         profile: updatedProfile,
//     });
// });

export const getInstructor = asyncHandler(async (req: Request, res: Response) => {
    const { instructorId } = req.params;

    if (!instructorId) {
        sendError(res, 400, "Instructor ID is required");
    }

    const instructor = await prisma.creatorProfile.findUnique({
        where: { id: instructorId },
        select: {
            id: true,
            displayName: true,
            about: true,
            tagline: true,
            coverPhoto: true,
            bgPhoto: true,
            twitter: true,
            linkedin: true,
            youtube: true,
            website: true,
            isVerified: true,
            createdAt: true,
            products: {
                select: {
                    id: true,
                    name: true,
                    price: true,
                    thumbnail: true,
                },
                take: 6,
            },
            _count: {
                select: {
                    products: true,
                },
            },

        },
    });

    if (!instructor) {
        sendError(res, 404, "Instructor profile not found");
    }

    return sendSuccess(res, 200, "Instructor profile retrieved", {
        instructor,
    });
});


export const deleteInstructor = asyncHandler(async (req: Request, res: Response) => {
    const user = req.user;
    if (!user?.id) {
        sendError(res, 401, "Authentication required");
    }

    const profile = await prisma.creatorProfile.findUnique({
        where: { id: user?.id },
    });

    if (!profile) {
        sendError(res, 404, "Instructor profile not found");
    }

    // Check if instructor has active products
    const activeProducts = await prisma.product.count({
        where: {
            creatorId: profile?.id,
        },
    });

    if (activeProducts > 0) {
        sendError(
            res,
            400,
            "Cannot delete instructor profile with active products"
        );
    }

    // Soft delete by setting isActive to false
    await prisma.creatorProfile.update({
        where: { id: user?.id },
        data: { isVerified: false },
    });

    return sendSuccess(res, 200, "Instructor profile deactivated successfully");
});