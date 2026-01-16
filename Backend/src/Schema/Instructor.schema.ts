import { z } from "zod";
import type { Express } from "express";

/* -------------------------------------------------------------------------- */
/*                                   CONSTANTS                                */
/* -------------------------------------------------------------------------- */

const NAME_MIN_LENGTH = 3;
const NAME_MAX_LENGTH = 50;
const ABOUT_MIN_LENGTH = 50;
const ABOUT_MAX_LENGTH = 2000;
const TAGLINE_MIN_LENGTH = 10;
const TAGLINE_MAX_LENGTH = 150;

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
] as const;

/* -------------------------------------------------------------------------- */
/*                               ERROR MESSAGES                                */
/* -------------------------------------------------------------------------- */

const ERROR_MESSAGES = {
  displayName: {
    required: "Display name is required",
    minLength: `Display name must be at least ${NAME_MIN_LENGTH} characters`,
    maxLength: `Display name must not exceed ${NAME_MAX_LENGTH} characters`,
    invalid: "Display name can only contain letters, numbers, spaces, and hyphens",
  },
  about: {
    required: "About section is required",
    minLength: `About section must be at least ${ABOUT_MIN_LENGTH} characters`,
    maxLength: `About section must not exceed ${ABOUT_MAX_LENGTH} characters`,
  },
  tagline: {
    required: "Tagline is required",
    minLength: `Tagline must be at least ${TAGLINE_MIN_LENGTH} characters`,
    maxLength: `Tagline must not exceed ${TAGLINE_MAX_LENGTH} characters`,
  },
  email: {
    required: "Email address is required",
    invalid: "Please enter a valid email address",
  },
  file: {
    type: "File must be a valid image",
    size: `Image must not exceed ${MAX_IMAGE_SIZE / 1024 / 1024}MB`,
    format: `Allowed formats: ${ALLOWED_IMAGE_TYPES.join(", ")}`,
  },
  social: {
    invalidUrl: "Please enter a valid URL",
    twitter: "Please enter a valid Twitter/X profile URL",
    linkedin: "Please enter a valid LinkedIn profile URL",
    youtube: "Please enter a valid YouTube channel URL",
    website: "Please enter a valid website URL",
  },
};

/* -------------------------------------------------------------------------- */
/*                            HELPER VALIDATORS                                 */
/* -------------------------------------------------------------------------- */

