import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import { MaintenanceRequestCreate } from "@/types/maintenance";
import { VehicleDto } from "@/types/vehicle";
import { toast } from "sonner";

export interface MaintenanceRequestFormProps {
    onSuccess: () => void;
    onCancel?: () => void;
}

export const MaintenanceRequestForm = ({ onSuccess, onCancel }: MaintenanceRequestFormProps) => {
    const [form, setForm] = useState<MaintenanceRequestCreate>({
        vehicleId: 0,
        title: "",
        description: "",
    });
    const [loading, setLoading] = useState(false);

    // Fetch vehicles for the select
    const { data: vehiclesData, isLoading: isLoadingVehicles } = useQuery({
        queryKey: ["vehicles", "all"],
        queryFn: () => apiClient.vehicles.getAll({ size: 1000 }),
    });
    const vehicles: VehicleDto[] = vehiclesData?.content || [];

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleVehicleChange = (value: string) => {
        setForm((prev) => ({ ...prev, vehicleId: parseInt(value) }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.vehicleId || !form.title.trim() || !form.description.trim()) {
            toast.error("Please fill all required fields.");
            return;
        }
        setLoading(true);
        try {
            await apiClient.maintenance.requests.create(form);
            toast.success("Maintenance request submitted successfully.");
            onSuccess();
        } catch (error: any) {
            toast.error("Failed to submit request: " + (error.message || "Unknown error"));
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Submit Maintenance Request</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">Vehicle</label>
                        <Select
                            value={form.vehicleId ? String(form.vehicleId) : ""}
                            onValueChange={handleVehicleChange}
                            disabled={isLoadingVehicles}
                            required
                        >
                            <SelectTrigger>
                                <SelectValue
                                    placeholder={
                                        isLoadingVehicles ? "Loading vehicles..." : "Select vehicle"
                                    }
                                />
                            </SelectTrigger>
                            <SelectContent>
                                {vehicles.map((v) => (
                                    <SelectItem key={v.id} value={String(v.id)}>
                                        {v.plateNumber} - {v.model}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Title</label>
                        <Input
                            name="title"
                            value={form.title}
                            onChange={handleChange}
                            placeholder="Enter request title"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Description</label>
                        <Textarea
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            placeholder="Describe the maintenance needed"
                            required
                        />
                    </div>
                    <div className="flex gap-2 justify-end">
                        {onCancel && (
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onCancel}
                                disabled={loading}
                            >
                                Cancel
                            </Button>
                        )}
                        <Button type="submit" disabled={loading}>
                            {loading ? "Submitting..." : "Submit Request"}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
};
