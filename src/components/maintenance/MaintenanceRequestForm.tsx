
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface MaintenanceRequest {
  id: string;
  vehicle: string;
  date: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  details: string;
  requestedBy: string;
  priority: 'low' | 'medium' | 'high';
  estimatedCost?: number;
  documentUrls?: string[];
}

export interface MaintenanceRequestFormProps {
  onSuccess: (newRequest: MaintenanceRequest) => void;
  onCancel?: () => void;
}

export const MaintenanceRequestForm = ({ onSuccess, onCancel }: MaintenanceRequestFormProps) => {
  const [formData, setFormData] = useState({
    vehicle: '',
    details: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newRequest: MaintenanceRequest = {
      id: `MR-${Date.now()}`,
      vehicle: formData.vehicle,
      date: new Date().toISOString().split('T')[0],
      status: 'pending',
      details: formData.details,
      requestedBy: 'Current User',
      priority: formData.priority,
    };

    onSuccess(newRequest);

    setFormData({
      vehicle: '',
      details: '',
      priority: 'medium',
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Submit Maintenance Request</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Vehicle</label>
            <Input
              value={formData.vehicle}
              onChange={(e) => setFormData({ ...formData, vehicle: e.target.value })}
              placeholder="Enter vehicle information"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Priority</label>
            <Select value={formData.priority} onValueChange={(value: 'low' | 'medium' | 'high') => setFormData({ ...formData, priority: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Details</label>
            <Textarea
              value={formData.details}
              onChange={(e) => setFormData({ ...formData, details: e.target.value })}
              placeholder="Describe the maintenance needed"
              required
            />
          </div>
          <div className="flex gap-2 justify-end">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
            <Button type="submit">Submit Request</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
