
import { useState, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
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
import { apiClient } from "@/lib/apiClient";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader } from "lucide-react";

// Define interface for user data
interface User {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  canDrive: boolean;
}

// Define the schema for vehicle data
const vehicleSchema = z.object({
  type: z.string().min(2, "Type must be at least 2 characters."),
  model: z.string().min(2, "Model must be at least 2 characters."),
  made_year: z.coerce.number().min(1900).max(new Date().getFullYear() + 1),
  plate_number: z.string().min(2, "License plate is required."),
  chassis_number: z.string().min(2, "Chassis number is required."),
  motor_number: z.string().min(2, "Motor number is required."),
  fuel_type_id: z.coerce.number().min(1, "Fuel type is required."),
  fuel_consumption: z.coerce.number().min(0).optional(),
  color: z.string().min(1, "Color is required."),
  status: z.string().min(1, "Status is required."),
  km_reading: z.coerce.number().min(0),
  horse_power: z.coerce.number().min(0),
  single_weight: z.coerce.number().min(0),
  total_weight: z.coerce.number().min(0),
  cylinder_count: z.coerce.number().min(0),
  axle_count: z.coerce.number().min(0),
  seats_count: z.coerce.number().min(0),
  made_in: z.string().min(1, "Country of origin is required."),
  is_private: z.boolean().default(false),
  responsible_staff_id: z.coerce.number().min(1, "Responsible staff is required."),
  driver_id: z.coerce.number().optional(),
  insurance_company: z.string().optional(),
  insurance_end_date: z.string().optional(),
});

