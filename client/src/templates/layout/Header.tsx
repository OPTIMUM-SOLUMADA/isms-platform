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
// import { profileMenuItems } from '@/constants/header';
import { useNavigate } from 'react-router-dom';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { notificationService } from '@/services/notificationService';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {

  const { t } = useTranslation();
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Fetch notifications
  const { data: notificationsData, isLoading: notificationsLoading } = useQuery({
    queryKey: ['notifications', user?.id],
    queryFn: async () => {
      const response = await notificationService.list({ limit: 5 });
      return response.data;
    },
    enabled: !!user?.id,
  });

  const notifications = notificationsData?.notifications || [];
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const signOut = async () => {
    await logout();
  }

  const handleNotificationClick = async (notificationId: string, documentId?: string | null) => {
    // Mark as read
    await notificationService.markAsRead(notificationId);
    // Navigate to document if exists
    if (documentId) {
      navigate(`/documents/${documentId}`);
    }
  };

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
                {unreadCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                  >
                    {unreadCount}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            
            <DropdownMenuContent align="end" className="w-80">
              {/* Distinct header section */}
              <DropdownMenuItem className="p-0 cursor-default" disabled>
                <div className="px-4 pt-3 pb-2 flex items-center justify-between w-full">
                  <div className="text-base font-bold text-black">
                    Notifications
                  </div>
                </div>
              </DropdownMenuItem>
              <DropdownMenuSeparator />

              {/* Header actions */}
              <div className="px-4 mt-3 pb-2 flex items-center justify-between text-xs">
                {/* Left: delete all */}
                <button
                  className="text-destructive hover:underline transition"
                  onClick={() => {
                    // delete all
                  }}
                >
                  Effacer les notifications
                </button>

                {/* Right: mark all read */}
                <button
                  className="text-primary hover:underline transition"
                  onClick={async () => {
                    await notificationService.markAllAsRead();
                    // Refresh notifications queries
                    await queryClient.invalidateQueries({ queryKey: ['notifications'] });
                  }}
                >
                  Marquer tout comme lu
                </button>
              </div>

              
              {notificationsLoading ? (
                <div className="p-4 space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  ))}
                </div>
              ) : notifications.length === 0 ? (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  Aucune notification
                </div>
              ) : (
                notifications.map((notification) => (
                  <DropdownMenuItem 
                    key={notification.id}
                    className="flex-col items-start py-3 cursor-pointer"
                    onClick={() => handleNotificationClick(notification.id, notification.documentId)}
                  >
                    <div className="flex items-center gap-2 w-full">
                      <div className="font-medium flex-1">{notification.title}</div>
                      {!notification.isRead && (
                        <div className="h-2 w-2 rounded-full bg-blue-500" />
                      )}
                    </div>
                    <div className="text-sm text-gray-500">{notification.message}</div>
                    <div className="text-xs text-gray-400 mt-1">
                      {formatDistanceToNow(new Date(notification.createdAt), {
                        addSuffix: true,
                        locale: fr,
                      })}
                    </div>
                  </DropdownMenuItem>
                ))
              )}
              {notifications.length > 0 && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    className="text-center justify-center text-sm text-primary"
                    onClick={() => navigate('/notifications')}
                  >
                    Voir toutes les notifications
                  </DropdownMenuItem>
                </>
              )}
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
                      <div className="text-xs text-gray-500">{t(`role.options.${user.role?.toLowerCase()}`, { defaultValue: user.role})}</div>
                    </div>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>{t("header.profile.title")}</DropdownMenuLabel>
                {/* <DropdownMenuSeparator />
                {profileMenuItems.map((item, index) => (
                  <DropdownMenuItem key={index} onClick={() => navigate(item.path)}>
                    <item.icon className="mr-2 h-4 w-4" />
                    {t(item.labelKey)}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator /> */}
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