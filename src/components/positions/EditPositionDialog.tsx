
import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { apiClient, Position, UpdatePositionDto, PositionStatus } from "@/lib/apiClient";
import { getFlattenedLevels } from "@/lib/levelService";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface EditPositionDialogProps {
  open: boolean;
  onClose: () => void;
  position: Position;
}

const formSchema = z.object({
  id: z.number(),
  name: z.string().min(1, { message: "Name is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  fuelQuota: z.number().min(0, { message: "Fuel quota must be a positive number" }),
  vehicleEntitlement: z.boolean(),
  policyReference: z.string().min(1, { message: "Policy reference is required" }),
  levelId: z.number().min(1, { message: "Level selection is required" }),
  status: z.nativeEnum(PositionStatus),
});

export const EditPositionDialog = ({ 
  open, 
  onClose,
  position 
}: EditPositionDialogProps) => {
  const [useProjects, setUseProjects] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: position.id,
      name: position.name,
      description: position.description,
      fuelQuota: position.fuelQuota,
      vehicleEntitlement: position.vehicleEntitlement,
      policyReference: position.policyReference,
      levelId: 0, // We'll need to find the correct levelId
      status: position.status as PositionStatus || PositionStatus.ACTIVE,
    },
  });

  // Get flattened levels from localStorage - exclude structural levels
  const flattenedLevels = getFlattenedLevels(false);

  // Update form when position changes
  useEffect(() => {
    if (position && open) {
      form.reset({
        id: position.id,
        name: position.name,
        description: position.description,
        fuelQuota: position.fuelQuota,
        vehicleEntitlement: position.vehicleEntitlement,
        policyReference: position.policyReference,
        levelId: findLevelIdByName(position.levelName, flattenedLevels) || 0,
        status: position.status as PositionStatus || PositionStatus.ACTIVE,
      });
    }
  }, [position, open, form, flattenedLevels]);

  // Find level ID by name (helper function)
  const findLevelIdByName = (name: string, levels: FlattenedLevel[]): number | undefined => {
    const level = levels.find(l => l.name === name);
    return level?.id;
  };

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: (data: UpdatePositionDto) => apiClient.positions.update(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['positions'] });
      toast.success("Position updated successfully");
      onClose();
    },
    onError: (error: any) => {
      toast.error(`Failed to update position: ${error.message}`);
    }
  });

  // Handle form submission
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    updateMutation.mutate(values as UpdatePositionDto);
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Position</DialogTitle>
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

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <FormLabel>Level</FormLabel>
                  <div className="flex items-center space-x-2">
                    <FormLabel htmlFor="project-toggle-edit" className="text-sm cursor-pointer">
                      Use Projects
                    </FormLabel>
                    <Switch
                      id="project-toggle-edit"
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

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select 
                      onValueChange={(value) => field.onChange(value as PositionStatus)}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.values(PositionStatus).map((status) => (
                          <SelectItem key={status} value={status}>
                            {status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                disabled={updateMutation.isPending}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={updateMutation.isPending}
              >
                {updateMutation.isPending ? "Updating..." : "Update Position"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
