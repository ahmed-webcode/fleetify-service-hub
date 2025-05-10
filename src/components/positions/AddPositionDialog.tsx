
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { apiClient, CreatePositionDto } from "@/lib/apiClient";
import { getFlattenedLevels, FlattenedLevel } from "@/lib/levelService";
import { useDebounce } from "@/hooks/useDebounce";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { LevelSelector } from "@/components/positions/LevelSelector";

interface AddPositionDialogProps {
  open: boolean;
  onClose: () => void;
}

const formSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  fuelQuota: z.number().min(0, { message: "Fuel quota must be a positive number" }),
  vehicleEntitlement: z.boolean(),
  policyReference: z.string().min(1, { message: "Policy reference is required" }),
  levelId: z.number().min(1, { message: "Level selection is required" }),
});

export const AddPositionDialog = ({ open, onClose }: AddPositionDialogProps) => {
  const [useProjects, setUseProjects] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      fuelQuota: 0,
      vehicleEntitlement: false,
      policyReference: "",
      levelId: 0,
    },
  });

  // Get flattened levels from localStorage
  const flattenedLevels = getFlattenedLevels();

  // Create mutation
  const createMutation = useMutation({
    mutationFn: (data: CreatePositionDto) => apiClient.positions.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['positions'] });
      toast.success("Position created successfully");
      form.reset();
      onClose();
    },
    onError: (error: any) => {
      toast.error(`Failed to create position: ${error.message}`);
    }
  });

  // Handle form submission
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    createMutation.mutate(values as CreatePositionDto);
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add New Position</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Position name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="fuelQuota"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Weekly Fuel Quota (Liters)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="0" 
                        placeholder="Fuel quota in liters" 
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
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
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input placeholder="Position description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="vehicleEntitlement"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Vehicle Entitlement</FormLabel>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="policyReference"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Policy Reference</FormLabel>
                    <FormControl>
                      <Input placeholder="Policy reference" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <FormLabel>Level</FormLabel>
                <div className="flex items-center space-x-2">
                  <FormLabel htmlFor="project-toggle" className="text-sm cursor-pointer">
                    Use Projects
                  </FormLabel>
                  <Switch
                    id="project-toggle"
                    checked={useProjects}
                    onCheckedChange={setUseProjects}
                  />
                </div>
              </div>

              <FormField
                control={form.control}
                name="levelId"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <LevelSelector
                        useProjects={useProjects}
                        levelId={field.value}
                        onChange={field.onChange}
                        onSearchChange={setSearchTerm}
                        searchTerm={searchTerm}
                        debouncedSearchTerm={debouncedSearchTerm}
                        levels={flattenedLevels}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
                disabled={createMutation.isPending}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={createMutation.isPending}
              >
                {createMutation.isPending ? "Creating..." : "Create Position"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
