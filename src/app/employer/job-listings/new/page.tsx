import { Card, CardContent } from "@/components/ui/card";
import { JobListingForm } from "@/features/jobListings/components/JobListingForm";

export default function NewJobListingPage() {
  return (
    <div className="max-w-5xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-2">New Job Listing</h1>
      <p className="text-muted-foreground mb-6">
        This does not post the listing yet. It just save a draft
      </p>
      <Card>
        <CardContent>
          <JobListingForm
            jobListing={{
              title: "",
              description: "",
              stateAbbreviation: null,
              city: null,
              wage: null,
              wageInterval: "yearly",
              experienceLevel: "junior",
              type: "full-time",
              locationRequirement: "in-office",
              id: "", // or crypto.randomUUID() if needed
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
