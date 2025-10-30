import { inngest } from "@/services/inngest/client";
import { clerkCreateOrganization, clerkCreateOrgMembership, clerkCreateUser, clerkDeleteOrganization, clerkDeleteOrgMembership, clerkDeleteUser, clerkUpdateOrganization, clerkUpdateUser } from "@/services/inngest/functions/clerk";
import { prepareDailyOrganizationUserApplicationNotifications, prepareDailyUserJobListingNotifications, sendDailyOrganizationUserApplicationEmail, sendDailyUserJobListingEmail } from "@/services/inngest/functions/email";
import { rankApplication } from "@/services/inngest/functions/jobListingApplication";
import { createAiSummaryOfUploadedResume } from "@/services/inngest/functions/resumes";
import { serve } from "inngest/next";

// Create an API that serves zero functions
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    clerkCreateUser,
    clerkUpdateUser,
    clerkDeleteUser,
    clerkCreateOrganization,
    clerkUpdateOrganization,
    clerkDeleteOrganization,
    createAiSummaryOfUploadedResume,
    rankApplication,
    prepareDailyUserJobListingNotifications,
    sendDailyUserJobListingEmail,
    clerkCreateOrgMembership,
    clerkDeleteOrgMembership,
    prepareDailyOrganizationUserApplicationNotifications,
    sendDailyOrganizationUserApplicationEmail
  ],
});