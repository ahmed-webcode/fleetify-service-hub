
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileBarChart, FileText, FileSpreadsheet, Filter } from "lucide-react";

export default function Reports() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
        <p className="text-muted-foreground">View and generate reports for fleet operations</p>
      </div>

      <Tabs defaultValue="fuel">
        <TabsList className="grid grid-cols-4 md:w-[600px]">
          <TabsTrigger value="fuel">Fuel</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
          <TabsTrigger value="usage">Vehicle Usage</TabsTrigger>
          <TabsTrigger value="fleet">Fleet Status</TabsTrigger>
        </TabsList>
        
        <TabsContent value="fuel" className="space-y-4 mt-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <ReportCard 
              title="Fuel Consumption"
              description="Monthly fuel consumption analysis"
              icon={FileBarChart}
            />
            <ReportCard 
              title="Cost Analysis"
              description="Fuel expenditure by department"
              icon={FileSpreadsheet}
            />
            <ReportCard 
              title="Approvals Summary"
              description="Fuel request approval statistics"
              icon={FileText}
            />
          </div>
        </TabsContent>
        
        <TabsContent value="maintenance" className="space-y-4 mt-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <ReportCard 
              title="Maintenance Costs"
              description="Cost breakdown by vehicle"
              icon={FileBarChart}
            />
            <ReportCard 
              title="Service History"
              description="Complete maintenance records"
              icon={FileText}
            />
          </div>
        </TabsContent>
        
        <TabsContent value="usage" className="space-y-4 mt-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <ReportCard 
              title="Vehicle Utilization"
              description="Usage rates across departments"
              icon={FileBarChart}
            />
            <ReportCard 
              title="Distance Traveled"
              description="Mileage analytics by vehicle"
              icon={FileSpreadsheet}
            />
          </div>
        </TabsContent>
        
        <TabsContent value="fleet" className="space-y-4 mt-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <ReportCard 
              title="Fleet Overview"
              description="Status of all vehicles"
              icon={FileBarChart}
            />
            <ReportCard 
              title="Vehicle Status"
              description="Active/inactive vehicle analysis"
              icon={FileSpreadsheet}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface ReportCardProps {
  title: string;
  description: string;
  icon: React.ElementType;
}

function ReportCard({ title, description, icon: Icon }: ReportCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-medium">{title}</CardTitle>
        <Icon className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <CardDescription>{description}</CardDescription>
        <div className="mt-4 flex justify-between">
          <span className="text-sm text-muted-foreground">Last generated: Today</span>
          <button className="text-sm font-medium text-primary flex items-center gap-1">
            Generate <Filter className="h-3 w-3" />
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
