
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormDescription,
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
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Upload } from "lucide-react";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  vehicleId: z.string({
    required_error: "Please select a vehicle",
  }),
  incidentDate: z.date({
    required_error: "Incident date is required",
  }),
  description: z.string().min(10, "Description must be at least 10 characters"),
  claimAmount: z.coerce.number().min(1, "Claim amount must be positive"),
});

interface ReportInsuranceClaimFormProps {
  onSubmit: () => void;
}

export function ReportInsuranceClaimForm({ onSubmit }: ReportInsuranceClaimFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      vehicleId: "",
      description: "",
      claimAmount: 0,
    },
  });

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
    onSubmit();
  };

  // Mock data for dropdown
  const vehicles = [
    { id: "v1", name: "Toyota Land Cruiser (AAU-3201)", policy: "INS-1234-5678" },
    { id: "v2", name: "Nissan Patrol (AAU-1450)", policy: "INS-2345-6789" },
    { id: "v3", name: "Toyota Hilux (AAU-8742)", policy: "INS-3456-7890" },
    { id: "v4", name: "Toyota Corolla (AAU-5214)", policy: "INS-4567-8901" },
    { id: "v5", name: "Hyundai H-1 (AAU-6390)", policy: "INS-5678-9012" },
  ];

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
                  {vehicles.map((vehicle) => (
                    <SelectItem key={vehicle.id} value={vehicle.id}>
                      {vehicle.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {field.value && (
                <FormDescription>
                  Policy: {vehicles.find(v => v.id === field.value)?.policy}
                </FormDescription>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="incidentDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Incident Date</FormLabel>
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
                    disabled={(date) =>
                      date > new Date()
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormDescription>
                The date when the incident occurred
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Incident Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe what happened..."
                  className="resize-none"
                  rows={4}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Provide details about the incident, damage, and circumstances
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="claimAmount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Estimated Claim Amount (ETB)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="0.00"
                  {...field}
                  onChange={(e) => field.onChange(e.target.valueAsNumber)}
                />
              </FormControl>
              <FormDescription>
                Estimated cost of repairs or damages
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="space-y-3">
          <FormLabel>Supporting Documents</FormLabel>
          <div className="grid gap-3">
            <div className="border border-dashed rounded-md p-10 text-center">
              <Upload className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
              <div className="text-sm font-medium">
                Click to upload or drag and drop
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                JPG, PNG, PDF up to 10MB
              </div>
              <Input
                type="file"
                className="hidden"
                multiple
                accept=".jpg,.jpeg,.png,.pdf"
              />
            </div>
            <Button type="button" variant="outline" className="w-full">
              <Upload className="h-4 w-4 mr-2" />
              Upload Documents
            </Button>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline">
            Cancel
          </Button>
          <Button type="submit">Submit Claim</Button>
        </div>
      </form>
    </Form>
  );
}
