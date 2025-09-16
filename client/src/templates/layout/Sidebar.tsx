import { Link, NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  ChevronLeft,
  ChevronRight,
  LogOut,
  Shield,
  X
} from 'lucide-react';
import { menuItems, otherMenuItems } from '@/constants/navigation';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { usePermissions } from '@/hooks/use-permissions';
import { profileMenuItems } from '@/constants/header';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useAuth } from '@/contexts/AuthContext';
import { useMemo } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { useIsMobile } from '@/hooks/use-is-mobile';


type SidebarItemProps = {
  path?: string;
  icon: React.ComponentType<{ className?: string }>;
  labelKey: string;
  onClick?: () => void;
};

const SidebarItem = ({ path, icon: Icon, labelKey, onClick }: SidebarItemProps) => {
  const { t } = useTranslation();

  const content = (
    <div className="flex flex-col items-center gap-1 text-gray-400 hover:text-gray-200">
      <Icon className="h-5 w-5" />
    </div>
  );

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        {path ? (
          <Link to={path}>{content}</Link>
        ) : (
          <button type="button" onClick={onClick}>
            {content}
          </button>
        )}
      </TooltipTrigger>
      <TooltipContent>
        <p>{t(labelKey)}</p>
      </TooltipContent>
    </Tooltip>
  );
};

type SidebarActionsProps = {
  items: Array<{ path: string; icon: React.ComponentType<{ className?: string }>; labelKey: string }>;
  onLogout: () => void;
  collapsed?: boolean;
};

export const SidebarActions = ({
  items,
  onLogout,
  collapsed = false,
}: SidebarActionsProps) => {
  return (
    <div className={cn("grid place-items-center", !collapsed ? "grid-cols-3" : "grid-cols-1 gap-3")}>
      {
        items.map((item, index) => (
          <SidebarItem key={index} {...item} />
        ))}

      <SidebarItem icon={LogOut} labelKey="sidebar.logout" onClick={onLogout} />
    </div>
  );
};


interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const { t } = useTranslation();
  const { hasAccessPermission } = usePermissions();
  const { logout, user } = useAuth();
  const isMobile = useIsMobile(1024);

  const [sidebarCollapsed, setSidebarCollapsed] = useLocalStorage(`sidebar-collapse-${user?.id}`, false);

  // filtrer les items de menu en fonction des permissions
  const filteredMenuItems = useMemo(() => {
    return menuItems.filter(item => hasAccessPermission(item.requiredPermission))
  }, [hasAccessPermission]);

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75 z-20 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-30 w-64 bg-gradient-to-br from-theme-2 via-theme-2 to-theme-2-dark shadow-lg transform transition-all duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
        isOpen ? "translate-x-0" : "-translate-x-full",
        sidebarCollapsed && "w-20",
      )}>
        <div className="flex flex-col h-full">
          {/* Logo and close button */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-theme-2-muted relative">
            <div className="flex items-center space-x-2 relative z-20">
              <Shield className="h-8 w-8 text-theme" />
              {!sidebarCollapsed && (
                <span className="text-xl font-bold text-gray-200 whitespace-nowrap">{t("sidebar.title")}</span>
              )}
            </div>
            <div className={cn(
              "absolute z-10 top-0 right-0 rotate-45 translate-x-1/2 h-full scale-[0.707] aspect-square bg-theme-2 flex items-center justify-center",
              (!isOpen && isMobile) && "hidden"
            )}>
              <div className="-rotate-45 scale-[1.414] aspect-square flex items-center justify-center">
                <button
                  onClick={() => setIsOpen(false)}
                  className="lg:hidden p-1 rounded-md text-gray-400 hover:bg-white/5"
                >
                  <X className="h-5 w-5" />
                </button>
                <Button
                  variant="ghost"
                  onClick={() => setSidebarCollapsed(prev => !prev)}
                  className={cn(
                    "outline-transparent hidden lg:flex",
                    "text-gray-400 hover:text-white hover:bg-transparent focus-visible:outline-transparent"
                  )}
                >
                  {sidebarCollapsed ? (
                    <ChevronRight className="h-5 w-5" />
                  ) : (
                    <ChevronLeft className="h-5 w-5" />
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <ScrollArea className="flex-1 px-4 py-6 space-y-0">
            {filteredMenuItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) => cn(
                    "w-full flex items-center gap-3 p-3 h-22 text-left rounded-lg transition-colors duration-200 outline-transparent",
                    isActive
                      ? "bg-theme-2-muted/60 text-theme"
                      : "text-gray-300 hover:bg-white/5 hover:text-white",
                    "border-b border-theme-2-muted",
                  )}
                >
                  {({ isActive }) => !sidebarCollapsed ? (
                    <>
                      <Icon className={cn(
                        "h-6 w-6 shrink-0",
                        isActive ? "text-theme" : "text-gray-300"
                      )} />
                      <div className={cn("flex-1")}>
                        <div className="font-medium">{t(item.labelKey)}</div>
                        <div className={cn(
                          "text-xs mt-0.5 line-clamp-2 font-light",
                          isActive ? "text-theme" : "text-gray-400"
                        )}>{t(item.descriptionKey)}</div>
                      </div>
                    </>
                  ) : (
                    <HoverCard>
                      <HoverCardTrigger asChild>
                        <Icon className={cn(
                          "h-6 w-6 shrink-0 aspect-square",
                          isActive ? "text-theme-1" : "text-gray-300"
                        )} />
                      </HoverCardTrigger>
                      <HoverCardContent side='left' sideOffset={16} className='bg-theme-2-muted rounded-lg border-theme-2'>
                        <div className={cn("flex-1")}>
                          <div className="font-medium text-muted">{t(item.labelKey)}</div>
                          <div className={cn(
                            "text-xs mt-0.5 line-clamp-2 font-light",
                            isActive ? "text-theme-1" : "text-gray-400"
                          )}>{t(item.descriptionKey)}</div>
                        </div>
                      </HoverCardContent>
                    </HoverCard>
                  )}
                </NavLink>
              );
            })}
          </ScrollArea>

          {/* Other menus */}
          <div className="p-4">
            <h3 className='text-gray-400 text-xs flex items-center gap-1'>
              <hr className='w-1 border-theme-2-muted' />
              <span>{t("navigation.others.title")}</span>
              <hr className='flex-1 border-theme-2-muted' />
            </h3>
            <div className="w-full space-y-1 my-2">
              {otherMenuItems.map((item, index) => (
                <NavLink
                  key={index}
                  to={item.path}
                  className={({ isActive }) => cn('rounded-lg flex items-center gap-2 text-sm text-gray-300 hover:bg-white/5 p-2', isActive && 'bg-white/5')}
                  title={t(item.descriptionKey)}
                >
                  {({ isActive }) => (
                    <>
                      {<item.icon className={cn('w-5 h-5 shrink-0', isActive && 'text-theme')} />}
                      <span className={cn('line-clamp-1', isActive && 'text-theme')}>
                        {t(item.labelKey)}
                      </span>
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-theme-2-muted">
            <div className="text-xs text-gray-500 text-center">
              {/* Actions */}
              <SidebarActions collapsed={sidebarCollapsed} items={profileMenuItems} onLogout={logout} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}