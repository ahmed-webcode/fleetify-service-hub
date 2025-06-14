import { Card } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { GeneralMaintenanceRequestForm } from "@/components/maintenance/GeneralMaintenanceRequestForm";
import { apiClient } from "@/lib/apiClient";
import { PageHeader } from "@/components/layout/PageHeader";

export default function RequestMaintenance() {
  const { hasPermission } = useAuth();
  
  const handleMaintenanceRequest = async (formData: any) => {
    try {
      // Using our API client instead of Supabase
      const response = await apiClient.maintenance.create({
        vehicleId: formData.vehicleId,
        type: formData.maintenanceType,
        description: formData.description,
        serviceDate: new Date().toISOString().split('T')[0],
        odometerReading: formData.odometerReading || 0,
        status: 'pending'
      });
        
      toast.success('Maintenance request submitted successfully!');
      return { success: true };
    } catch (error: any) {
      toast.error('Failed to submit maintenance request: ' + error.message);
      return { success: false, error };
    }
  };
  
  if (!hasPermission("request_maintenance")) {
    return (
      <div className="space-y-6">
        <PageHeader 
          title="Access Restricted"
          description="You don't have permission to request maintenance. Please contact your administrator for assistance."
        />
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Request Maintenance"
        description="Submit a maintenance request for a vehicle"
      />

      <div className="grid grid-cols-1 gap-6">
        <Card className="p-6">
          <GeneralMaintenanceRequestForm onSubmit={handleMaintenanceRequest} />
        </Card>

        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded shadow-sm">
          <h3 className="text-blue-800 font-medium mb-2">Info</h3>
          <p className="text-blue-700 text-sm">
            Maintenance requests will be reviewed by the Maintenance Team Leader. 
            You will receive a notification when your request has been processed.
          </p>
        </div>
      </div>
    </div>
  );
}
