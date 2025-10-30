import { Badge } from "@/components/ui/badge";
import { JobListingTable } from "@/drizzle/schema";
import { ComponentProps } from "react";
import { formatExperienceLevel, formatJobListingLocation, formatJobType, formatLocationRequirement, formatWage } from "../lib/formatters";
import { BanknoteIcon, BuildingIcon, GraduationCap, HourglassIcon, MapPinIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function JobListingBadges({
  jobListing: {
    wage,
    wageInterval,
    stateAbbreviation,
    city,
    type,
    experienceLevel,
    locationRequirement,
    isFeatured,
  },
  className,
}: {
  jobListing: Pick<
    typeof JobListingTable.$inferSelect,
    | "wage"
    | "wageInterval"
    | "stateAbbreviation"
    | "city"
    | "type"
    | "experienceLevel"
    | "locationRequirement"
    | "isFeatured"
  >
  className?: string
}){
    const badgeProps = {
        variant: "outline",
        className
    } satisfies ComponentProps<typeof Badge>

    return (
        <>
        {isFeatured && (
            <Badge {...badgeProps} className={cn(className, "border-featured bg-featured/50 text-featured-foreground")}>
                Featured
            </Badge>
        )}
          {wage != null && wageInterval != null && (
            <Badge {...badgeProps}>
              <BanknoteIcon/>
               {formatWage(wage, wageInterval)}
            </Badge>
          )}
          {(stateAbbreviation != null || city != null) && (
            <Badge {...badgeProps}>
              <MapPinIcon className="size-1"/>
              {formatJobListingLocation({stateAbbreviation, city})}
            </Badge>
          )} 
          <Badge {...badgeProps}>
              <BuildingIcon/>
              {formatLocationRequirement(locationRequirement)}
          </Badge> 
           <Badge {...badgeProps}>
              <HourglassIcon/>
              {formatJobType(type)}
          </Badge> 
          <Badge {...badgeProps}>
              <GraduationCap/>
              {formatExperienceLevel(experienceLevel)}
          </Badge> 
        </>
    )
}