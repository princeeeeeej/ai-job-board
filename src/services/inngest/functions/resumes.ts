import { db } from "@/drizzle/db";
import { inngest } from "../client";
import { eq } from "drizzle-orm";
import { UserResumeTable } from "@/drizzle/schema";
import { env } from "@/data/env/server";
import { updateUserResume } from "@/features/users/db/userResumes";

export const createAiSummaryOfUploadedResume = inngest.createFunction(
  {
    id: "create-ai-summary-of-uploaded-resume",
    name: "Create AI Summary of Uploaded Resume",
  },
  {
    event: "app/resume.uploaded",
  },
  async ({ step, event }) => {
    const { id: userId } = event.user;

    const userResume = await step.run("get-user-resume", async () => {
      return await db.query.UserResumeTable.findFirst({
        where: eq(UserResumeTable.userId, userId),
        columns: { resumeFileUrl: true },
      });
    });

    if (!userResume) return;

    const response = await fetch(userResume.resumeFileUrl);
    if (!response.ok) throw new Error("Failed to fetch resume file");

    const pdfBuffer = Buffer.from(await response.arrayBuffer());
    const base64Pdf = pdfBuffer.toString("base64");

    const result = await step.ai.infer("create-ai-summary", {
      model: step.ai.models.gemini({
        model: "gemini-2.0-flash",
        apiKey: env.GEMINI_API_KEY,
      }),
      body: {
        contents: [
          {
            role: "user",
            parts: [
              {
                inlineData: {
                  mimeType: "application/pdf",
                  data: base64Pdf,
                },
              },
              {
                text: "Summarize the following resume and extract all key skills, experience, and qualifications. The summary should include all the information that a hiring manager would need to know about the candidate in order to determine if they are a good fit for a job. This summary should be formatted as markdown. Do not return any other text. If the file does not look like a resume return the text 'N/A'.",
              },
            ],
          },
        ],
      },
    });

    await step.run("save-ai-summary", async () => {
      // Safely extract summary text
      const parts = result?.candidates?.[0]?.content?.parts;

      // Explicit type assertion + guard
      const textPart = Array.isArray(parts)
        ? (parts.find(
            (part): part is { text: string } =>
              typeof (part as any).text === "string"
          ) ?? null)
        : null;

      const message = textPart?.text?.trim() || "N/A";

      if (message === "N/A" || message.length === 0) return;

      await updateUserResume(userId, { aiSummary: message });
    });
  }
);
