import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export interface TripRequestFormProps {
  onSuccess: () => void;
  onCancel?: () => void;
}

export const TripRequestForm = ({ onSuccess, onCancel }: TripRequestFormProps) => {
  const [formData, setFormData] = useState({
    purpose: '',
    description: '',
    startDateTime: undefined as Date | undefined,
    endDateTime: undefined as Date | undefined,
    startLocation: '',
    endLocation: '',
    isRoundTrip: false,
    passengerCount: 1,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Convert date+time to ISO strings if present
    const payload = {
      ...formData,
      startTime: formData.startDateTime ? formData.startDateTime.toISOString() : "",
      endTime: formData.endDateTime ? formData.endDateTime.toISOString() : "",
    };
    console.log('Trip request submitted:', payload);
    onSuccess();
  };

  // Input style tweaks
  const inputClass = "min-h-11 md:min-h-12 text-base px-4 py-3";
  const labelClass = "block text-sm font-medium mb-2";
  const textareaClass = "resize-none min-h-[80px] text-base px-4 py-3 rounded-md";

  return (
    <div className="sm:max-w-2xl w-full mx-auto">
      <form onSubmit={handleSubmit} className="w-full space-y-4 px-2 py-3 max-w-2xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className={labelClass}>Purpose</label>
            <Input
              className={inputClass}
              value={formData.purpose}
              onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
              placeholder="Trip purpose"
              required
            />
          </div>
          <div>
            <label className={labelClass}>Start Location</label>
            <Input
              className={inputClass}
              value={formData.startLocation}
              onChange={(e) => setFormData({ ...formData, startLocation: e.target.value })}
              placeholder="Departure location"
              required
            />
          </div>
          <div>
            <label className={labelClass}>End Location</label>
            <Input
              className={inputClass}
              value={formData.endLocation}
              onChange={(e) => setFormData({ ...formData, endLocation: e.target.value })}
              placeholder="Destination"
              required
            />
          </div>
          <div>
            <label className={labelClass}>Passenger Count</label>
            <Input
              className={inputClass}
              type="number"
              min="1"
              value={formData.passengerCount}
              onChange={(e) => setFormData({ ...formData, passengerCount: parseInt(e.target.value) || 1 })}
              required
            />
          </div>
          <div>
            <label className={labelClass}>Start Date &amp; Time</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal min-h-11 md:min-h-12 px-4 py-3",
                    !formData.startDateTime && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-5 w-5" />
                  {formData.startDateTime ? format(formData.startDateTime, "PPP p") : <span>Pick start date &amp; time</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formData.startDateTime}
                  onSelect={(date) => setFormData({ ...formData, startDateTime: date ?? undefined })}
                  showOutsideDays
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                  // @ts-ignore: react-day-picker allows time with plugins—but here only date, so user sets the time via browser
                />
                <div className="mt-2 flex justify-between items-center px-3">
                  <input
                    type="time"
                    value={formData.startDateTime ? format(formData.startDateTime, "HH:mm") : ""}
                    onChange={(e) => {
                      const val = e.target.value;
                      let date = formData.startDateTime || new Date();
                      // set hours/minutes
                      if (val) {
                        const [h, m] = val.split(":");
                        date = new Date(date.setHours(Number(h), Number(m)));
                        setFormData({ ...formData, startDateTime: new Date(date) });
                      }
                    }}
                    className="border rounded px-2 py-1 text-base w-full"
                  />
                </div>
              </PopoverContent>
            </Popover>
          </div>
          <div>
            <label className={labelClass}>End Date &amp; Time</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal min-h-11 md:min-h-12 px-4 py-3",
                    !formData.endDateTime && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-5 w-5" />
                  {formData.endDateTime ? format(formData.endDateTime, "PPP p") : <span>Pick end date &amp; time</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formData.endDateTime}
                  onSelect={(date) => setFormData({ ...formData, endDateTime: date ?? undefined })}
                  showOutsideDays
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                  // @ts-ignore: allow time selection
                />
                <div className="mt-2 flex justify-between items-center px-3">
                  <input
                    type="time"
                    value={formData.endDateTime ? format(formData.endDateTime, "HH:mm") : ""}
                    onChange={(e) => {
                      const val = e.target.value;
                      let date = formData.endDateTime || new Date();
                      if (val) {
                        const [h, m] = val.split(":");
                        date = new Date(date.setHours(Number(h), Number(m)));
                        setFormData({ ...formData, endDateTime: new Date(date) });
                      }
                    }}
                    className="border rounded px-2 py-1 text-base w-full"
                  />
                </div>
              </PopoverContent>
            </Popover>
          </div>
          <div className="flex items-center space-x-2 sm:col-span-2">
            <Switch
              id="roundTrip"
              checked={formData.isRoundTrip}
              onCheckedChange={(checked) => setFormData({ ...formData, isRoundTrip: checked })}
            />
            <label htmlFor="roundTrip" className="text-sm font-medium">Round Trip</label>
          </div>
        </div>
        <div>
          <label className={labelClass}>Description</label>
          <Textarea
            className={textareaClass}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Additional details"
          />
        </div>
        <div className="flex justify-end gap-2">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
          )}
          <Button type="submit">Submit Request</Button>
        </div>
      </form>
    </div>
  );
};
