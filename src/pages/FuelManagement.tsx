import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, PlusCircle, AlertTriangle, BarChart } from "lucide-react";
import { HasPermission } from "@/components/auth/HasPermission";

export default function FuelManagement() {
  const { hasPermission } = useAuth();
  
  // Just a placeholder - we'll use real data fetching in a production app
  const [loading, setLoading] = useState(false);

  // Component that shows when user doesn't have access
  const AccessRestricted = () => (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="rounded-full bg-muted p-4 mb-4">
        <AlertTriangle className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-medium mb-2">Access Restricted</h3>
      <p className="text-muted-foreground text-center max-w-md">
        You don't have permission to access the Fuel Management page.
        Please contact your administrator for assistance.
      </p>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Fuel Management</h1>
          <p className="text-muted-foreground">
            Track and manage fuel consumption across your fleet
          </p>
        </div>

        <HasPermission 
          permission="request_maintenance" 
          fallback={null}
        >
          <Button className="gap-1.5">
            <Plus className="h-4 w-4" />
            <span>Request Fuel</span>
          </Button>
        </HasPermission>
      </div>

      {!hasPermission("view_reports") ? (
        <AccessRestricted />
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Consumption
                </CardTitle>
                <BarChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,248 L</div>
                <p className="text-xs text-muted-foreground">
                  +12% from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Average Cost
                </CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$1.73</div>
                <p className="text-xs text-muted-foreground">
                  Per liter in current month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Pending Requests
                </CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8</div>
                <p className="text-xs text-muted-foreground">
                  Awaiting approval
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Most Active Vehicle
                </CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Toyota Hiace</div>
                <p className="text-xs text-muted-foreground">
                  328 liters consumed
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Fuel Management Tabs */}
          <Tabs defaultValue="consumption" className="space-y-4">
            <TabsList>
              <TabsTrigger value="consumption">Consumption</TabsTrigger>
              <TabsTrigger value="requests">Requests</TabsTrigger>
              <TabsTrigger value="reports">Reports</TabsTrigger>
            </TabsList>
            <TabsContent value="consumption" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Fuel Consumption History</CardTitle>
                  <CardDescription>
                    Monthly breakdown of fuel usage across all vehicles
                  </CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                  {/* Placeholder for chart */}
                  <div className="h-[300px] w-full rounded-md border border-dashed flex items-center justify-center">
                    <p className="text-center text-muted-foreground">
                      Fuel consumption chart will be displayed here
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="requests" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Fuel Requests</CardTitle>
                  <CardDescription>
                    Manage and track fuel requests
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border border-dashed p-8">
                    <div className="flex flex-col items-center justify-center text-center">
                      <PlusCircle className="h-12 w-12 text-muted-foreground opacity-50 mb-2" />
                      <h3 className="text-lg font-medium mb-1">No requests yet</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        There are no fuel requests at the moment. Create one to get started.
                      </p>
                      <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        New Fuel Request
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="reports" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Fuel Reports</CardTitle>
                  <CardDescription>
                    Download and analyze fuel reports
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="rounded-md border p-4">
                      <h3 className="font-medium mb-2">Monthly Consumption Report</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Detailed breakdown of fuel usage by vehicle for the current month
                      </p>
                      <Button variant="outline">Download Report</Button>
                    </div>
                    <div className="rounded-md border p-4">
                      <h3 className="font-medium mb-2">Quarterly Cost Analysis</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Financial analysis of fuel expenses for the last quarter
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
    </div>
  );
}
