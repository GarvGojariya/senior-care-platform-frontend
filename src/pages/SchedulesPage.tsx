import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Plus, Search, Edit, Trash2, Clock, Calendar } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import type { Schedule } from '../types/schedule';

const scheduleSchema = z.object({
  medicationId: z.string().min(1, 'Medication is required'),
  time: z.string().min(1, 'Time is required'),
  daysOfWeek: z.array(z.string()).min(1, 'At least one day must be selected'),
});

type ScheduleFormData = z.infer<typeof scheduleSchema>;

// Mock data
const mockSchedules: Schedule[] = [
  {
    id: '1',
    medicationId: '1',
    time: '08:00',
    daysOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    isActive: true,
    nextNotificationDue: '2024-01-15T08:00:00Z',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    medication: { id: '1', name: 'Aspirin', dosage: '100mg', seniorId: '1' },
  },
  {
    id: '2',
    medicationId: '2',
    time: '09:00',
    daysOfWeek: ['Monday', 'Wednesday', 'Friday'],
    isActive: true,
    nextNotificationDue: '2024-01-15T09:00:00Z',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    medication: { id: '2', name: 'Vitamin D', dosage: '1000 IU', seniorId: '2' },
  },
];

const mockMedications = [
  { id: '1', name: 'Aspirin', dosage: '100mg' },
  { id: '2', name: 'Vitamin D', dosage: '1000 IU' },
];

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const SchedulesPage: React.FC = () => {
  const [schedules, setSchedules] = useState<Schedule[]>(mockSchedules);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<ScheduleFormData>({
    resolver: zodResolver(scheduleSchema),
    defaultValues: {
      daysOfWeek: [],
    },
  });

  const watchedDaysOfWeek = watch('daysOfWeek') || [];

  const filteredSchedules = schedules.filter(schedule =>
    schedule.medication?.name.toLowerCase().includes(searchTerm.toLowerCase()) || false
  );

  const onSubmit = async (data: ScheduleFormData) => {
    try {
      if (editingSchedule) {
        setSchedules(prev => prev.map(schedule => 
          schedule.id === editingSchedule.id 
            ? { ...schedule, ...data, id: schedule.id }
            : schedule
        ));
        toast.success('Schedule updated successfully');
      } else {
        const newSchedule: Schedule = {
          ...data,
          id: Date.now().toString(),
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          medication: mockMedications.find(m => m.id === data.medicationId) ? {
            id: data.medicationId,
            name: mockMedications.find(m => m.id === data.medicationId)?.name || '',
            dosage: mockMedications.find(m => m.id === data.medicationId)?.dosage || '',
            seniorId: '1', // Mock senior ID
          } : undefined,
        };
        setSchedules(prev => [...prev, newSchedule]);
        toast.success('Schedule created successfully');
      }
      
      setIsAddDialogOpen(false);
      setEditingSchedule(null);
      reset();
    } catch (error) {
      toast.error('Failed to save schedule');
    }
  };

  const handleEdit = (schedule: Schedule) => {
    setEditingSchedule(schedule);
    setIsAddDialogOpen(true);
    reset({
      medicationId: schedule.medicationId,
      time: schedule.time,
      daysOfWeek: schedule.daysOfWeek,
    });
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this schedule?')) {
      setSchedules(prev => prev.filter(schedule => schedule.id !== id));
      toast.success('Schedule deleted successfully');
    }
  };

  const handleToggleStatus = (id: string) => {
    setSchedules(prev => prev.map(schedule => 
      schedule.id === id ? { ...schedule, isActive: !schedule.isActive } : schedule
    ));
    toast.success('Schedule status updated');
  };

  const toggleDay = (day: string) => {
    const newDays = watchedDaysOfWeek.includes(day)
      ? watchedDaysOfWeek.filter(d => d !== day)
      : [...watchedDaysOfWeek, day];
    setValue('daysOfWeek', newDays);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Schedules</h1>
          <p className="text-gray-600">
            Manage medication schedules and reminders
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingSchedule(null)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Schedule
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                {editingSchedule ? 'Edit Schedule' : 'Create New Schedule'}
              </DialogTitle>
              <DialogDescription>
                {editingSchedule 
                  ? 'Update schedule information' 
                  : 'Create a new medication schedule'
                }
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="medicationId">Medication</Label>
                <Select onValueChange={(value) => setValue('medicationId', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select medication" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockMedications.map(medication => (
                      <SelectItem key={medication.id} value={medication.id}>
                        {medication.name} - {medication.dosage}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.medicationId && (
                  <p className="text-sm text-red-500">{errors.medicationId.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="time">Time</Label>
                <Input
                  id="time"
                  type="time"
                  {...register('time')}
                  className={errors.time ? 'border-red-500' : ''}
                />
                {errors.time && (
                  <p className="text-sm text-red-500">{errors.time.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Days of Week</Label>
                <div className="grid grid-cols-2 gap-2">
                  {daysOfWeek.map(day => (
                    <label key={day} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={watchedDaysOfWeek.includes(day)}
                        onChange={() => toggleDay(day)}
                        className="rounded border-gray-300"
                      />
                      <span className="text-sm">{day}</span>
                    </label>
                  ))}
                </div>
                {errors.daysOfWeek && (
                  <p className="text-sm text-red-500">{errors.daysOfWeek.message}</p>
                )}
              </div>

              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsAddDialogOpen(false);
                    setEditingSchedule(null);
                    reset();
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : (editingSchedule ? 'Update' : 'Create')}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search schedules..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Schedules Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Schedules</CardTitle>
          <CardDescription>
            {filteredSchedules.length} schedule{filteredSchedules.length !== 1 ? 's' : ''} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Medication</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Days</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Next Reminder</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSchedules.map((schedule) => (
                <TableRow key={schedule.id}>
                  <TableCell className="font-medium">
                    {schedule.medication?.name}
                    <div className="text-sm text-gray-500">{schedule.medication?.dosage}</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {schedule.time}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {schedule.daysOfWeek.map(day => (
                        <Badge key={day} variant="outline" className="text-xs">
                          {day.slice(0, 3)}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={schedule.isActive ? "default" : "secondary"}>
                      {schedule.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {schedule.nextNotificationDue ? new Date(schedule.nextNotificationDue).toLocaleDateString() : 'Not set'}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(schedule)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleStatus(schedule.id)}
                      >
                        <Clock className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(schedule.id)}
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

export default SchedulesPage;
