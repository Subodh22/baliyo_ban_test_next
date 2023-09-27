import { publicProcedure, router } from "../trpc";
import AWS from 'aws-sdk';
import { z } from "zod";
 
const s3 = new AWS.S3({
    accessKeyId:process.env.AWS_ACCESS_KEY,
    secretAccessKey:process.env.AWS_SECERT_KEY
})
const BUCKET_NAME = process.env.AWS_ACCESS_KEY;
if (!BUCKET_NAME) {
    throw new Error('S3 Bucket name is not defined');
}
export const uploadRouter = router({
     
    getPresignedUrl: publicProcedure.input(z.object({
        filename: z.string()  // or generate a filename server-side if you prefer
      })).mutation(async ({ input }) => {
        const params = {
          Bucket: BUCKET_NAME,
          Key: `uploads/${input.filename}`,
          Expires: 60 * 15,  // URL expires in 15 minutes
          ContentType: 'image/jpeg'
        };
    
        try {
          const presignedUrl = await s3.getSignedUrlPromise('putObject', params);
          return { presignedUrl };
        } catch (error) {
          throw new Error('Failed to generate pre-signed URL');
        }
      }),

})

 