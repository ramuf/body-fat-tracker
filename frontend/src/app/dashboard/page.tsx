'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { bodyMetrics, auth } from '@/lib/api';
import { MetricList } from '@/components/dashboard/metric-list';
import { MetricChart } from '@/components/dashboard/metric-chart';
import { MetricForm } from '@/components/dashboard/metric-form';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Plus } from 'lucide-react';
import { BodyMetricCreate, BodyMetric } from '@/types';

export default function DashboardPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingMetric, setEditingMetric] = useState<BodyMetric | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const response = await auth.me();
      return response.data;
    },
  });

  const { data: metrics, isLoading, error } = useQuery({
    queryKey: ['bodyMetrics'],
    queryFn: async () => {
      const response = await bodyMetrics.getAll();
      return response.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: (newMetric: BodyMetricCreate) => bodyMetrics.create(newMetric),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bodyMetrics'] });
      setIsFormOpen(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: BodyMetricCreate }) => bodyMetrics.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bodyMetrics'] });
      setIsFormOpen(false);
      setEditingMetric(null);
    },
  });

  const { toast } = useToast();

  const deleteMutation = useMutation({
    mutationFn: (id: string) => bodyMetrics.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bodyMetrics'] });
      toast({ title: 'Deleted', description: 'Metric deleted successfully.', variant: 'success' });
    },
    onError: (err: any) => {
      const message = err && typeof err === 'object' ? (err.message || JSON.stringify(err)) : String(err);
      toast({ title: 'Error', description: message || 'Failed to delete metric.', variant: 'error' });
    },
  });

  // no local notification state — using app-wide toasts via useToast

  const handleSubmit = (data: BodyMetricCreate) => {
    if (editingMetric) {
      updateMutation.mutate({ id: editingMetric.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (metric: BodyMetric) => {
    setEditingMetric(metric);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingMetric(null);
  };

  const handleDelete = (id: string) => {
    setDeleteTargetId(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (!deleteTargetId) return;
    deleteMutation.mutate(deleteTargetId);
    setIsDeleteDialogOpen(false);
    setDeleteTargetId(null);
  };

  const cancelDelete = () => {
    setIsDeleteDialogOpen(false);
    setDeleteTargetId(null);
  };

  if (isLoading) return <div>Loading metrics...</div>;
  if (error) return <div>Error loading metrics</div>;

  return (
    <Tabs defaultValue="chart" className="space-y-2">
      {/* Toaster rendered from ToastProvider at the root */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <h2 className="text-xl sm:text-2xl font-bold">Your Progress</h2>
          <TabsList className="mt-1 sm:mt-0">
            <TabsTrigger value="chart">Chart</TabsTrigger>
            <TabsTrigger value="table">Table</TabsTrigger>
          </TabsList>
        </div>
        <Dialog open={isFormOpen} onOpenChange={(open) => {
          setIsFormOpen(open);
          if (!open) setEditingMetric(null);
        }}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto">
              <Plus className="mr-2 h-4 w-4" /> Add Metric
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingMetric ? 'Edit Entry' : 'Add New Entry'}</DialogTitle>
              <DialogDescription>
                {editingMetric ? 'Update your body metric details below.' : 'Enter your new body metric details below.'}
              </DialogDescription>
            </DialogHeader>
            <MetricForm 
              onSubmit={handleSubmit} 
              isLoading={createMutation.isPending || updateMutation.isPending} 
              user={user} 
              defaultValues={editingMetric ? {
                date: editingMetric.date.split('T')[0],
                weight: editingMetric.weight,
                body_fat_percentage: editingMetric.body_fat_percentage || 0,
                muscle_mass: editingMetric.muscle_mass || 0,
                water_percentage: editingMetric.water_percentage || 0,
                bmi: editingMetric.bmi || 0,
                ffmi: editingMetric.ffmi || 0,
                bmr: editingMetric.bmr || 0,
                notes: editingMetric.notes || '',
              } : undefined}
            />
          </DialogContent>
        </Dialog>
      </div>

      <TabsContent value="chart" className="mt-2">
        <MetricChart metrics={metrics || []} user={user} />
      </TabsContent>
      <TabsContent value="table" className="mt-2">
        <MetricList metrics={metrics || []} onDelete={handleDelete} onEdit={handleEdit} />
      </TabsContent>
      
      <Dialog open={isDeleteDialogOpen} onOpenChange={(open) => setIsDeleteDialogOpen(open)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Metric</DialogTitle>
            <DialogDescription>Are you sure you want to delete this metric? This action cannot be undone.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="ghost" onClick={cancelDelete}>Cancel</Button>
            </DialogClose>
            <Button variant="destructive" onClick={confirmDelete} disabled={deleteMutation.isPending}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Tabs>
  );
}
