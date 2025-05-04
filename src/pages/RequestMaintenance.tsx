
import React from "react";
import { Card } from "@/components/ui/card";
import { GeneralMaintenanceRequestForm } from "@/components/maintenance/GeneralMaintenanceRequestForm";
import { Header } from "@/components/layout/Header";
import { useAuth } from "@/contexts/AuthContext";

export default function RequestMaintenance() {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  
  return (
    <div className="min-h-screen bg-background">
      <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} sidebarOpen={sidebarOpen} />
      <main className="flex-1 p-4 md:p-6">
        <div className="page-container">
          <div className="page-title-container">
            <h1 className="page-title">Request Maintenance</h1>
            <p className="page-description">
              Submit a maintenance request for a vehicle
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <Card className="p-6">
              <GeneralMaintenanceRequestForm />
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
      </main>
    </div>
  );
}
