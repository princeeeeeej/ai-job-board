import { auth } from "@clerk/nextjs/server"

type PlanFeature =
  | "post_1_job_listing"
  | "post_3_job_listings"
  | "post_15_job_listings"
  | "1_featured_job_listing"
  | "unlimited_featured_jobs_listings"

export async function hasPlanFeature(feature: PlanFeature) {
  const { has } = await auth()
  return has({ feature })
}