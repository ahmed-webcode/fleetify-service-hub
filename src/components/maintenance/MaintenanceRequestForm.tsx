
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { WrenchIcon, UploadIcon } from "lucide-react";

// Define the form schema
const formSchema = z.object({
  vehicle: z.string().min(3, { message: "Please select a vehicle" }),
  details: z.string().min(10, { message: "Please provide detailed information about the issue" }),
  priority: z.enum(["low", "medium", "high"], { required_error: "Please select a priority level" }),
  estimatedCost: z.string().optional(),
  documents: z.array(z.any()).optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface MaintenanceRequestFormProps {
  onSubmitSuccess: (data: any) => void;
}

export function MaintenanceRequestForm({ onSubmitSuccess }: MaintenanceRequestFormProps) {
  const [fileList, setFileList] = useState<File[]>([]);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      vehicle: "",
      details: "",
      priority: "medium",
      estimatedCost: "",
      documents: [],
    },
  });

  // Sample vehicles data - in a real app, this would come from an API
  const vehicles = [
    { id: "1", name: "Toyota Land Cruiser (AAU-3201)" },
    { id: "2", name: "Nissan Patrol (AAU-1450)" },
    { id: "3", name: "Toyota Hilux (AAU-8742)" },
    { id: "4", name: "Toyota Corolla (AAU-5214)" },
    { id: "5", name: "Hyundai H-1 (AAU-6390)" },
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles) {
      const filesArray = Array.from(selectedFiles);
      setFileList((prev) => [...prev, ...filesArray]);
      
      // Update form value
      const currentDocs = form.getValues("documents") || [];
      form.setValue("documents", [...currentDocs, ...filesArray]);
    }
  };

  const removeFile = (index: number) => {
    setFileList((prev) => prev.filter((_, i) => i !== index));
    
    // Update form value
    const currentDocs = form.getValues("documents") || [];
    form.setValue(
      "documents",
      currentDocs.filter((_, i) => i !== index)
    );
  };

  function onSubmit(data: FormValues) {
    // Convert the file list to URLs (in a real app, these would be uploaded and return URLs)
    const documentUrls = fileList.map(file => file.name);
    
    onSubmitSuccess({
      ...data,
      estimatedCost: data.estimatedCost ? Number(data.estimatedCost) : undefined,
      documentUrls,
      priority: data.priority,
    });
    
    form.reset();
    setFileList([]);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <WrenchIcon className="h-5 w-5" />
          Maintenance Request Form
        </CardTitle>
        <CardDescription>
          Submit a new maintenance request for a vehicle
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="vehicle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vehicle</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a vehicle" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {vehicles.map((vehicle) => (
                        <SelectItem key={vehicle.id} value={vehicle.name}>
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
              name="priority"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Priority</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="details"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Maintenance Details</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe the issue in detail"
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Be specific about the problem and what needs to be fixed.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="estimatedCost"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estimated Cost (if known)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter estimated cost"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Optional: Enter an estimated cost if you have a quote.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="documents"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Supporting Documents</FormLabel>
                  <FormControl>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <label
                          htmlFor="file-upload"
                          className="flex cursor-pointer items-center gap-2 rounded-md border border-dashed border-muted-foreground/30 bg-muted/30 px-4 py-2 text-sm font-medium hover:bg-muted/50"
                        >
                          <UploadIcon className="h-4 w-4" />
                          Upload Files
                          <Input
                            id="file-upload"
                            type="file"
                            className="hidden"
                            onChange={handleFileChange}
                            multiple
                            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                          />
                        </label>
                      </div>
                      
                      {fileList.length > 0 && (
                        <div className="mt-4 space-y-2">
                          <p className="text-sm font-medium">Uploaded Files:</p>
                          <ul className="text-sm">
                            {fileList.map((file, index) => (
                              <li key={index} className="flex items-center justify-between rounded-md border border-border bg-muted/30 px-3 py-2">
                                <span className="truncate max-w-[200px]">{file.name}</span>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeFile(index)}
                                >
                                  Remove
                                </Button>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormDescription>
                    Upload photos, invoices, or other relevant documents (optional)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full md:w-auto">Submit Maintenance Request</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
