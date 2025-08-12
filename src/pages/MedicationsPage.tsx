import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchMedications, addMedication, updateMedication, deleteMedication, toggleMedicationStatus, clearError } from '../store/slices/medicationsSlice';
import { fetchSeniorsOfCaregiver } from '../store/slices/usersSlice';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardHeader } from '../components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Badge } from '../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Textarea } from '../components/ui/textarea';
import { Plus, Search, Edit, Trash2, Eye, EyeOff, Loader2 } from 'lucide-react';
import type { Medication, AddMedicationRequest, UpdateMedicationRequest } from '../types/medication';

const MedicationsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { medications, isLoading, error } = useAppSelector((state) => state.medications);
  const { seniors } = useAppSelector((state) => state.users);

  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedMedication, setSelectedMedication] = useState<Medication | null>(null);
  const [formData, setFormData] = useState<AddMedicationRequest>({
    name: '',
    dosage: '',
    frequency: '',
    instructions: '',
    startDate: '',
    endDate: '',
    seniorId: '',
  });

  useEffect(() => {
    dispatch(fetchMedications({}));
    dispatch(fetchSeniorsOfCaregiver());
  }, [dispatch]);

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const handleAddMedication = async () => {
    try {
      await dispatch(addMedication(formData)).unwrap();
      setIsAddDialogOpen(false);
      setFormData({
        name: '',
        dosage: '',
        frequency: '',
        instructions: '',
        startDate: '',
        endDate: '',
        seniorId: '',
      });
    } catch (error) {
      // Error is handled by the slice
    }
  };

  const handleEditMedication = async () => {
    if (!selectedMedication) return;
    
    try {
      const updateData: UpdateMedicationRequest = {
        name: formData.name,
        dosage: formData.dosage,
        frequency: formData.frequency,
        instructions: formData.instructions,
        startDate: formData.startDate,
        endDate: formData.endDate,
      };
      
      await dispatch(updateMedication({ id: selectedMedication.id, data: updateData })).unwrap();
      setIsEditDialogOpen(false);
      setSelectedMedication(null);
      setFormData({
        name: '',
        dosage: '',
        frequency: '',
        instructions: '',
        startDate: '',
        endDate: '',
        seniorId: '',
      });
    } catch (error) {
      // Error is handled by the slice
    }
  };

  const handleDeleteMedication = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this medication?')) {
      try {
        await dispatch(deleteMedication(id)).unwrap();
      } catch (error) {
        // Error is handled by the slice
      }
    }
  };

  const handleToggleStatus = async (id: string) => {
    try {
      await dispatch(toggleMedicationStatus(id)).unwrap();
    } catch (error) {
      // Error is handled by the slice
    }
  };

  const openEditDialog = (medication: Medication) => {
    setSelectedMedication(medication);
    setFormData({
      name: medication.name,
      dosage: medication.dosage,
      frequency: medication.frequency,
      instructions: medication.instructions,
      startDate: medication.startDate,
      endDate: medication.endDate || '',
      seniorId: medication.seniorId,
    });
    setIsEditDialogOpen(true);
  };

  const filteredMedications = medications.filter((med: Medication) => 
    med.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    med.instructions.toLowerCase().includes(searchTerm.toLowerCase()) ||
    `${med.senior?.firstName} ${med.senior?.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Medications</h1>
          <p className="text-gray-600">Manage medications for all seniors under your care</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Medication
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Medication</DialogTitle>
              <DialogDescription>
                Enter the details for the new medication
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Medication Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Aspirin, Metformin"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="dosage">Dosage</Label>
                  <Input
                    id="dosage"
                    value={formData.dosage}
                    onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
                    placeholder="e.g., 100mg"
                  />
                </div>
                <div>
                  <Label htmlFor="frequency">Frequency</Label>
                  <Input
                    id="frequency"
                    value={formData.frequency}
                    onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                    placeholder="e.g., Twice daily"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="instructions">Instructions</Label>
                <Textarea
                  id="instructions"
                  value={formData.instructions}
                  onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                  placeholder="Special instructions for taking the medication"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="endDate">End Date (Optional)</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="seniorId">Senior</Label>
                <Select value={formData.seniorId} onValueChange={(value) => setFormData({ ...formData, seniorId: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a senior" />
                  </SelectTrigger>
                  <SelectContent>
                    {seniors.map((senior: any) => (
                      <SelectItem key={senior.id} value={senior.id}>
                        {senior.firstName} {senior.lastName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddMedication}>Add Medication</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-600">{error}</p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center space-x-4">
            <Input
              placeholder="Search medications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
            <Search className="h-4 w-4 text-gray-400" />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Senior</TableHead>
                <TableHead>Dosage</TableHead>
                <TableHead>Frequency</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMedications.map((medication) => (
                <TableRow key={medication.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{medication.name}</div>
                      <div className="text-sm text-gray-500">{medication.instructions}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {medication.senior ? `${medication.senior.firstName} ${medication.senior.lastName}` : 'Unknown'}
                  </TableCell>
                  <TableCell>{medication.dosage}</TableCell>
                  <TableCell>{medication.frequency}</TableCell>
                  <TableCell>
                    <Badge variant={medication.isActive ? 'default' : 'secondary'}>
                      {medication.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleStatus(medication.id)}
                      >
                        {medication.isActive ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditDialog(medication)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteMedication(medication.id)}
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

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Medication</DialogTitle>
            <DialogDescription>
              Update the medication details
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-name">Medication Name</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-dosage">Dosage</Label>
                <Input
                  id="edit-dosage"
                  value={formData.dosage}
                  onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-frequency">Frequency</Label>
                <Input
                  id="edit-frequency"
                  value={formData.frequency}
                  onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="edit-instructions">Instructions</Label>
              <Textarea
                id="edit-instructions"
                value={formData.instructions}
                onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-startDate">Start Date</Label>
                <Input
                  id="edit-startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-endDate">End Date (Optional)</Label>
                <Input
                  id="edit-endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditMedication}>Update Medication</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MedicationsPage;
