'use client';

import { useState } from 'react';
import { BodyMetric } from '@/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { Trash2, ArrowUpDown, ArrowUp, ArrowDown, Pencil, StickyNote } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface MetricListProps {
  metrics: BodyMetric[];
  onDelete: (id: string) => void;
  onEdit: (metric: BodyMetric) => void;
}

type SortConfig = {
  key: keyof BodyMetric | null;
  direction: 'asc' | 'desc';
};

export function MetricList({ metrics, onDelete, onEdit }: MetricListProps) {
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'date', direction: 'desc' });

  const sortedMetrics = [...metrics].sort((a, b) => {
    if (!sortConfig.key) return 0;
    
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];

    if (aValue === bValue) return 0;
    
    // Handle null/undefined values
    if (aValue === null || aValue === undefined) return 1;
    if (bValue === null || bValue === undefined) return -1;

    const comparison = aValue < bValue ? -1 : 1;
    return sortConfig.direction === 'asc' ? comparison : -comparison;
  });

  const requestSort = (key: keyof BodyMetric) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key: keyof BodyMetric) => {
    if (sortConfig.key !== key) return <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />;
    if (sortConfig.direction === 'asc') return <ArrowUp className="ml-2 h-4 w-4" />;
    return <ArrowDown className="ml-2 h-4 w-4" />;
  };

  if (metrics.length === 0) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        No metrics found. Add your first entry!
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="px-2">
              <Button variant="ghost" onClick={() => requestSort('date')} className="hover:bg-transparent p-0 font-bold">
                Date {getSortIcon('date')}
              </Button>
            </TableHead>
            <TableHead className="px-2">
              <Button variant="ghost" onClick={() => requestSort('weight')} className="hover:bg-transparent p-0 font-bold">
                Weight {getSortIcon('weight')}
              </Button>
            </TableHead>
            <TableHead className="px-2">
              <Button variant="ghost" onClick={() => requestSort('body_fat_percentage')} className="hover:bg-transparent p-0 font-bold">
                Body Fat % {getSortIcon('body_fat_percentage')}
              </Button>
            </TableHead>
            <TableHead className="px-2 hidden md:table-cell">
              <Button variant="ghost" onClick={() => requestSort('muscle_mass')} className="hover:bg-transparent p-0 font-bold">
                Muscle Mass % {getSortIcon('muscle_mass')}
              </Button>
            </TableHead>
            <TableHead className="px-2 hidden md:table-cell">
              <Button variant="ghost" onClick={() => requestSort('bmi')} className="hover:bg-transparent p-0 font-bold">
                BMI {getSortIcon('bmi')}
              </Button>
            </TableHead>
            <TableHead className="px-2 hidden md:table-cell">
              <Button variant="ghost" onClick={() => requestSort('ffmi')} className="hover:bg-transparent p-0 font-bold">
                FFMI {getSortIcon('ffmi')}
              </Button>
            </TableHead>
            <TableHead className="px-2 hidden md:table-cell">
              <Button variant="ghost" onClick={() => requestSort('bmr')} className="hover:bg-transparent p-0 font-bold">
                BMR {getSortIcon('bmr')}
              </Button>
            </TableHead>
            <TableHead className="text-right px-2">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedMetrics.map((metric) => (
            <TableRow key={metric.id}>
              <TableCell className="font-medium p-2">
                <div className="flex items-center gap-2">
                  {new Date(metric.date).toLocaleDateString()}
                  {metric.notes && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <StickyNote className="h-4 w-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">{metric.notes}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </div>
              </TableCell>
              <TableCell className="p-2">{metric.weight} kg</TableCell>
              <TableCell className="p-2">{metric.body_fat_percentage ? `${metric.body_fat_percentage}%` : '-'}</TableCell>
              <TableCell className="p-2 hidden md:table-cell">{metric.muscle_mass ? `${metric.muscle_mass}%` : '-'}</TableCell>
              <TableCell className="p-2 hidden md:table-cell">{metric.bmi || '-'}</TableCell>
              <TableCell className="p-2 hidden md:table-cell">{metric.ffmi || '-'}</TableCell>
              <TableCell className="p-2 hidden md:table-cell">{metric.bmr ? `${metric.bmr} kcal` : '-'}</TableCell>
              <TableCell className="text-right p-2">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(metric)}
                    className="text-primary hover:text-primary/80 hover:bg-primary/10 h-8 w-8 p-0"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(metric.id)}
                    className="text-destructive hover:text-destructive/80 hover:bg-destructive/10 h-8 w-8 p-0"
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
  );
}
