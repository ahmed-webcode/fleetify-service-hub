import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { apiClient, CreateMaintenanceRequestDto, VehicleDto, PageResponse } from "@/lib/apiClient";
import { useQuery } from "@tanstack/react-query";

const formSchema = z.object({
  vehicleId: z.coerce.number().positive("Vehicle selection is required"),
  title: z.string().min(1, "Title is required").max(100, "Title is too long"),
  description: z.string().min(1, "Description is required"),
});

type MaintenanceFormValues = z.infer<typeof formSchema>;

interface MaintenanceRequestFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function MaintenanceRequestForm({
  onSuccess,
  onCancel,
}: MaintenanceRequestFormProps) {
  const [loading, setLoading] = useState(false);

  const form = useForm<MaintenanceFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      vehicleId: undefined,
      title: "",
      description: "",
    },
  });

  // Fetch vehicles for the dropdown
  const { data: vehiclesData, isLoading: isLoadingVehicles } = useQuery<PageResponse<VehicleDto>>({
    queryKey: ["vehiclesForMaintenanceForm"], // Use a distinct query key
    queryFn: () => apiClient.vehicles.getAll({ page: 0, size: 100 }), // Fetch a reasonable number for a dropdown
  });

  const onSubmit = async (data: MaintenanceFormValues) => {
    try {
      setLoading(true);
      const requestData: CreateMaintenanceRequestDto = {
        vehicleId: data.vehicleId,
        title: data.title,
        description: data.description,
      };

      await apiClient.maintenance.requests.create(requestData);
      toast.success("Maintenance request submitted successfully");
      form.reset();
      if (onSuccess) onSuccess();
    } catch (error: any) {
      toast.error(
        "Failed to submit maintenance request: " + (error.message || "Unknown error")
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
          name="vehicleId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Vehicle</FormLabel>
              <Select
                onValueChange={(value) => field.onChange(parseInt(value))}
                value={field.value?.toString()}
                disabled={isLoadingVehicles}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a vehicle" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {isLoadingVehicles && <SelectItem value="loading" disabled>Loading vehicles...</SelectItem>}
                  {vehiclesData?.content.map((vehicle) => (
                    <SelectItem key={vehicle.id} value={vehicle.id.toString()}>
                      {vehicle.model} ({vehicle.plateNumber})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                Select the vehicle requiring maintenance.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title / Issue Summary</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Engine Overheating, Brake Replacement" {...field} />
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
              <FormLabel>Detailed Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe the issue in detail, including any symptoms or observations."
                  rows={4}
                  {...field}
                />
              </FormControl>
              <FormMessage />
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
          <Button type="submit" disabled={loading || isLoadingVehicles}>
            {loading ? "Submitting..." : "Submit Request"}
          </Button>
        </div>
      </form>
    </Form>
  );
}