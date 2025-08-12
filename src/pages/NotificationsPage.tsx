import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Switch } from '../components/ui/switch';
import { Bell, Search, Settings, TestTube, Eye, Trash2, Clock, Smartphone } from 'lucide-react';
import toast from 'react-hot-toast';
import { useFCMToken } from '../hooks/useFCMToken';

// Mock data
const mockNotifications = [
  {
    id: '1',
    title: 'Medication Reminder',
    message: 'Time to take Aspirin 100mg',
    type: 'MEDICATION_REMINDER',
    status: 'SENT',
    scheduledFor: '2024-01-15T08:00:00Z',
    channels: ['PUSH', 'EMAIL'],
    readAt: null,
  },
  {
    id: '2',
    title: 'Schedule Update',
    message: 'Vitamin D schedule has been updated',
    type: 'SCHEDULE_UPDATE',
    status: 'DELIVERED',
    scheduledFor: '2024-01-15T09:00:00Z',
    channels: ['EMAIL'],
    readAt: '2024-01-15T09:05:00Z',
  },
];

const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const { registerFCMToken, isRegistering, isSupported } = useFCMToken();

  const filteredNotifications = notifications.filter(notification =>
    notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    notification.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SENT': return 'bg-blue-100 text-blue-800';
      case 'DELIVERED': return 'bg-green-100 text-green-800';
      case 'READ': return 'bg-purple-100 text-purple-800';
      case 'FAILED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'MEDICATION_REMINDER': return '💊';
      case 'SCHEDULE_UPDATE': return '📅';
      case 'SYSTEM_NOTIFICATION': return '🔔';
      case 'EMERGENCY': return '🚨';
      default: return '📢';
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(notif => 
      notif.id === id ? { ...notif, status: 'READ', readAt: new Date().toISOString() } : notif
    ));
    toast.success('Marked as read');
  };

  const deleteNotification = (id: string) => {
    if (window.confirm('Are you sure you want to delete this notification?')) {
      setNotifications(prev => prev.filter(notif => notif.id !== id));
      toast.success('Notification deleted');
    }
  };

  const testNotification = () => {
    toast.success('Test notification sent successfully!');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Notifications</h1>
          <p className="text-muted-foreground">
            Manage notifications and communication preferences
          </p>
        </div>
        <div className="flex space-x-2">
          {isSupported && (
            <Button 
              variant="outline" 
              onClick={registerFCMToken}
              disabled={isRegistering}
              className="bg-background/50 backdrop-blur-sm"
            >
              <Smartphone className="h-4 w-4 mr-2" />
              {isRegistering ? 'Enabling...' : 'Enable Push Notifications'}
            </Button>
          )}
          <Button variant="outline" onClick={testNotification} className="bg-background/50 backdrop-blur-sm">
            <TestTube className="h-4 w-4 mr-2" />
            Test Notification
          </Button>
          <Button className="bg-primary hover:bg-primary/90">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="unread">Unread</TabsTrigger>
          <TabsTrigger value="sent">Sent</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6">
          {/* Search */}
          <Card className="bg-card/50 backdrop-blur-sm">
            <CardContent className="pt-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search notifications..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-background/50 border-border/50"
                />
              </div>
            </CardContent>
          </Card>

          {/* Notifications Table */}
          <Card className="bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-foreground">All Notifications</CardTitle>
              <CardDescription>
                {filteredNotifications.length} notification{filteredNotifications.length !== 1 ? 's' : ''} found
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border border-border/50">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/30">
                      <TableHead className="text-foreground font-medium">Type</TableHead>
                      <TableHead className="text-foreground font-medium">Title</TableHead>
                      <TableHead className="text-foreground font-medium">Message</TableHead>
                      <TableHead className="text-foreground font-medium">Channels</TableHead>
                      <TableHead className="text-foreground font-medium">Status</TableHead>
                      <TableHead className="text-foreground font-medium">Scheduled For</TableHead>
                      <TableHead className="text-foreground font-medium">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredNotifications.map((notification) => (
                      <TableRow key={notification.id} className="hover:bg-muted/20 transition-colors">
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <span className="text-2xl">{getTypeIcon(notification.type)}</span>
                            <Badge variant="outline" className="text-xs">
                              {notification.type.replace('_', ' ')}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium text-foreground">{notification.title}</TableCell>
                        <TableCell className="max-w-xs truncate text-muted-foreground">{notification.message}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {notification.channels.map(channel => (
                              <Badge key={channel} variant="secondary" className="text-xs">
                                {channel}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(notification.status)}>
                            {notification.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center text-muted-foreground">
                            <Clock className="h-4 w-4 mr-1" />
                            {new Date(notification.scheduledFor).toLocaleDateString()}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            {notification.status !== 'READ' && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => markAsRead(notification.id)}
                                className="hover:bg-primary/10"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteNotification(notification.id)}
                              className="hover:bg-destructive/10 text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="unread" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Unread Notifications</CardTitle>
              <CardDescription>
                Notifications that haven't been read yet
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                <Bell className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No unread notifications</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sent" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Sent Notifications</CardTitle>
              <CardDescription>
                History of all sent notifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                <Bell className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No sent notifications to display</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Configure how and when you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Channels</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="email-notifications">Email Notifications</Label>
                      <p className="text-sm text-gray-500">Receive notifications via email</p>
                    </div>
                    <Switch id="email-notifications" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="push-notifications">Push Notifications</Label>
                      <p className="text-sm text-gray-500">Receive push notifications on your device</p>
                    </div>
                    <Switch id="push-notifications" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="sms-notifications">SMS Notifications</Label>
                      <p className="text-sm text-gray-500">Receive notifications via text message</p>
                    </div>
                    <Switch id="sms-notifications" />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Preferences</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="quiet-hours-start">Quiet Hours Start</Label>
                    <Input id="quiet-hours-start" type="time" defaultValue="22:00" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="quiet-hours-end">Quiet Hours End</Label>
                    <Input id="quiet-hours-end" type="time" defaultValue="08:00" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="max-notifications">Max Notifications Per Day</Label>
                  <Input id="max-notifications" type="number" defaultValue="10" min="1" max="50" />
                </div>
              </div>

              <div className="flex justify-end">
                <Button>Save Settings</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NotificationsPage;
