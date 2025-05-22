import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { apiClient, CreateTripRequestDto } from "@/lib/apiClient";

const formSchema = z.object({
  purpose: z.string().min(1, "Purpose is required"),
  description: z.string().optional(),
  startTime: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Valid start date and time are required",
  }),
  endTime: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Valid end date and time are required",
  }),
  startLocation: z.string().min(1, "Start location is required"),
  endLocation: z.string().min(1, "End location is required"),
  isRoundTrip: z.boolean().default(false),
  passengerCount: z.coerce
    .number()
    .int()
    .min(1, "Passenger count must be at least 1"),
}).refine(data => new Date(data.startTime) < new Date(data.endTime), {
    message: "End time must be after start time",
    path: ["endTime"], // Path to the field to attach the error
});

type TripFormValues = z.infer<typeof formSchema>;

interface TripRequestFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function TripRequestForm({
  onSuccess,
  onCancel,
}: TripRequestFormProps) {
  const [loading, setLoading] = useState(false);

  const form = useForm<TripFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      purpose: "",
      description: "",
      startTime: "",
      endTime: "",
      startLocation: "",
      endLocation: "",
      isRoundTrip: false,
      passengerCount: 1,
    },
  });

  const onSubmit = async (data: TripFormValues) => {
    try {
      setLoading(true);
      const requestData: any = {
        ...data,
        // Ensure startTime and endTime are in a format your backend expects (e.g., ISO string)
        // The datetime-local input usually provides a compatible format.
      };

      await apiClient.trips.requests.create(requestData);
      toast.success("Trip request submitted successfully");
      form.reset();
      if (onSuccess) onSuccess();
    } catch (error: any) {
      toast.error(
        "Failed to submit trip request: " + (error.message || "Unknown error")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="purpose"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Purpose</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Client Meeting, Site Visit" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Additional details about the trip"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="startTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start Time</FormLabel>
                <FormControl>
                  <Input type="datetime-local" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="endTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>End Time</FormLabel>
                <FormControl>
                  <Input type="datetime-local" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="startLocation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Start Location</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Main Office" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="endLocation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>End Location</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Client's Address, Project Site" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="passengerCount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Number of Passengers</FormLabel>
              <FormControl>
                <Input type="number" min={1} {...field} 
                  onChange={event => field.onChange(+event.target.value)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isRoundTrip"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Is this a round trip?</FormLabel>
                <FormDescription>
                  Check if the return journey is included.
                </FormDescription>
              </div>
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Submitting..." : "Submit Request"}
          </Button>
        </div>
      </form>
    </Form>
  );
}