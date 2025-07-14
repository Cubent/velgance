'use client';

import { usePathname } from 'next/navigation';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,

  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@repo/design-system/components/ui/sidebar';
import { cn } from '@repo/design-system/lib/utils';
import {
  AnchorIcon,
  BookOpenIcon,
  BotIcon,
  LayoutDashboardIcon,
  LifeBuoyIcon,
  PieChartIcon,
  SendIcon,
  Settings2Icon,
  SquareTerminalIcon,
  MessageSquareIcon,
  CreditCardIcon,
  UserIcon,
  BellIcon,
  ShieldIcon,
  HelpCircleIcon,
  BarChart3,
  Activity,
  Zap,
  DollarSign,
  Lock,
} from 'lucide-react';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { Search } from './search';

type GlobalSidebarProperties = {
  readonly children: ReactNode;
};

const data = {
  user: {
    name: 'shadcn',
    email: 'm@example.com',
    avatar: '/avatars/shadcn.jpg',
  },
  navMain: [
    {
      title: 'Dashboard',
      url: '/dashboard',
      icon: LayoutDashboardIcon,
    },
    {
      title: 'Profile',
      url: '/profile',
      icon: UserIcon,
    },
  ],
  navUsageMetrics: [
    {
      title: 'Cubent Units',
      url: '/profile/usage',
      icon: BarChart3,
      locked: false,
      grey: true,
    },
    {
      title: 'Request Tracking',
      url: '/usage/requests',
      icon: Activity,
      locked: false,
    },
    {
      title: 'Token Usage',
      url: '/usage/tokens',
      icon: Zap,
      locked: false,
    },
    {
      title: 'Cost Tracking',
      url: '/usage/cost',
      icon: DollarSign,
      locked: false,
    },
  ],

  navSecondary: [
    {
      title: 'Documentation',
      url: 'https://docs.cubent.dev',
      icon: BookOpenIcon,
    },
  ],
};

export const GlobalSidebar = ({ children }: GlobalSidebarProperties) => {
  const sidebar = useSidebar();
  const pathname = usePathname();

  return (
    <>
      <Sidebar variant="inset" className="h-full max-h-[calc(100vh-4rem)]">
        {/* Logo positioned at header height */}
        <div className="hidden md:flex items-center gap-2 px-4 py-3 h-14 border-b border-sidebar-border bg-sidebar">
          <img src="/logo.svg" alt="Cubent" width="32" height="32" className="dark:invert" />
          <span className="font-medium text-base">Cubent</span>
        </div>
        <SidebarHeader>
          {/* Organization selector removed */}
        </SidebarHeader>
        {/* Search hidden */}
        <SidebarContent className="flex-1 overflow-y-auto">
          <SidebarGroup>
            <SidebarGroupLabel className="text-gray-400">Dashboard</SidebarGroupLabel>
            <SidebarMenu>
              {data.navMain.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
                    isActive={pathname === item.url}
                    size="lg"
                    className="h-12 px-4"
                  >
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel className="text-gray-400">Usage Metrics</SidebarGroupLabel>
            <SidebarMenu>
              {data.navUsageMetrics.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
                    isActive={pathname === item.url}
                    size="lg"
                    className={`h-12 px-4 ${item.locked ? 'opacity-50 cursor-not-allowed' : ''} ${item.grey ? 'text-gray-400' : ''}`}
                  >
                    {item.locked ? (
                      <div className="flex items-center gap-2 w-full">
                        <item.icon />
                        <span>{item.title}</span>
                        <Lock className="h-3 w-3 ml-auto" />
                      </div>
                    ) : (
                      <Link href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                        {item.grey && (
                          <Lock className="h-3 w-3 ml-auto" />
                        )}
                      </Link>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>



          <SidebarGroup className="mt-auto">
            <SidebarGroupContent>
              <SidebarMenu>
                {data.navSecondary.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === item.url}
                    >
                      <Link
                        href={item.url}
                        {...(item.url.startsWith('http') && {
                          target: '_blank',
                          rel: 'noopener noreferrer'
                        })}
                      >
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          {/* User profile moved to header */}
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className="flex-1">
        {children}
      </SidebarInset>
    </>
  );
};
