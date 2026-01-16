import z from "zod"

export const documentSchema = z.object({
   title: z.string('Not a valid name').min(3, 'Name must be at least 3 characters long').max(50, 'Name must be at most 50 characters long'),
   description: z.string('Not a valid description').min(3, 'Description must be at least 3 characters long').max(50, 'Description must be at most 50 characters long'),
   price: z.number('Not a valid price').min(0, 'Price must be at least 0').max(10000, 'Price must be at most 10000'),
   file: z.string('Not a valid file').min(3, 'File must be at least 3 characters long').max(50, 'File must be at most 50 characters long'),
   thumbnail: z.string('Not a valid thumbnail').min(3, 'Thumbnail must be at least 3 characters long').max(50, 'Thumbnail must be at most 50 characters long'),
   bgPhoto: z.string('Not a valid bgPhoto').min(3, 'BgPhoto must be at least 3 characters long').max(50, 'BgPhoto must be at most 50 characters long'),
})