import { AsyncIf } from "@/components/AsyncIf";
import AppSidebar from "@/components/sidebar/AppSidebar";
import { SidebarNavMenuGroup } from "@/components/sidebar/SidebarMenuGroup";
import { SidebarGroup, SidebarGroupAction, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { db } from "@/drizzle/db";
import { JobListingApplicationTable, JobListingStatus, JobListingTable } from "@/drizzle/schema";
import { sortJobListingsByStatus } from "@/features/jobListings/lib/utilis";
import { SidebarOrganizationButton } from "@/features/organization/component/SidebarOrganizationButton";
import { getCurrentOrganization } from "@/services/clerk/lib/getCurrentUser";
import { hasOrgUserPermission } from "@/services/clerk/lib/orgUserPermissions";
import { count, desc, eq } from "drizzle-orm";
import { ClipboardListIcon,LogOutIcon, PlusIcon } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ReactNode, Suspense } from "react";
import { JobListingMenuGroup } from "./_JobListingMenuGroup";

export default function EmployerLayout({children} : {children : ReactNode}){
    return (
        <Suspense>
            <EmployerSuspense>
                {children}
            </EmployerSuspense>
        </Suspense>
    )
}

async function EmployerSuspense({children} : {children : ReactNode}){
    const {orgId} = await getCurrentOrganization()

    if(orgId == null) return redirect("/organization/select")


    return (
        <AppSidebar content={
          <>
          <SidebarGroup>
            <SidebarGroupLabel className="text-md">Job Listings</SidebarGroupLabel>
            <AsyncIf condition={() => hasOrgUserPermission("org:job_listings:create")}>
              <SidebarGroupAction title="Add Job Listing" asChild>
                <Link href="/employer/job-listings/new">
                  <div>
                    <PlusIcon/><span className="sr-only">Add Job Listing</span>
                  </div>
                </Link>
            </SidebarGroupAction> 
            </AsyncIf>
            <SidebarGroupContent className="group-data-[state=collapsed]:hidden">
              <Suspense>
                <JobListingMenu orgId={orgId} />
              </Suspense>

            </SidebarGroupContent>
          </SidebarGroup>
            <SidebarNavMenuGroup className="mt-auto" items={[
                {href : "/", icon: <ClipboardListIcon/>, label: "Job Board"},
                {href : "/sign-in", icon: <LogOutIcon/>, label: "Sign In", authStatus: "signedOut"}
            ]}/>
          </>
        } 
        footerButton={<SidebarOrganizationButton />}
        >
        {children}
        </AppSidebar>
    )
}
  

async function JobListingMenu({orgId}: {orgId : string}){
  const jobListings = await getJobListings(orgId)
  if(jobListings.length === 0 && (await hasOrgUserPermission("org:job_listings:create"))){
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton asChild>
            <Link href="/employer/jo-listings/new">
              <PlusIcon/>
              <span>Create your first job listing</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    )
  }

  return Object.entries(Object.groupBy(jobListings, j => j.status)).sort(([a], [b]) =>{
    return sortJobListingsByStatus(a as JobListingStatus,b as JobListingStatus)
  }).map(([status,jobListings]) => (
    <JobListingMenuGroup key={status} status={status as JobListingStatus} jobListings={jobListings}/>
  ))
}

async function getJobListings(orgId: string){
  const data = await db.select({
    id: JobListingTable.id,
    title: JobListingTable.title,
    status: JobListingTable.status,
    applicationCount: count(JobListingApplicationTable.userId)
  })
  .from(JobListingTable)
  .where(eq(JobListingTable.organizationId, orgId))
  .leftJoin(
    JobListingApplicationTable,
    eq(JobListingTable.id, JobListingApplicationTable.jobListingId)
  )
  .groupBy(JobListingApplicationTable.jobListingId, JobListingTable.id)
  .orderBy(desc(JobListingTable.createdAt))

  return data
}