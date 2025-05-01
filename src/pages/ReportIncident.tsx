
import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { PageLayout } from "@/components/layout/PageLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { CalendarIcon, Upload } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

// Define form schema
const incidentFormSchema = z.object({
  vehicleId: z.string({ required_error: "Please select a vehicle" }),
  incidentType: z.string({ required_error: "Please select incident type" }),
  description: z.string().min(10, "Description must be at least 10 characters"),
  incidentDate: z.date({ required_error: "Please select date of incident" }),
  location: z.string().min(3, "Location must be at least 3 characters"),
});

type IncidentFormValues = z.infer<typeof incidentFormSchema>;

// Mock vehicle data - in a real app, this would come from API
const MOCK_VEHICLES = [
  { id: "1", name: "Toyota Land Cruiser (AAU-1234)" },
  { id: "2", name: "Toyota Hiace (AAU-5678)" },
  { id: "3", name: "Isuzu Bus (AAU-9012)" },
  { id: "4", name: "Nissan Patrol (AAU-3456)" },
];

export default function ReportIncident() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  // Define form with validation
  const form = useForm<IncidentFormValues>({
    resolver: zodResolver(incidentFormSchema),
    defaultValues: {
      description: "",
    },
  });

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setImages((prev) => [...prev, ...newFiles]);
      
      // Create preview URLs
      const newPreviewUrls = newFiles.map(file => URL.createObjectURL(file));
      setPreviewUrls((prev) => [...prev, ...newPreviewUrls]);
    }
  };

  // Remove image
  const removeImage = (index: number) => {
    URL.revokeObjectURL(previewUrls[index]);
    setImages(images.filter((_, i) => i !== index));
    setPreviewUrls(previewUrls.filter((_, i) => i !== index));
  };

  // Form submission handler
  const onSubmit = async (data: IncidentFormValues) => {
    setIsSubmitting(true);
    
    // Create form data to include images
    const formData = new FormData();
    
    // Add form values
    Object.entries(data).forEach(([key, value]) => {
      if (value instanceof Date) {
        formData.append(key, value.toISOString());
      } else {
        formData.append(key, value);
      }
    });
    
    // Add images
    images.forEach((image, index) => {
      formData.append(`image-${index}`, image);
    });
    
    // Simulate API call
    setTimeout(() => {
      console.log("Submitting incident report:", data, images);
      toast.success("Incident report submitted successfully");
      form.reset();
      setImages([]);
      setPreviewUrls([]);
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <PageLayout>
      <div className="page-container">
        <div className="page-title-container">
          <h1 className="page-title">Report Incident</h1>
          <p className="page-description">
            Report any accidents, damages, or incidents involving vehicles
          </p>
        </div>

        <Card className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="vehicleId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vehicle</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select vehicle" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {MOCK_VEHICLES.map((vehicle) => (
                            <SelectItem key={vehicle.id} value={vehicle.id}>
                              {vehicle.name}
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
                  name="incidentType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Incident Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select incident type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="accident">Accident</SelectItem>
                          <SelectItem value="breakdown">Breakdown</SelectItem>
                          <SelectItem value="damage">Damage</SelectItem>
                          <SelectItem value="theft">Theft</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
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
                  name="incidentDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Date of Incident</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date > new Date()}
                            initialFocus
                            className={cn("p-3 pointer-events-auto")}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input placeholder="Where did the incident occur?" {...field} />
                      </FormControl>
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
                    <FormLabel>Incident Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe the incident in detail..." 
                        {...field}
                        rows={5}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-4">
                <div>
                  <FormLabel>Upload Images</FormLabel>
                  <div className="mt-2 flex items-center">
                    <label htmlFor="image-upload" className="cursor-pointer">
                      <div className="bg-secondary text-secondary-foreground px-4 py-2 rounded-md flex items-center gap-2 hover:bg-secondary/80 transition-colors">
                        <Upload size={16} />
                        <span>Upload Photos</span>
                      </div>
                      <input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={handleImageUpload}
                      />
                    </label>
                    <span className="ml-4 text-sm text-muted-foreground">
                      {images.length} {images.length === 1 ? 'file' : 'files'} selected
                    </span>
                  </div>
                </div>

                {previewUrls.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
                    {previewUrls.map((url, index) => (
                      <div key={index} className="relative">
                        <img
                          src={url}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-28 object-cover rounded-md"
                        />
                        <button
                          type="button"
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                          onClick={() => removeImage(index)}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit Incident Report"}
              </Button>
            </form>
          </Form>
        </Card>
      </div>
    </PageLayout>
  );
}
