
import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

// Mock staff data
const MOCK_STAFF = [
  { id: "1", name: "Dr. Abebe Bekele", position: "Dean", college: "College of Technology" },
  { id: "2", name: "Prof. Sara Mohammed", position: "Department Head", college: "College of Health Sciences" },
  { id: "3", name: "Mr. Dawit Haile", position: "Administrative Director", college: "College of Business" },
  { id: "4", name: "Dr. Hanna Tesfaye", position: "Dean", college: "College of Social Sciences" },
];

// Define validation schema
const vehicleFormSchema = z.object({
  make: z.string().min(2, "Make must be at least 2 characters"),
  model: z.string().min(2, "Model must be at least 2 characters"),
  year: z
    .string()
    .refine((val) => !isNaN(parseInt(val)) && parseInt(val) > 1900 && parseInt(val) <= new Date().getFullYear(), {
      message: `Year must be between 1900 and ${new Date().getFullYear()}`,
    }),
  licensePlate: z.string().min(3, "License plate is required"),
  vin: z.string().optional(),
  fuelType: z.string({ required_error: "Fuel type is required" }),
  fuelCapacity: z
    .string()
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
      message: "Fuel capacity must be a positive number",
    })
    .optional(),
  description: z.string().optional(),
  assignedStaffId: z.string().optional(),
});

type VehicleFormValues = z.infer<typeof vehicleFormSchema>;

export function AddVehicleForm({ onSubmit }: { onSubmit: () => void }) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. Define form with validation schema
  const form = useForm<VehicleFormValues>({
    resolver: zodResolver(vehicleFormSchema),
    defaultValues: {
      description: "",
      fuelType: "diesel",
    },
  });

  // 2. Handle form submission
  const handleSubmit = async (values: VehicleFormValues) => {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log("Vehicle data:", values);
      toast.success("Vehicle added successfully");
      onSubmit();
      form.reset();
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="make"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Make</FormLabel>
                <FormControl>
                  <Input placeholder="Toyota, Ford, etc." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="model"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Model</FormLabel>
                <FormControl>
                  <Input placeholder="Land Cruiser, F-150, etc." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="year"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Year</FormLabel>
                <FormControl>
                  <Input placeholder="2023" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="licensePlate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>License Plate</FormLabel>
                <FormControl>
                  <Input placeholder="AAU-1234" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="vin"
            render={({ field }) => (
              <FormItem>
                <FormLabel>VIN (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="Vehicle Identification Number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="fuelType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fuel Type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select fuel type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="diesel">Diesel</SelectItem>
                    <SelectItem value="petrol">Petrol</SelectItem>
                    <SelectItem value="hybrid">Hybrid</SelectItem>
                    <SelectItem value="electric">Electric</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="fuelCapacity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fuel Capacity (Liters) (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="60" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="assignedStaffId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Assigned Owner (Optional)</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select staff member" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {MOCK_STAFF.map((staff) => (
                      <SelectItem key={staff.id} value={staff.id}>
                        {staff.name} - {staff.position}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Additional details about the vehicle..."
                  {...field}
                  rows={3}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Adding Vehicle..." : "Add Vehicle"}
        </Button>
      </form>
    </Form>
  );
}