export function AddVehicleForm({ onSubmit }) {
  const [imageFile, setImageFile] = useState(null);
  const [libreFile, setLibreFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [isProjectVehicle, setIsProjectVehicle] = useState(false);

  // Fetch users for responsible staff and driver selection
  const { data: users = [], isLoading: isLoadingUsers } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      try {
        return await apiClient.users.getAll();
      } catch (error) {
        console.error("Failed to fetch users:", error);
        toast.error("Failed to load users");
        return [];
      }
    },
  });

  const form = useForm({
    resolver: zodResolver(vehicleSchema),
    defaultValues: {
      type: "",
      model: "",
      made_year: new Date().getFullYear(),
      plate_number: "",
      chassis_number: "",
      motor_number: "",
      fuel_type_id: 1,
      fuel_consumption: 0,
      color: "",
      status: "available",
      km_reading: 0,
      horse_power: 0,
      single_weight: 0,
      total_weight: 0,
      cylinder_count: 0,
      axle_count: 0,
      seats_count: 0,
      made_in: "",
      is_private: false,
      responsible_staff_id: undefined,
      driver_id: undefined,
      insurance_company: "",
      insurance_end_date: "",
    },
  });

  // Watch for responsible_staff_id changes to conditionally show driver field
  const responsibleStaffId = form.watch("responsible_staff_id");
  const selectedStaff = users.find(user => user.id === Number(responsibleStaffId));
  const showDriverField = selectedStaff && !selectedStaff.canDrive;
  
  // Get available drivers (users who can drive)
  const availableDrivers = users.filter(user => user.canDrive);

  const handleImageUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleLibreUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      setLibreFile(e.target.files[0]);
    }
  };

  const uploadImage = async (vehicleId, file, type) => {
    if (!file) return null;
    
    const fileExt = file.name.split('.').pop();
    const fileName = `${vehicleId}_${type}.${fileExt}`;
    
    try {
      const { data, error } = await supabase.storage
        .from('vehicles')
        .upload(`images/${fileName}`, file, {
          upsert: true,
          contentType: file.type,
        });
        
      if (error) {
        throw error;
      }
      
      const { data: urlData } = supabase.storage
        .from('vehicles')
        .getPublicUrl(`images/${fileName}`);
        
      return urlData.publicUrl;
    } catch (error) {
      toast.error(`Error uploading ${type} image: ` + error.message);
      return null;
    }
  };

  const handleSubmit = async (values) => {
    try {
      if (!libreFile) {
        toast.error('Libre document is required');
        return;
      }
      
      setUploading(true);
      
      // First, submit the base vehicle data
      const result = await onSubmit(values);
      
      if (result.success) {
        // If vehicle was added successfully, upload images
        const vehicleId = result.data?.id;
        if (vehicleId) {
          // Upload vehicle image if present
          let imgSrc = null;
          if (imageFile) {
            imgSrc = await uploadImage(vehicleId, imageFile, 'vehicle');
          }
          
          // Upload libre document (required)
          const libreSrc = await uploadImage(vehicleId, libreFile, 'libre');
          
          // Update the vehicle with image URLs
          if (imgSrc || libreSrc) {
            const updateData = {};
            if (imgSrc) updateData.img_src = imgSrc;
            if (libreSrc) updateData.libre_src = libreSrc;
            
            const { error: updateError } = await supabase
              .from('vehicles')
              .update(updateData)
              .eq('id', vehicleId);
              
            if (updateError) {
              throw updateError;
            }
          }
          
          toast.success('Vehicle added successfully!');
        }
      }
      
      form.reset();
      setImageFile(null);
      setLibreFile(null);
    } catch (error) {
      toast.error('Error: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {/* Basic Vehicle Information */}
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
            name="made_year"
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
            name="fuel_type_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fuel Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value.toString()}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select fuel type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="1">Diesel</SelectItem>
                    <SelectItem value="2">Petrol</SelectItem>
                    <SelectItem value="3">Electric</SelectItem>
                    <SelectItem value="4">Hybrid</SelectItem>
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
            name="made_in"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Country of Origin</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Japan" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="seats_count"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Number of Seats</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Technical Details */}
          <FormField
            control={form.control}
            name="horse_power"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Horse Power</FormLabel>
                <FormControl>
                  <Input type="number" step="0.1" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="single_weight"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Single Weight (kg)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.1" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="total_weight"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Total Weight (kg)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.1" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="cylinder_count"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Number of Cylinders</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="axle_count"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Number of Axles</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Insurance Information */}
          <FormField
            control={form.control}
            name="insurance_company"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Insurance Company</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Awash Insurance" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="insurance_end_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Insurance End Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Ownership Information */}
          <FormField
            control={form.control}
            name="is_private"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-3 space-y-0 p-4 rounded-md border">
                <FormControl>
                  <Checkbox 
                    checked={field.value} 
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Private Vehicle</FormLabel>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Staff/Driver Assignment */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 p-4 bg-muted/20 rounded-md border">
          <h3 className="text-lg font-medium col-span-full mb-2">Staff Assignment</h3>

          <FormField
            control={form.control}
            name="responsible_staff_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Responsible Staff</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value?.toString()}
                  disabled={isLoadingUsers}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select staff member" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {isLoadingUsers ? (
                      <div className="flex items-center justify-center p-2">
                        <Loader className="h-4 w-4 animate-spin mr-2" />
                        Loading...
                      </div>
                    ) : (
                      users.map(user => (
                        <SelectItem key={user.id} value={user.id.toString()}>
                          {user.firstName} {user.lastName} ({user.canDrive ? "Can drive" : "Can't drive"})
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {showDriverField && (
            <FormField
              control={form.control}
              name="driver_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Driver</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value?.toString()}
                    disabled={isLoadingUsers}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select driver" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {isLoadingUsers ? (
                        <div className="flex items-center justify-center p-2">
                          <Loader className="h-4 w-4 animate-spin mr-2" />
                          Loading...
                        </div>
                      ) : (
                        availableDrivers.map(driver => (
                          <SelectItem key={driver.id} value={driver.id.toString()}>
                            {driver.firstName} {driver.lastName}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>

        {/* File Upload Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
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

          <div className="space-y-2">
            <FormLabel className="flex items-center">
              Libre Document <span className="text-destructive ml-1">*</span>
            </FormLabel>
            <Input 
              type="file" 
              accept="image/*,.pdf" 
              onChange={handleLibreUpload}
              className="cursor-pointer"
              required
            />
            {libreFile && (
              <p className="text-sm text-muted-foreground">
                Selected: {libreFile.name}
              </p>
            )}
            {!libreFile && (
              <p className="text-sm text-destructive">
                This field is required
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <Button type="submit" disabled={uploading || !libreFile}>
            {uploading ? "Adding..." : "Add Vehicle"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
