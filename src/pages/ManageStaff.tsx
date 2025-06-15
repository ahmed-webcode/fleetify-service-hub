import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, PlusCircle, AlertTriangle } from "lucide-react";
import { HasPermission } from "@/components/auth/HasPermission";
import { StaffList } from "@/components/staff/StaffList";
import { AddStaffDialog } from "@/components/staff/AddStaffDialog";

export default function ManageStaff() {
  const { hasPermission } = useAuth();
  const [addStaffOpen, setAddStaffOpen] = useState(false);

  // Component that shows when user doesn't have access
  const AccessRestricted = () => (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="rounded-full bg-muted p-4 mb-4">
        <AlertTriangle className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-medium mb-2">Access Restricted</h3>
      <p className="text-muted-foreground text-center max-w-md">
        You don't have permission to access the Staff Management page.
        Please contact your administrator for assistance.
      </p>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Staff Management</h1>
          <p className="text-muted-foreground">
            Manage and monitor staff members
          </p>
        </div>

        {/* Only users with permission to manage users see the button */}
        <HasPermission permission="manage_user">
          <Button className="gap-1.5" onClick={() => setAddStaffOpen(true)}>
            <Plus className="h-4 w-4" />
            <span>Add Staff</span>
          </Button>
        </HasPermission>
      </div>

      {/* Only users with manage_user permission see the main content */}
      {!hasPermission("manage_user") ? (
        <AccessRestricted />
      ) : (
        <>
          {/* Staff Management Tabs */}
          <Tabs defaultValue="staff" className="space-y-4">
            <TabsList>
              <TabsTrigger value="staff">Staff</TabsTrigger>
              <TabsTrigger value="reports">Reports</TabsTrigger>
            </TabsList>

            <TabsContent value="staff" className="space-y-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Staff List</CardTitle>
                  <CardDescription>
                    View and manage staff members
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <StaffList />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reports" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Staff Reports</CardTitle>
                  <CardDescription>
                    Download and analyze staff reports
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="rounded-md border p-4">
                      <h3 className="font-medium mb-2">Monthly Activity Report</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Detailed breakdown of staff activity for the current month
                      </p>
                      <Button variant="outline">Download Report</Button>
                    </div>
                    <div className="rounded-md border p-4">
                      <h3 className="font-medium mb-2">Quarterly Performance Analysis</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Financial analysis of staff performance for the last quarter
                      </p>
                      <Button variant="outline">Download Report</Button>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t px-6 py-4">
                  <Button variant="outline" className="w-full">
                    Generate Custom Report
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}

      {/* Add Staff Dialog */}
      <AddStaffDialog open={addStaffOpen} onOpenChange={setAddStaffOpen} />
    </div>
  );
}
