
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  Form,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { apiClient, CreateFuelRequestDto, TargetType } from "@/lib/apiClient";
import { useQuery } from "@tanstack/react-query";

const formSchema = z.object({
  targetType: z.enum(["VEHICLE", "GENERATOR"]),
  vehicleId: z.number().optional().nullable(),
  fuelTypeId: z.number(),
  requestNote: z.string().optional(),
  requestedAmount: z.number().positive("Amount must be greater than 0"),
});

type FuelFormValues = z.infer<typeof formSchema>;

interface FuelRequestFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function FuelRequestForm({ onSuccess, onCancel }: FuelRequestFormProps) {
  const [loading, setLoading] = useState(false);
  const [showVehicleField, setShowVehicleField] = useState(true);

  const form = useForm<FuelFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      targetType: "VEHICLE",
      vehicleId: null,
      fuelTypeId: undefined,
      requestNote: "",
      requestedAmount: undefined,
    },
  });

  // Fetch vehicles for the dropdown
  const { data: vehiclesData, isLoading: isLoadingVehicles } = useQuery({
    queryKey: ["vehicles", 0, 100],
    queryFn: async () => {
      return apiClient.vehicles.getAll({ page: 0, size: 100 });
    },
  });

  // Mock fuel types (replace with actual API call if endpoint exists)
  const fuelTypes = [
    { id: 1, name: "Petrol" },
    { id: 2, name: "Diesel" },
    { id: 3, name: "Electric" },
  ];

  // Watch target type to show/hide vehicle field
  const targetType = form.watch("targetType");

  useEffect(() => {
    setShowVehicleField(targetType === "VEHICLE");
    if (targetType === "GENERATOR") {
      form.setValue("vehicleId", null);
    }
  }, [targetType, form]);

  const onSubmit = async (data: FuelFormValues) => {
    try {
      setLoading(true);

      const requestData: CreateFuelRequestDto = {
        targetType: data.targetType as TargetType,
        fuelTypeId: data.fuelTypeId,
        requestedAmount: data.requestedAmount,
      };

      if (data.targetType === "VEHICLE" && data.vehicleId) {
        requestData.vehicleId = data.vehicleId;
      }

      if (data.requestNote) {
        requestData.requestNote = data.requestNote;
      }

      await apiClient.fuel.requests.create(requestData);
      toast.success("Fuel request submitted successfully");
      form.reset();
      if (onSuccess) onSuccess();
    } catch (error: any) {
      toast.error("Failed to submit request: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormItem>
          <FormLabel>Target Type</FormLabel>
          <Select
            onValueChange={(value) => form.setValue("targetType", value as any)}
            defaultValue={form.getValues("targetType")}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select target type" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="VEHICLE">Vehicle</SelectItem>
              <SelectItem value="GENERATOR">Generator</SelectItem>
            </SelectContent>
          </Select>
          <FormDescription>
            Select whether this is for a vehicle or generator
          </FormDescription>
          <FormMessage />
        </FormItem>

        {showVehicleField && (
          <FormItem>
            <FormLabel>Vehicle</FormLabel>
            <Select
              onValueChange={(value) =>
                form.setValue("vehicleId", parseInt(value))
              }
              disabled={isLoadingVehicles}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select a vehicle" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {vehiclesData?.content.map((vehicle) => (
                  <SelectItem key={vehicle.id} value={vehicle.id.toString()}>
                    {vehicle.model} ({vehicle.plateNumber})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormDescription>
              Select the vehicle requiring fuel
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}

        <FormItem>
          <FormLabel>Fuel Type</FormLabel>
          <Select
            onValueChange={(value) =>
              form.setValue("fuelTypeId", parseInt(value))
            }
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select fuel type" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {fuelTypes.map((fuelType) => (
                <SelectItem key={fuelType.id} value={fuelType.id.toString()}>
                  {fuelType.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormDescription>Select the type of fuel needed</FormDescription>
          <FormMessage />
        </FormItem>

        <FormItem>
          <FormLabel>Amount (Liters)</FormLabel>
          <FormControl>
            <Input
              type="number"
              min={1}
              step={0.1}
              placeholder="Enter fuel amount in liters"
              onChange={(e) =>
                form.setValue("requestedAmount", parseFloat(e.target.value))
              }
            />
          </FormControl>
          <FormDescription>
            Enter the amount of fuel required in liters
          </FormDescription>
          <FormMessage />
        </FormItem>

        <FormItem>
          <FormLabel>Request Note (optional)</FormLabel>
          <FormControl>
            <Textarea
              placeholder="Add a note to explain this request"
              {...form.register("requestNote")}
            />
          </FormControl>
          <FormDescription>
            Provide any additional information about this fuel request
          </FormDescription>
          <FormMessage />
        </FormItem>

        <div className="flex justify-end gap-2">
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
