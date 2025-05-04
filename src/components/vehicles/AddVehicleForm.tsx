
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
import { Image, Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

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
    .refine((val) => val === '' || (!isNaN(parseFloat(val)) && parseFloat(val) > 0), {
      message: "Fuel capacity must be a positive number",
    })
    .optional(),
  description: z.string().optional(),
  assignedStaffId: z.string().optional(),
  color: z.string().optional(),
  ownership: z.string({ required_error: "Ownership is required" }).default("university"),
  status: z.string({ required_error: "Status is required" }).default("available"),
  mileage: z
    .string()
    .refine((val) => val === '' || (!isNaN(parseInt(val))), {
      message: "Mileage must be a number",
    })
    .optional(),
});

type VehicleFormValues = z.infer<typeof vehicleFormSchema>;

interface AddVehicleFormProps {
  onSubmit: (data: any) => void;
}

export function AddVehicleForm({ onSubmit }: AddVehicleFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Define form with validation schema
  const form = useForm<VehicleFormValues>({
    resolver: zodResolver(vehicleFormSchema),
    defaultValues: {
      description: "",
      fuelType: "diesel",
      ownership: "university",
      status: "available",
    },
  });

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle form submission
  const handleSubmit = async (values: VehicleFormValues) => {
    setIsSubmitting(true);
    
    try {
      // Prepare vehicle data
      const vehicleData = {
        type: values.make,
        model: values.model,
        year: parseInt(values.year),
        plate_number: values.licensePlate,
        chassis_number: values.vin || null,
        fuel_type: values.fuelType,
        color: values.color || null,
        status: values.status,
        km_reading: values.mileage ? parseInt(values.mileage) : 0,
        ownership: values.ownership,
        fuel_consumption: values.fuelCapacity ? parseFloat(values.fuelCapacity) : null,
      };
      
      // Upload image if provided
      let imagePath = null;
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
        const filePath = `vehicle-images/${fileName}`;
        
        try {
          const { error: uploadError } = await supabase.storage
            .from('vehicles')
            .upload(filePath, imageFile);
            
          if (uploadError) {
            throw uploadError;
          }
          
          imagePath = filePath;
        } catch (error) {
          console.error('Error uploading image:', error);
          toast.error("Failed to upload vehicle image");
        }
      }
      
      // Add image path to vehicle data if available
      if (imagePath) {
        vehicleData.image_url = imagePath;
      }
      
      // Pass data to parent component
      onSubmit(vehicleData);
      
      // Reset form
      form.reset();
      setImageFile(null);
      setImagePreview(null);
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error("Failed to add vehicle");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Image upload section */}
        <div className="mb-6">
          <FormLabel className="block mb-2">Vehicle Image (Optional)</FormLabel>
          <div className="flex flex-col items-center p-4 border-2 border-dashed rounded-md border-gray-300 bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
            {imagePreview ? (
              <div className="relative w-full mb-4">
                <img 
                  src={imagePreview} 
                  alt="Vehicle preview" 
                  className="rounded-md mx-auto h-48 object-cover"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => {
                    setImageFile(null);
                    setImagePreview(null);
                  }}
                >
                  Remove
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-5">
                <Image className="w-12 h-12 mb-3 text-gray-400" />
                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  PNG, JPG or JPEG (MAX. 2MB)
                </p>
              </div>
            )}
            <Input
              id="vehicle-image"
              type="file"
              accept="image/png, image/jpeg, image/jpg"
              className={imagePreview ? "hidden" : "opacity-0 absolute inset-0 w-full h-full cursor-pointer"}
              onChange={handleImageUpload}
            />
            {!imagePreview && (
              <label 
                htmlFor="vehicle-image" 
                className="w-full cursor-pointer absolute inset-0 flex items-center justify-center"
              >
                <span className="sr-only">Upload vehicle image</span>
              </label>
            )}
          </div>
        </div>

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
                <FormLabel>VIN/Chassis Number (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="Vehicle Identification Number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="color"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Color (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="White, Black, Silver, etc." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

          <FormField
            control={form.control}
            name="ownership"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ownership</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select ownership type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="university">University Owned</SelectItem>
                    <SelectItem value="leased">Leased</SelectItem>
                    <SelectItem value="donated">Donated</SelectItem>
                    <SelectItem value="project">Project Vehicle</SelectItem>
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
            name="mileage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Current Mileage (km)</FormLabel>
                <FormControl>
                  <Input placeholder="0" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="available">Available</SelectItem>
                    <SelectItem value="maintenance">In Maintenance</SelectItem>
                    <SelectItem value="out_of_service">Out of Service</SelectItem>
                    <SelectItem value="assigned">Assigned</SelectItem>
                  </SelectContent>
                </Select>
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
