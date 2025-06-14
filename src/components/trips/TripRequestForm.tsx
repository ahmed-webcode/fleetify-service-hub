
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

export interface TripRequestFormProps {
  onSuccess: () => void;
  onCancel?: () => void;
}

export const TripRequestForm = ({ onSuccess, onCancel }: TripRequestFormProps) => {
  const [formData, setFormData] = useState({
    purpose: '',
    description: '',
    startTime: '',
    endTime: '',
    startLocation: '',
    endLocation: '',
    isRoundTrip: false,
    passengerCount: 1,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Trip request submitted:', formData);
    onSuccess();
  };

  return (
    <div className="w-full max-w-2xl m-4">
      <Card>
        <CardHeader>
          <CardTitle>Request Trip</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Purpose</label>
              <Input
                value={formData.purpose}
                onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                placeholder="Trip purpose"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Additional details"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Start Time</label>
                <Input
                  type="datetime-local"
                  value={formData.startTime}
                  onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">End Time</label>
                <Input
                  type="datetime-local"
                  value={formData.endTime}
                  onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Start Location</label>
                <Input
                  value={formData.startLocation}
                  onChange={(e) => setFormData({ ...formData, startLocation: e.target.value })}
                  placeholder="Departure location"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">End Location</label>
                <Input
                  value={formData.endLocation}
                  onChange={(e) => setFormData({ ...formData, endLocation: e.target.value })}
                  placeholder="Destination"
                  required
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="roundTrip"
                checked={formData.isRoundTrip}
                onCheckedChange={(checked) => setFormData({ ...formData, isRoundTrip: checked })}
              />
              <label htmlFor="roundTrip" className="text-sm font-medium">Round Trip</label>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Passenger Count</label>
              <Input
                type="number"
                min="1"
                value={formData.passengerCount}
                onChange={(e) => setFormData({ ...formData, passengerCount: parseInt(e.target.value) || 1 })}
                required
              />
            </div>
            <div className="flex justify-end gap-2">
              {onCancel && (
                <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
              )}
              <Button type="submit">Submit Request</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
