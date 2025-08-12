import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Plus, Search, Edit, Trash2, UserPlus, Users, Shield } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import type { User } from '../types/auth';

const userSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  role: z.enum(['SENIOR', 'CAREGIVER', 'ADMIN']),
  phoneNumber: z.string().optional(),
  address: z.string().optional(),
  dateOfBirth: z.string().optional(),
  emergencyContact: z.string().optional(),
});

type UserFormData = z.infer<typeof userSchema>;

// Mock data
const mockUsers: User[] = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    role: 'SENIOR',
    phoneNumber: '+1-555-0123',
    address: '123 Main St, City, State',
    dateOfBirth: '1945-03-15',
    emergencyContact: '+1-555-0124',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
  {
    id: '2',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@example.com',
    role: 'SENIOR',
    phoneNumber: '+1-555-0125',
    address: '456 Oak Ave, City, State',
    dateOfBirth: '1948-07-22',
    emergencyContact: '+1-555-0126',
    createdAt: '2024-01-02',
    updatedAt: '2024-01-02',
  },
  {
    id: '3',
    firstName: 'Mike',
    lastName: 'Johnson',
    email: 'mike.johnson@example.com',
    role: 'CAREGIVER',
    phoneNumber: '+1-555-0127',
    address: '789 Pine Rd, City, State',
    createdAt: '2024-01-03',
    updatedAt: '2024-01-03',
  },
];

const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
  });

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    
    return matchesSearch && matchesRole;
  });

  const onSubmit = async (data: UserFormData) => {
    try {
      if (editingUser) {
        setUsers(prev => prev.map(user => 
          user.id === editingUser.id 
            ? { ...user, ...data, id: user.id }
            : user
        ));
        toast.success('User updated successfully');
      } else {
        const newUser: User = {
          ...data,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        setUsers(prev => [...prev, newUser]);
        toast.success('User added successfully');
      }
      
      setIsAddDialogOpen(false);
      setEditingUser(null);
      reset();
    } catch (error) {
      toast.error('Failed to save user');
    }
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setIsAddDialogOpen(true);
    reset(user);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setUsers(prev => prev.filter(user => user.id !== id));
      toast.success('User deleted successfully');
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'bg-red-100 text-red-800';
      case 'CAREGIVER': return 'bg-blue-100 text-blue-800';
      case 'SENIOR': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'ADMIN': return <Shield className="h-4 w-4" />;
      case 'CAREGIVER': return <Users className="h-4 w-4" />;
      case 'SENIOR': return <UserPlus className="h-4 w-4" />;
      default: return <UserPlus className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Users</h1>
          <p className="text-gray-600">
            Manage seniors and caregivers in the system
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingUser(null)}>
              <Plus className="h-4 w-4 mr-2" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>
                {editingUser ? 'Edit User' : 'Add New User'}
              </DialogTitle>
              <DialogDescription>
                {editingUser 
                  ? 'Update user information' 
                  : 'Add a new user to the system'
                }
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    placeholder="Enter first name"
                    {...register('firstName')}
                    className={errors.firstName ? 'border-red-500' : ''}
                  />
                  {errors.firstName && (
                    <p className="text-sm text-red-500">{errors.firstName.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    placeholder="Enter last name"
                    {...register('lastName')}
                    className={errors.lastName ? 'border-red-500' : ''}
                  />
                  {errors.lastName && (
                    <p className="text-sm text-red-500">{errors.lastName.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter email address"
                    {...register('email')}
                    className={errors.email ? 'border-red-500' : ''}
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500">{errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Select onValueChange={(value) => setValue('role', value as any)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SENIOR">Senior</SelectItem>
                      <SelectItem value="CAREGIVER">Caregiver</SelectItem>
                      <SelectItem value="ADMIN">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.role && (
                    <p className="text-sm text-red-500">{errors.role.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input
                    id="phoneNumber"
                    type="tel"
                    placeholder="Enter phone number"
                    {...register('phoneNumber')}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    {...register('dateOfBirth')}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  placeholder="Enter address"
                  {...register('address')}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="emergencyContact">Emergency Contact</Label>
                <Input
                  id="emergencyContact"
                  type="tel"
                  placeholder="Enter emergency contact"
                  {...register('emergencyContact')}
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsAddDialogOpen(false);
                    setEditingUser(null);
                    reset();
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : (editingUser ? 'Update' : 'Add')}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="SENIOR">Seniors</SelectItem>
                <SelectItem value="CAREGIVER">Caregivers</SelectItem>
                <SelectItem value="ADMIN">Admins</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
          <CardDescription>
            {filteredUsers.length} user{filteredUsers.length !== 1 ? 's' : ''} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarImage src="" />
                        <AvatarFallback>
                          {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{user.firstName} {user.lastName}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getRoleColor(user.role)}>
                      <div className="flex items-center space-x-1">
                        {getRoleIcon(user.role)}
                        <span>{user.role}</span>
                      </div>
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {user.phoneNumber && (
                        <div className="text-sm">{user.phoneNumber}</div>
                      )}
                      {user.emergencyContact && (
                        <div className="text-xs text-gray-500">
                          Emergency: {user.emergencyContact}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-xs truncate text-sm">
                      {user.address || 'No address provided'}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(user)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(user.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default UsersPage;
