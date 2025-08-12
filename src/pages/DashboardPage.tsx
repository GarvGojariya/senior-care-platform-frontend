import React from 'react';
import { useAppSelector } from '../store/hooks';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Link } from 'react-router-dom';
import { Users, Pill, Calendar, Bell, Plus, Activity } from 'lucide-react';
import RoleBasedComponent from '../components/RoleBasedComponent';

const DashboardPage: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);

  const stats = [
    {
      title: 'Total Seniors',
      value: '12',
      change: '+2',
      changeType: 'positive',
      icon: Users,
      description: 'Seniors under your care',
      roles: ['ADMIN', 'CAREGIVER'],
    },
    {
      title: 'Active Medications',
      value: '45',
      change: '+5',
      changeType: 'positive',
      icon: Pill,
      description: 'Medications being tracked',
      roles: ['ADMIN', 'CAREGIVER', 'SENIOR'],
    },
    {
      title: 'Today\'s Schedules',
      value: '18',
      change: '-3',
      changeType: 'negative',
      icon: Calendar,
      description: 'Scheduled medications today',
      roles: ['ADMIN', 'CAREGIVER', 'SENIOR'],
    },
    {
      title: 'Unread Notifications',
      value: '7',
      change: '+2',
      changeType: 'positive',
      icon: Bell,
      description: 'Notifications requiring attention',
      roles: ['ADMIN', 'CAREGIVER', 'SENIOR'],
    },
  ];

  const quickActions = [
    {
      title: 'Add New Senior',
      description: 'Register a new senior under your care',
      icon: Plus,
      href: '/users',
      color: 'bg-blue-500',
      roles: ['ADMIN'],
    },
    {
      title: 'Schedule Medication',
      description: 'Create a new medication schedule',
      icon: Calendar,
      href: '/schedules',
      color: 'bg-green-500',
      roles: ['ADMIN', 'CAREGIVER'],
    },
    {
      title: 'Add Medication',
      description: 'Add a new medication to the system',
      icon: Pill,
      href: '/medications',
      color: 'bg-purple-500',
      roles: ['ADMIN', 'CAREGIVER'],
    },
    {
      title: 'View Notifications',
      description: 'Check recent notifications and alerts',
      icon: Bell,
      href: '/notifications',
      color: 'bg-orange-500',
      roles: ['ADMIN', 'CAREGIVER', 'SENIOR'],
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-background rounded-xl border p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Welcome back, {user?.firstName}! 👋
            </h1>
            <p className="text-muted-foreground">
              Here's what's happening with your senior care management today.
            </p>
          </div>
          <div className="hidden md:block">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <span className="text-2xl">🏥</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <RoleBasedComponent key={stat.title} allowedRoles={stat.roles as any}>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">{stat.description}</p>
                  <div className="flex items-center pt-1">
                    <span
                      className={`text-xs font-medium ${
                        stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {stat.change}
                    </span>
                    <span className="text-xs text-muted-foreground ml-1">from last week</span>
                  </div>
                </CardContent>
              </Card>
            </RoleBasedComponent>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickActions.map((action) => {
          const Icon = action.icon;
          return (
            <RoleBasedComponent key={action.title} allowedRoles={action.roles as any}>
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg ${action.color} flex items-center justify-center mb-4`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-lg">{action.title}</CardTitle>
                  <CardDescription>{action.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild className="w-full">
                    <Link to={action.href}>
                      Get Started
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </RoleBasedComponent>
          );
        })}
      </div>

      {/* Recent Activity */}
      <Card className="bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Activity className="mr-2 h-5 w-5 text-primary" />
            Recent Activity
          </CardTitle>
          <CardDescription>
            Latest updates and activities in your senior care management
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center space-x-4 p-4 bg-muted/50 rounded-lg border border-border/50 hover:bg-muted/70 transition-colors">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">Medication schedule updated</p>
                <p className="text-xs text-muted-foreground">Aspirin schedule modified for John Doe</p>
              </div>
              <span className="text-xs text-muted-foreground">2 hours ago</span>
            </div>
            <div className="flex items-center space-x-4 p-4 bg-muted/50 rounded-lg border border-border/50 hover:bg-muted/70 transition-colors">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">New senior registered</p>
                <p className="text-xs text-muted-foreground">Jane Smith added to your care list</p>
              </div>
              <span className="text-xs text-muted-foreground">1 day ago</span>
            </div>
            <div className="flex items-center space-x-4 p-4 bg-muted/50 rounded-lg border border-border/50 hover:bg-muted/70 transition-colors">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">Medication reminder sent</p>
                <p className="text-xs text-muted-foreground">Blood pressure medication due for Mary Johnson</p>
              </div>
              <span className="text-xs text-muted-foreground">3 days ago</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardPage;
