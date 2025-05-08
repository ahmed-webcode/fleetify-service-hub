import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Calendar, Bell, ChevronRight, Plus, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { HasPermission } from "@/components/auth/HasPermission";
import { useNavigate } from "react-router-dom";

const serviceTypes = ["Fuel", "Maintenance", "Fleet", "All"];

export default function ServiceRequests() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const { hasPermission } = useAuth();
  const navigate = useNavigate();

  // Helper function to determine if the current user can approve requests
  const canApproveRequests = () => {
    return hasPermission("approve_maintenance");
  };

  // Get current user role for display
  const getUserRoleDisplay = () => {
    const { selectedRole } = useAuth();
    return selectedRole?.name || "";
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Service Requests</h1>
          <p className="text-muted-foreground">
            Manage and track service requests across the fleet
          </p>
        </div>

        <div className="flex items-center gap-2">
          <HasPermission permission="request_maintenance">
            <Button
              onClick={() => navigate("/request-maintenance")}
              className="gap-1"
            >
              <Plus className="h-4 w-4" />
              New Request
            </Button>
          </HasPermission>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
            <span className="sr-only">Filter</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {serviceTypes.map((type, index) => (
          <Card key={type}>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">
                {type} Requests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{(index + 1) * 3}</div>
              <p className="text-xs text-muted-foreground">
                {index === 0 ? "2 pending approval" : "1 pending approval"}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="bg-white rounded-md border">
        <div className="p-4 border-b">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h2 className="text-xl font-semibold">Recent Requests</h2>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search requests..."
                className="w-full pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        <Tabs
          defaultValue="all"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <div className="px-4 border-b">
            <TabsList className="h-12 w-full justify-start gap-4 rounded-none border-b-0 bg-transparent p-0">
              <TabsTrigger
                value="all"
                className="data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none border-b-2 border-transparent px-4 py-3"
              >
                All
              </TabsTrigger>
              <TabsTrigger
                value="pending"
                className="data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none border-b-2 border-transparent px-4 py-3"
              >
                Pending
              </TabsTrigger>
              <TabsTrigger
                value="approved"
                className="data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none border-b-2 border-transparent px-4 py-3"
              >
                Approved
              </TabsTrigger>
              <TabsTrigger
                value="rejected"
                className="data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none border-b-2 border-transparent px-4 py-3"
              >
                Rejected
              </TabsTrigger>
              <TabsTrigger
                value="completed"
                className="data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none border-b-2 border-transparent px-4 py-3"
              >
                Completed
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="all" className="p-0">
            <div className="divide-y">
              {/* Example service request rows - replace with real data */}
              <div className="p-4 hover:bg-muted/50">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <Bell className="h-9 w-9 text-primary bg-primary/10 p-2 rounded-full" />
                    <div>
                      <h3 className="font-semibold">
                        Fuel Request - Toyota Landcruiser
                      </h3>
                      <div className="flex flex-col xs:flex-row xs:items-center gap-1 xs:gap-3 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" />
                          <span>23 Apr 2025</span>
                        </span>
                        <span className="hidden xs:inline">•</span>
                        <span>40 liters requested</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 self-end md:self-center">
                    <Badge
                      variant="outline"
                      className="bg-amber-50 text-amber-700 border-amber-200"
                    >
                      Pending
                    </Badge>
                    {canApproveRequests() && (
                      <Button variant="outline" size="sm">
                        Approve
                      </Button>
                    )}
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="p-4 hover:bg-muted/50">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <Bell className="h-9 w-9 text-blue-600 bg-blue-100 p-2 rounded-full" />
                    <div>
                      <h3 className="font-semibold">
                        Maintenance Request - Nissan Patrol
                      </h3>
                      <div className="flex flex-col xs:flex-row xs:items-center gap-1 xs:gap-3 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" />
                          <span>20 Apr 2025</span>
                        </span>
                        <span className="hidden xs:inline">•</span>
                        <span>Oil change and brake inspection</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 self-end md:self-center">
                    <Badge
                      variant="outline"
                      className="bg-emerald-50 text-emerald-700 border-emerald-200"
                    >
                      Approved
                    </Badge>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="p-4 hover:bg-muted/50">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <Bell className="h-9 w-9 text-purple-600 bg-purple-100 p-2 rounded-full" />
                    <div>
                      <h3 className="font-semibold">
                        Fleet Request - Student Field Trip
                      </h3>
                      <div className="flex flex-col xs:flex-row xs:items-center gap-1 xs:gap-3 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" />
                          <span>18 Apr 2025</span>
                        </span>
                        <span className="hidden xs:inline">•</span>
                        <span>25 passengers</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 self-end md:self-center">
                    <Badge
                      variant="outline"
                      className="bg-rose-50 text-rose-700 border-rose-200"
                    >
                      Rejected
                    </Badge>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="pending" className="p-0">
            <div className="p-4 text-center text-muted-foreground">
              Loading pending requests...
            </div>
          </TabsContent>

          <TabsContent value="approved" className="p-0">
            <div className="p-4 text-center text-muted-foreground">
              Loading approved requests...
            </div>
          </TabsContent>

          <TabsContent value="rejected" className="p-0">
            <div className="p-4 text-center text-muted-foreground">
              Loading rejected requests...
            </div>
          </TabsContent>

          <TabsContent value="completed" className="p-0">
            <div className="p-4 text-center text-muted-foreground">
              Loading completed requests...
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
