import { Bell, Menu, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/AuthContext';
import { UserAvatar } from '@/components/user-avatar';
import { useTranslation } from 'react-i18next';
import { profileMenuItems } from '@/constants/header';
import { useNavigate } from 'react-router-dom';
import LanguageSwitcher from '@/components/LanguageSwitcher';

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {

  const { t } = useTranslation();
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const signOut = async () => {
    await logout();
  }

  return (
    <header className="bg-background border-b border-gray-200 h-16">
      <div className="h-full px-5 flex items-center justify-between">
        {/* Left side */}
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onMenuClick}
            className="hover:bg-gray-100 lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>
          {/* Logo */}
          <img
            src="/logo/solumada-long.png"
            alt="logo"
            className="w-auto h-10 rounded-full object-contain max-sm:hidden"
          />
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-4">
          {/* Langues switcher */}
          <LanguageSwitcher />
          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="relative hover:bg-gray-100">
                <Bell className="h-5 w-5" />
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                >
                  3
                </Badge>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>{t("header.notifications.title")}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="flex-col items-start py-3">
                <div className="font-medium">Security Policy Review Due</div>
                <div className="text-sm text-gray-500">Due in 2 days - Assigned to you</div>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex-col items-start py-3">
                <div className="font-medium">New Risk Assessment</div>
                <div className="text-sm text-gray-500">Requires your approval</div>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex-col items-start py-3">
                <div className="font-medium">Document Updated</div>
                <div className="text-sm text-gray-500">Incident Response Plan v2.1</div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User menu */}
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="space-x-2 hover:bg-gray-100 h-fit">
                  <div className="flex items-center p-1 gap-2">
                    <UserAvatar
                      id={user.id}
                      name={user.name}
                      className="my-0.5"
                    />
                    <div className="hidden md:block text-left">
                      <div className="font-medium text-sm text-gray-900">{user.name}</div>
                      <div className="text-xs text-gray-500">{user.role}</div>
                    </div>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>{t("header.profile.title")}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {profileMenuItems.map((item, index) => (
                  <DropdownMenuItem key={index} onClick={() => navigate(item.path)}>
                    <item.icon className="mr-2 h-4 w-4" />
                    {t(item.labelKey)}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={signOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  {t("header.profile.logout")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
}