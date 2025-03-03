
import { useState } from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { 
  MetricsOverview, 
  ServiceStatusOverview 
} from "@/components/dashboard/MetricsOverview";
import { Button } from "@/components/ui/button";
import { 
  Car, 
  Calendar, 
  Clock, 
  ArrowRight, 
  AlertTriangle, 
  RefreshCw, 
  ChevronDown, 
  ChevronUp,
  BarChart3
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { cn } from "@/lib/utils";

const Dashboard = () => {
  const [tabValue, setTabValue] = useState("overview");
  const [isLoading, setIsLoading] = useState(false);
  
  const refreshData = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  return (
    <PageLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Fleet management overview and analytics</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={refreshData}
            disabled={isLoading}
            className="gap-2"
          >
            <RefreshCw className={cn("h-4 w-4", { "animate-spin": isLoading })} />
            Refresh
          </Button>
          <Button size="sm">New Request</Button>
        </div>
      </div>
      
      <Tabs 
        defaultValue="overview" 
        value={tabValue} 
        onValueChange={setTabValue}
        className="space-y-4"
      >
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6 animate-fade-in">
          <MetricsOverview />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <DashboardCard 
              title="Recent Service Requests"
              icon={<Button variant="ghost" size="sm" className="gap-1 text-xs">
                View All <ArrowRight className="h-3 w-3" />
              </Button>}
            >
              <div className="space-y-3">
                {[
                  { id: 'SR-2305', type: 'Maintenance', vehicle: 'Toyota Land Cruiser', date: '2023-06-12', status: 'pending' },
                  { id: 'SR-2304', type: 'Fleet', vehicle: 'Nissan Patrol', date: '2023-06-10', status: 'approved' },
                  { id: 'SR-2303', type: 'Fuel', vehicle: 'Toyota Hilux', date: '2023-06-09', status: 'completed' },
                  { id: 'SR-2302', type: 'Maintenance', vehicle: 'Toyota Corolla', date: '2023-06-08', status: 'completed' },
                ].map((request) => (
                  <div 
                    key={request.id}
                    className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-2 h-2 rounded-full",
                        request.status === 'completed' ? "bg-green-500" :
                        request.status === 'approved' ? "bg-blue-500" :
                        "bg-amber-500"
                      )}></div>
                      <div>
                        <h4 className="text-sm font-medium">{request.id} - {request.type}</h4>
                        <p className="text-xs text-muted-foreground">{request.vehicle}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-right">
                        <span className="text-xs text-muted-foreground">
                          <Calendar className="inline-block h-3 w-3 mr-1" />
                          {request.date}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </DashboardCard>
            
            <DashboardCard title="Service Status" icon={<Clock className="h-5 w-5" />}>
              <div className="mb-6">
                <ServiceStatusOverview />
              </div>
              
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Completed', value: 24, color: '#22c55e' },
                        { name: 'In Progress', value: 12, color: '#eab308' },
                        { name: 'Pending', value: 7, color: '#ef4444' },
                      ]}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {[
                        { name: 'Completed', value: 24, color: '#22c55e' },
                        { name: 'In Progress', value: 12, color: '#eab308' },
                        { name: 'Pending', value: 7, color: '#ef4444' },
                      ].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value: number) => [`${value} Requests`, 'Count']}
                      contentStyle={{ 
                        borderRadius: '8px',
                        border: '1px solid hsl(var(--border))',
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </DashboardCard>
          </div>
          
          <DashboardCard 
            title="Fleet Utilization" 
            icon={<BarChart3 className="h-5 w-5" />}
          >
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    { name: 'Jan', fleet: 65, fuel: 42, maintenance: 18 },
                    { name: 'Feb', fleet: 58, fuel: 40, maintenance: 22 },
                    { name: 'Mar', fleet: 70, fuel: 45, maintenance: 15 },
                    { name: 'Apr', fleet: 80, fuel: 55, maintenance: 20 },
                    { name: 'May', fleet: 75, fuel: 50, maintenance: 25 },
                    { name: 'Jun', fleet: 85, fuel: 60, maintenance: 30 },
                  ]}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip
                    contentStyle={{ 
                      borderRadius: '8px',
                      border: '1px solid hsl(var(--border))',
                      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
                    }}
                  />
                  <Bar dataKey="fleet" name="Fleet Requests" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="fuel" name="Fuel Requests" fill="hsl(221, 83%, 70%)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="maintenance" name="Maintenance" fill="hsl(221, 83%, 85%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </DashboardCard>
        </TabsContent>

        <TabsContent value="analytics" className="animate-fade-in">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="bg-card border border-border rounded-xl p-5">
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Total Requests YTD</h3>
              <div className="text-3xl font-bold">1,248</div>
              <div className="text-sm text-green-600 mt-1 flex items-center">
                <ChevronUp className="h-4 w-4" /> 
                8.2% from last year
              </div>
            </div>
            <div className="bg-card border border-border rounded-xl p-5">
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Avg. Request Processing</h3>
              <div className="text-3xl font-bold">1.4 days</div>
              <div className="text-sm text-red-600 mt-1 flex items-center">
                <ChevronDown className="h-4 w-4" /> 
                0.2 days from target
              </div>
            </div>
            <div className="bg-card border border-border rounded-xl p-5">
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Request Approval Rate</h3>
              <div className="text-3xl font-bold">84.5%</div>
              <div className="text-sm text-green-600 mt-1 flex items-center">
                <ChevronUp className="h-4 w-4" /> 
                2.1% from last month
              </div>
            </div>
          </div>
          
          <DashboardCard title="Monthly Service Trends">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={[
                    { name: 'Jan', value: 80 },
                    { name: 'Feb', value: 95 },
                    { name: 'Mar', value: 110 },
                    { name: 'Apr', value: 100 },
                    { name: 'May', value: 120 },
                    { name: 'Jun', value: 115 },
                    { name: 'Jul', value: 130 },
                    { name: 'Aug', value: 140 },
                    { name: 'Sep', value: 135 },
                    { name: 'Oct', value: 150 },
                    { name: 'Nov', value: 145 },
                    { name: 'Dec', value: 160 },
                  ]}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip
                    contentStyle={{ 
                      borderRadius: '8px',
                      border: '1px solid hsl(var(--border))',
                      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
                    }}
                    formatter={(value: number) => [`${value} Requests`, 'Count']}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    name="Service Requests"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={{ r: 4, fill: "hsl(var(--primary))" }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </DashboardCard>
        </TabsContent>
        
        <TabsContent value="alerts" className="space-y-4 animate-fade-in">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 dark:bg-amber-900/20 dark:border-amber-800">
            <div className="flex items-start gap-3">
              <div className="bg-amber-100 p-2 rounded-full dark:bg-amber-900/50">
                <AlertTriangle className="h-5 w-5 text-amber-700 dark:text-amber-400" />
              </div>
              <div>
                <h3 className="font-medium">Maintenance Due</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  3 vehicles require scheduled maintenance in the next 7 days.
                </p>
                <Button variant="outline" size="sm" className="mt-2">View Vehicles</Button>
              </div>
            </div>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 dark:bg-blue-900/20 dark:border-blue-800">
            <div className="flex items-start gap-3">
              <div className="bg-blue-100 p-2 rounded-full dark:bg-blue-900/50">
                <Car className="h-5 w-5 text-blue-700 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="font-medium">Low Fuel Levels</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  2 vehicles have reported fuel levels below 25%.
                </p>
                <Button variant="outline" size="sm" className="mt-2">Schedule Refueling</Button>
              </div>
            </div>
          </div>
          
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 dark:bg-red-900/20 dark:border-red-800">
            <div className="flex items-start gap-3">
              <div className="bg-red-100 p-2 rounded-full dark:bg-red-900/50">
                <AlertTriangle className="h-5 w-5 text-red-700 dark:text-red-400" />
              </div>
              <div>
                <h3 className="font-medium">Overdue Maintenance</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  1 vehicle has missed scheduled maintenance by more than 14 days.
                </p>
                <Button variant="outline" size="sm" className="mt-2">View Details</Button>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </PageLayout>
  );
};

export default Dashboard;
