import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { logout } from '../store/slices/authSlice';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { Menu, X, Home, Pill, Calendar, Bell, Users, LogOut, User, Settings } from 'lucide-react';
import RoleBasedComponent from './RoleBasedComponent';
import { ThemeToggle } from './ThemeToggle';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home, roles: ['ADMIN', 'CAREGIVER', 'SENIOR'] },
    { name: 'Medications', href: '/medications', icon: Pill, roles: ['ADMIN', 'CAREGIVER', 'SENIOR'] },
    { name: 'Schedules', href: '/schedules', icon: Calendar, roles: ['ADMIN', 'CAREGIVER', 'SENIOR'] },
    { name: 'Notifications', href: '/notifications', icon: Bell, roles: ['ADMIN', 'CAREGIVER', 'SENIOR'] },
    { name: 'Users', href: '/users', icon: Users, roles: ['ADMIN'] },
  ];

  const isActive = (href: string) => location.pathname === href;

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile menu */}
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden fixed top-4 left-4 z-50 bg-background/80 backdrop-blur-sm border"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-72 p-0 bg-sidebar">
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-6 border-b border-sidebar-border">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-sm">SC</span>
                </div>
                <h1 className="text-xl font-bold text-sidebar-foreground">Senior Care</h1>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-sidebar-foreground hover:bg-sidebar-accent"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            <nav className="flex-1 p-4 space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <RoleBasedComponent key={item.name} allowedRoles={item.roles as any}>
                    <Link
                      to={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                        isActive(item.href)
                          ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-sm'
                          : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.name}</span>
                    </Link>
                  </RoleBasedComponent>
                );
              })}
            </nav>
            <div className="p-4 border-t border-sidebar-border space-y-2">
              <div className="flex items-center justify-between px-2">
                <span className="text-xs text-sidebar-foreground/60">Theme</span>
                <ThemeToggle />
              </div>
              <Button
                variant="ghost"
                className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={handleLogout}
              >
                <LogOut className="mr-3 h-4 w-4" />
                Sign out
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop sidebar */}
      <div className="hidden md:flex md:w-72 md:flex-col md:fixed md:inset-y-0">
        <div className="flex flex-col flex-grow bg-sidebar border-r border-sidebar-border">
          <div className="flex items-center h-16 px-6 border-b border-sidebar-border">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">SC</span>
              </div>
              <h1 className="text-xl font-bold text-sidebar-foreground">Senior Care</h1>
            </div>
          </div>
          <nav className="flex-1 px-4 py-4 space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <RoleBasedComponent key={item.name} allowedRoles={item.roles as any}>
                  <Link
                    to={item.href}
                    className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive(item.href)
                        ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-sm'
                        : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Link>
                </RoleBasedComponent>
              );
            })}
          </nav>
          <div className="p-4 border-t border-sidebar-border space-y-3">
            <div className="flex items-center justify-between px-2">
              <span className="text-xs text-sidebar-foreground/60">Theme</span>
              <ThemeToggle />
            </div>
            <Button
              variant="ghost"
              className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={handleLogout}
            >
              <LogOut className="mr-3 h-4 w-4" />
              Sign out
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="md:pl-72">
        {/* Top bar */}
        <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-sm border-b border-border">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center space-x-4">
              <h2 className="text-lg font-semibold text-foreground">
                {navigation.find(item => isActive(item.href))?.name || 'Dashboard'}
              </h2>
            </div>
            <div className="flex items-center space-x-3">
              <ThemeToggle />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={undefined} alt={user?.firstName} />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {user?.firstName?.[0]}{user?.lastName?.[0]}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user?.firstName} {user?.lastName}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user?.email}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground capitalize">
                        {user?.role?.toLowerCase()}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="py-6">
          <div className="px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
