import { SidebarNavMenuGroup } from "@/components/sidebar/SidebarMenuGroup";
import { BellIcon, FileUser } from "lucide-react";

export function UserSettingsSidebar(){
    return (
        <SidebarNavMenuGroup items={[
            {
                href: "/user-settings/notifications",
                icon: <BellIcon/>,
                label: "Notifications"
            },
            {
                href: "/user-settings/resume",
                icon: <FileUser/>,
                label: "Resume"
            },
        ]} />
    )
}