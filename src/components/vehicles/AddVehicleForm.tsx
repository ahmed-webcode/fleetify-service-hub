
import { useState } from "react";
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
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

// Define the schema for vehicle data
const vehicleSchema = z.object({
  type: z.string().min(2, "Type must be at least 2 characters."),
  model: z.string().min(2, "Model must be at least 2 characters."),
  year: z.coerce.number().min(1900).max(new Date().getFullYear() + 1),
  plate_number: z.string().min(2, "License plate is required."),
  chassis_number: z.string().optional(),
  motor_number: z.string().optional(),
  fuel_type: z.string().min(1, "Fuel type is required."),
  fuel_consumption: z.coerce.number().min(0).optional(),
  color: z.string().min(1, "Color is required."),
  status: z.string().min(1, "Status is required."),
  km_reading: z.coerce.number().min(0),
  horse_power: z.coerce.number().min(0).optional(),
  single_weight: z.coerce.number().min(0).optional(),
  total_weight: z.coerce.number().min(0).optional(),
  cylinder_count: z.coerce.number().min(0).optional(),
  axle_count: z.coerce.number().min(0).optional(),
  ownership: z.string().min(1, "Ownership is required."),
  location_id: z.string().optional(),
  is_private: z.boolean().optional(),
  made_in: z.string().optional(),
  // For project vehicles
  project_name: z.string().optional(),
  project_duration_start: z.date().optional(),
  project_duration_end: z.date().optional(),
  project_document: z.string().optional(),
});

export function AddVehicleForm({ onSubmit }) {
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [isProjectVehicle, setIsProjectVehicle] = useState(false);

  const form = useForm({
    resolver: zodResolver(vehicleSchema),
    defaultValues: {
      type: "",
      model: "",
      year: new Date().getFullYear(),
      plate_number: "",
      chassis_number: "",
      motor_number: "",
      fuel_type: "Diesel",
      fuel_consumption: 0,
      color: "",
      status: "available",
      km_reading: 0,
      horse_power: 0,
      single_weight: 0,
      total_weight: 0,
      cylinder_count: 0,
      axle_count: 0,
      ownership: "university",
      location_id: "",
      is_private: false,
      made_in: "",
      project_name: "",
      project_duration_start: undefined,
      project_duration_end: undefined,
      project_document: "",
    },
  });

  const handleImageUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const uploadImage = async (vehicleId) => {
    if (!imageFile) return null;
    
    const fileExt = imageFile.name.split('.').pop();
    const fileName = `${vehicleId}.${fileExt}`;
    
    setUploading(true);
    
    try {
      const { data, error } = await supabase.storage
        .from('vehicles')
        .upload(`images/${fileName}`, imageFile, {
          upsert: true,
          contentType: imageFile.type,
        });
        
      if (error) {
        throw error;
      }
      
      const { data: urlData } = supabase.storage
        .from('vehicles')
        .getPublicUrl(`images/${fileName}`);
        
      return urlData.publicUrl;
    } catch (error) {
      toast.error('Error uploading image: ' + error.message);
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (values) => {
    try {
      setUploading(true);
      
      // Add project vehicle info if applicable
      if (isProjectVehicle) {
        values.is_private = true;
      }
      
      // First, submit the base vehicle data
      const result = await onSubmit(values);
      
      if (result.success && imageFile) {
        // If vehicle was added successfully and we have an image, upload it
        const vehicleId = result.data?.id;
        if (vehicleId) {
          const imageUrl = await uploadImage(vehicleId);
          
          if (imageUrl) {
            // Update the vehicle with the image URL
            const { error: updateError } = await supabase
              .from('vehicles')
              .update({ made_in: imageUrl })
              .eq('id', vehicleId);
              
            if (updateError) {
              throw updateError;
            }
            
            toast.success('Vehicle added with image successfully!');
          }
        }
      }
      
      form.reset();
      setImageFile(null);
    } catch (error) {
      toast.error('Error: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Vehicle Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="SUV">SUV</SelectItem>
                    <SelectItem value="Sedan">Sedan</SelectItem>
                    <SelectItem value="Pickup">Pickup</SelectItem>
                    <SelectItem value="Van">Van</SelectItem>
                    <SelectItem value="Bus">Bus</SelectItem>
                    <SelectItem value="Truck">Truck</SelectItem>
                    <SelectItem value="Minibus">Minibus</SelectItem>
                  </SelectContent>
                </Select>
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
                  <Input placeholder="e.g. Land Cruiser" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="year"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Year</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="plate_number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>License Plate</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. AAU-1234" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="chassis_number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Chassis Number</FormLabel>
                <FormControl>
                  <Input placeholder="Chassis Number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="motor_number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Motor Number</FormLabel>
                <FormControl>
                  <Input placeholder="Motor Number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="fuel_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fuel Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select fuel type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Diesel">Diesel</SelectItem>
                    <SelectItem value="Petrol">Petrol</SelectItem>
                    <SelectItem value="Electric">Electric</SelectItem>
                    <SelectItem value="Hybrid">Hybrid</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="color"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Color</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. White" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="available">Available</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="out_of_service">Out of Service</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="km_reading"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Odometer Reading (km)</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
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
                <Select onValueChange={(value) => {
                  field.onChange(value);
                  setIsProjectVehicle(value === "project");
                }} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select ownership type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="university">University</SelectItem>
                    <SelectItem value="private">Private</SelectItem>
                    <SelectItem value="leased">Leased</SelectItem>
                    <SelectItem value="project">Project</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="location_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="central">Central</SelectItem>
                    <SelectItem value="college">College</SelectItem>
                    <SelectItem value="institute">Institute</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {isProjectVehicle && (
          <div className="space-y-4 mt-4 p-4 bg-blue-50 rounded-md border border-blue-100">
            <h3 className="text-lg font-medium text-blue-800">Project Vehicle Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="project_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Project name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="project_duration_start"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Start Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} 
                        value={field.value ? new Date(field.value).toISOString().split('T')[0] : ''} 
                        onChange={(e) => field.onChange(e.target.value ? new Date(e.target.value) : undefined)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="project_duration_end"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project End Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field}
                        value={field.value ? new Date(field.value).toISOString().split('T')[0] : ''} 
                        onChange={(e) => field.onChange(e.target.value ? new Date(e.target.value) : undefined)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="project_document"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Document</FormLabel>
                    <FormControl>
                      <Input type="file" accept=".pdf,.doc,.docx" className="cursor-pointer"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            field.onChange(e.target.files[0].name);
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        )}

        <div className="space-y-2">
          <FormLabel>Vehicle Image</FormLabel>
          <Input 
            type="file" 
            accept="image/*" 
            onChange={handleImageUpload}
            className="cursor-pointer"
          />
          {imageFile && (
            <p className="text-sm text-muted-foreground">
              Selected: {imageFile.name}
            </p>
          )}
        </div>

        <div className="flex justify-end gap-2">
          <Button type="submit" disabled={uploading}>
            {uploading ? "Adding..." : "Add Vehicle"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
