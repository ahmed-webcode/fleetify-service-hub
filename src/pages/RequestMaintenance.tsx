
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Header } from "@/components/layout/Header";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { PageLayout } from "@/components/layout/PageLayout";
import { GeneralMaintenanceRequestForm } from "@/components/maintenance/GeneralMaintenanceRequestForm";

export default function RequestMaintenance() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { hasPermission } = useAuth();
  
  const handleMaintenanceRequest = async (formData: any) => {
    try {
      const { data, error } = await supabase
        .from('maintenance_records')
        .insert([{
          vehicle_id: formData.vehicleId,
          type: formData.maintenanceType,
          description: formData.description,
          service_date: new Date().toISOString().split('T')[0],
          odometer_reading: formData.odometerReading || 0,
          status: 'pending'
        }]);
        
      if (error) throw error;
      
      toast.success('Maintenance request submitted successfully!');
      return { success: true };
    } catch (error: any) {
      toast.error('Failed to submit maintenance request: ' + error.message);
      return { success: false, error };
    }
  };
  
  if (!hasPermission("request_maintenance")) {
    return (
      <PageLayout>
        <div className="flex flex-col items-center justify-center py-12">
          <div className="rounded-full bg-muted p-4 mb-4">
            <svg
              className="h-8 w-8 text-muted-foreground"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 15v2m0 0v2m0-2h2m-2 0H9m3-4.5V5.6a1 1 0 0 0-1.4-.92l-5.52 2.6a1 1 0 0 0-.58.92V15a1 1 0 0 0 .4.8l5 4a1 1 0 0 0 1.2 0l5-4a1 1 0 0 0 .4-.8V8.2a1 1 0 0 0-.57-.92l-1.43-.67"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium mb-2">Access Restricted</h3>
          <p className="text-muted-foreground text-center max-w-md">
            You don't have permission to request maintenance. Please contact your administrator for assistance.
          </p>
        </div>
      </PageLayout>
    );
  }
  
  return (
    <PageLayout>
      <div className="page-container">
        <div className="page-title-container">
          <h1 className="page-title">Request Maintenance</h1>
          <p className="page-description">
            Submit a maintenance request for a vehicle
          </p>
        </div>

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
    </PageLayout>
  );
}
