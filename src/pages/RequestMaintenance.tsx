
import React from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import { GeneralMaintenanceRequestForm } from "@/components/maintenance/GeneralMaintenanceRequestForm";
import { Card } from "@/components/ui/card";

export default function RequestMaintenance() {
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
    </PageLayout>
  );
}
