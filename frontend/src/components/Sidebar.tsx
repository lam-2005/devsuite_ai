"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import Logo from "./Logo";
import Link from "next/link";
import {
  FileCode,
  Folder,
  KeyRound,
  LayoutDashboard,
  Logs,
  Terminal,
  type LucideIcon,
} from "lucide-react";
import { usePathname } from "next/navigation";

interface LinkDetailType {
  icon: LucideIcon;
  name: string;
  url: string;
}

const links: {
  errorMonitor: LinkDetailType[];
  testGenerator: LinkDetailType[];
  setting: LinkDetailType[];
} = {
  errorMonitor: [
    {
      icon: LayoutDashboard,
      name: "Dashboard",
      url: "/dashboard",
    },
    {
      icon: Logs,
      name: "Logs",
      url: "/logs",
    },
  ],
  testGenerator: [
    {
      icon: FileCode,
      name: "Create Script",
      url: "/create-script",
    },
    {
      icon: Folder,
      name: "Repository",
      url: "/repository",
    },
  ],
  setting: [
    {
      icon: KeyRound,
      name: "API Keys",
      url: "/apikeys",
    },
    {
      icon: Terminal,
      name: "AI Engine",
      url: "/ai-engine",
    },
  ],
};

const AppSidebar = () => {
  const pathname = usePathname();
  return (
    <div>
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <Logo />
        </SidebarHeader>
        <SidebarContent>
          {/**/}
          <SidebarGroup>
            <SidebarGroupLabel>Error Monitor</SidebarGroupLabel>
            <SidebarMenu>
              {links.errorMonitor.map((link) => (
                <SidebarMenuItem key={link.name}>
                  <SidebarMenuButton
                    isActive={pathname === link.url}
                    tooltip={link.name}
                    render={
                      <Link href={link.url}>
                        <link.icon />
                        <span>{link.name}</span>
                      </Link>
                    }
                  />
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>

          {/**/}
          {/* <SidebarGroup>
            <SidebarGroupLabel>API Testing</SidebarGroupLabel>
            <SidebarMenu>
              {links.testGenerator.map((link) => (
                <SidebarMenuItem key={link.name}>
                  <SidebarMenuButton
                    isActive={pathname === link.url}
                    tooltip={link.name}
                    render={
                      <Link href={link.url}>
                        <link.icon />
                        <span>{link.name}</span>
                      </Link>
                    }
                  />
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup> */}

          {/**/}
          <SidebarGroup>
            <SidebarGroupLabel>Settings & Security</SidebarGroupLabel>
            <SidebarMenu>
              {links.setting.map((link) => (
                <SidebarMenuItem key={link.name}>
                  <SidebarMenuButton
                    isActive={pathname === link.url}
                    tooltip={link.name}
                    render={
                      <Link href={link.url}>
                        <link.icon />
                        <span>{link.name}</span>
                      </Link>
                    }
                  />
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>User Icon</SidebarFooter>
      </Sidebar>
    </div>
  );
};

export default AppSidebar;
