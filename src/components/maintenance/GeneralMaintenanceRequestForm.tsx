
import { useState, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";

// Define the schema for form validation
const maintenanceRequestSchema = z.object({
  vehicleId: z.string({
    required_error: "Please select a vehicle",
  }),
  maintenanceType: z.string({
    required_error: "Please select a maintenance type",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters",
  }),
  odometerReading: z.coerce.number().min(0).optional(),
});

// Define the props interface
interface GeneralMaintenanceRequestFormProps {
  onSubmit: (formData: any) => Promise<{success: boolean, error?: any}>;
}

export function GeneralMaintenanceRequestForm({ onSubmit }: GeneralMaintenanceRequestFormProps) {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Define form
  const form = useForm<z.infer<typeof maintenanceRequestSchema>>({
    resolver: zodResolver(maintenanceRequestSchema),
    defaultValues: {
      description: "",
      odometerReading: 0,
    },
  });

  // Fetch vehicles on component mount
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('vehicles')
          .select('id, type, model, plate_number')
          .eq('status', 'available');
          
        if (error) throw error;
        
        if (data) {
          setVehicles(data);
        }
      } catch (error) {
        console.error("Error fetching vehicles:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchVehicles();
  }, []);

  const handleSubmit = async (values: z.infer<typeof maintenanceRequestSchema>) => {
    try {
      setLoading(true);
      const result = await onSubmit(values);
      
      if (result.success) {
        form.reset();
      }
      
      return result;
    } catch (error) {
      console.error("Error submitting form:", error);
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="vehicleId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Vehicle</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a vehicle" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {vehicles.map((vehicle: any) => (
                    <SelectItem key={vehicle.id} value={vehicle.id}>
                      {vehicle.type} {vehicle.model} - {vehicle.plate_number}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="maintenanceType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Maintenance Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select maintenance type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="routine">Routine Maintenance</SelectItem>
                  <SelectItem value="repair">Repair</SelectItem>
                  <SelectItem value="inspection">Inspection</SelectItem>
                  <SelectItem value="emergency">Emergency Repair</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="odometerReading"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Current Odometer Reading (km)</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
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
              <FormLabel>Maintenance Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Please describe the maintenance needed in detail"
                  className="min-h-[120px]"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Submitting..." : "Submit Maintenance Request"}
        </Button>
      </form>
    </Form>
  );
}