const isValidUrl = (url: string): boolean => {
  try {
    const u = new URL(url);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
};

const twitterRegex =
  /^https?:\/\/(www\.)?(twitter\.com|x\.com)\/[a-zA-Z0-9_]{1,15}\/?$/;

const linkedinRegex =
  /^https?:\/\/(www\.)?linkedin\.com\/(in|company)\/[a-zA-Z0-9_-]+\/?$/;

const youtubeRegex =
  /^https?:\/\/(www\.)?youtube\.com\/(c\/|channel\/|user\/|@)[\w-]+\/?$/;

/* -------------------------------------------------------------------------- */
/*                                FILE SCHEMA                                   */
/* -------------------------------------------------------------------------- */

const fileSchema = z
  .custom<Express.Multer.File>(
    (file): file is Express.Multer.File =>
      typeof file === "object" &&
      file !== null &&
      "size" in file &&
      "mimetype" in file,
    { message: ERROR_MESSAGES.file.type }
  )
  .refine((file) => file.size <= MAX_IMAGE_SIZE, {
    message: ERROR_MESSAGES.file.size,
  })
  .refine((file) => ALLOWED_IMAGE_TYPES.includes(file.mimetype as any), {
    message: ERROR_MESSAGES.file.format,
  });

/* -------------------------------------------------------------------------- */
/*                              SOCIAL SCHEMAS                                  */
/* -------------------------------------------------------------------------- */

const optionalUrl = z
  .string()
  .trim()
  .refine((v) => v === "" || isValidUrl(v), {
    message: ERROR_MESSAGES.social.invalidUrl,
  })
  .optional();

const twitterSchema = optionalUrl.refine(
  (v) => !v || twitterRegex.test(v),
  { message: ERROR_MESSAGES.social.twitter }
);

const linkedinSchema = optionalUrl.refine(
  (v) => !v || linkedinRegex.test(v),
  { message: ERROR_MESSAGES.social.linkedin }
);

const youtubeSchema = optionalUrl.refine(
  (v) => !v || youtubeRegex.test(v),
  { message: ERROR_MESSAGES.social.youtube }
);

const websiteSchema = optionalUrl;

/* -------------------------------------------------------------------------- */
/*                             MAIN INSTRUCTOR SCHEMA                           */
/* -------------------------------------------------------------------------- */

export const instructorSchema = z
  .object({
    displayName: z
      .string()
      .trim()
      .min(NAME_MIN_LENGTH, ERROR_MESSAGES.displayName.minLength)
      .max(NAME_MAX_LENGTH, ERROR_MESSAGES.displayName.maxLength)
      .regex(/^[a-zA-Z0-9\s-]+$/, ERROR_MESSAGES.displayName.invalid),

    about: z
      .string()
      .trim()
      .min(ABOUT_MIN_LENGTH, ERROR_MESSAGES.about.minLength)
      .max(ABOUT_MAX_LENGTH, ERROR_MESSAGES.about.maxLength),

    tagline: z
      .string()
      .trim()
      .min(TAGLINE_MIN_LENGTH, ERROR_MESSAGES.tagline.minLength)
      .max(TAGLINE_MAX_LENGTH, ERROR_MESSAGES.tagline.maxLength),

    email: z
      .string()
      .trim()
      .toLowerCase()
      .email(ERROR_MESSAGES.email.invalid),

    coverPhoto: fileSchema,
    bgPhoto: fileSchema,

    twitter: twitterSchema,
    linkedin: linkedinSchema,
    youtube: youtubeSchema,
    website: websiteSchema,
  })
  .strict();

/* -------------------------------------------------------------------------- */
/*                                  TYPES                                      */
/* -------------------------------------------------------------------------- */

export type InstructorSchemaInput = z.input<typeof instructorSchema>;
export type InstructorSchemaOutput = z.output<typeof instructorSchema>;

export interface ValidationResult<T> {
  success: boolean;
  data?: T;
  errors?: { field: string; message: string }[];
}

/* -------------------------------------------------------------------------- */
/*                             ERROR FORMATTER                                  */
/* -------------------------------------------------------------------------- */

export const formatZodErrors = (
  error: z.ZodError
): ValidationResult<never> => ({
  success: false,
  errors: error.issues.map((e) => ({
    field: e.path.join("."),
    message: e.message,
  })),
});

/* -------------------------------------------------------------------------- */
/*                               VALIDATOR                                      */
/* -------------------------------------------------------------------------- */

export const validateInstructorData = (
  data: unknown
): ValidationResult<InstructorSchemaOutput> => {
  const parsed = instructorSchema.safeParse(data);

  return parsed.success
    ? { success: true, data: parsed.data }
    : formatZodErrors(parsed.error);
};

/* -------------------------------------------------------------------------- */
/*                         PARTIAL UPDATE SCHEMA                                */
/* -------------------------------------------------------------------------- */

export const instructorUpdateSchema = instructorSchema.partial();
export type InstructorUpdateInput = z.input<typeof instructorUpdateSchema>;

/* -------------------------------------------------------------------------- */
/*                          FRONTEND SHARED RULES                               */
/* -------------------------------------------------------------------------- */

export const VALIDATION_RULES = {
  displayName: {
    minLength: NAME_MIN_LENGTH,
    maxLength: NAME_MAX_LENGTH,
    pattern: /^[a-zA-Z0-9\s-]+$/,
  },
  about: {
    minLength: ABOUT_MIN_LENGTH,
    maxLength: ABOUT_MAX_LENGTH,
  },
  tagline: {
    minLength: TAGLINE_MIN_LENGTH,
    maxLength: TAGLINE_MAX_LENGTH,
  },
  image: {
    maxSize: MAX_IMAGE_SIZE,
    allowedTypes: ALLOWED_IMAGE_TYPES,
  },
} as const;
