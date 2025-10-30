import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { getCurrentUser } from "../clerk/lib/getCurrentUser";
import { inngest } from "../inngest/client";
import { db } from "@/drizzle/db";
import { eq } from "drizzle-orm";
import { UserResumeTable } from "@/drizzle/schema";
import { uploadthing } from "./client";
import { upsertUserResume } from "@/features/users/db/userResumes";

const f = createUploadthing();


// FileRouter for your app, can contain multiple FileRoutes
export const customFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  reumeUploader: f({
    pdf: {
      
      maxFileSize: "8MB",
      maxFileCount: 1,
    },
  }, {awaitServerData: true})
    // Set permissions and file types for this FileRoute
    .middleware(async () => {
      const {userId} = await getCurrentUser()
      if(userId == null) throw new UploadThingError("Unauthorized")

      return { userId };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      const {userId} = metadata
      const resumeFileKey = await getUserResumeFileKey(userId)

      await upsertUserResume(userId, {
        resumeFileUrl : file.ufsUrl,
        resumeFileKey : file.key
      })
      if(resumeFileKey != null){
        await uploadthing.deleteFiles(resumeFileKey)
      }

      //todo
      await inngest.send({ name: "app/resume.uploaded", user : { id: userId}})

      return { message: "Resume upload Successfully" };
    }),
} satisfies FileRouter;

export type CustomFileRouter = typeof customFileRouter;


async function getUserResumeFileKey(userId: string){
    const data = await db.query.UserResumeTable.findFirst({
        where: eq(UserResumeTable.userId, userId),
        columns: {
            resumeFileKey: true
        }
    })

    return data?.resumeFileKey
}