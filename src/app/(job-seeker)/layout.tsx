import AppSidebar from "@/components/sidebar/AppSidebar";
import { SidebarNavMenuGroup } from "@/components/sidebar/SidebarMenuGroup";
import { SidebarUserButton } from "@/features/users/component/SidebarUserButton";
import {
  BrainCircuitIcon,
  ClipboardListIcon,
  LayoutDashboard,
  LogOutIcon,
} from "lucide-react";
import { ReactNode } from "react";

export default function JobSeekerLayout({
  children,
  sidebar,
}: {
  children: ReactNode;
  sidebar: ReactNode;
}) {
  return (
    <AppSidebar
      content={
        <>
          {sidebar}
          <SidebarNavMenuGroup
            className="mt-auto"
            items={[
              { href: "/", icon: <ClipboardListIcon />, label: "Job Board" },
              {
                href: "/ai-search",
                icon: <BrainCircuitIcon />,
                label: "AI Search",
              },
              {
                href: "/employer",
                icon: <LayoutDashboard />,
                label: "Employer Dashboard",
                authStatus: "signedIn",
              },
              {
                href: "/sign-in",
                icon: <LogOutIcon />,
                label: "Sign In",
                authStatus: "signedOut",
              },
            ]}
          />
        </>
      }
      footerButton={<SidebarUserButton />}
    >
      <h1 className="m-4 text-3xl">ApplyFlow</h1>
      {children}
    </AppSidebar>
  );
}
