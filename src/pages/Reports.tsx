
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import ReportGenerator from "@/components/reports/ReportGenerator";
import { FileBarChart, FileText, FileSpreadsheet, Filter } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";

export default function Reports() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Reports"
        description="View and generate reports for fleet operations"
      />

      <div className="card-uniform">
        <ReportGenerator />
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-4 text-center">
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardHeader className="flex flex-row items-center justify-center pb-2">
            <FileBarChart className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <h3 className="font-semibold">Save Report Templates</h3>
            <p className="text-sm text-muted-foreground">Save custom report configurations</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardHeader className="flex flex-row items-center justify-center pb-2">
            <FileText className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <h3 className="font-semibold">Scheduled Reports</h3>
            <p className="text-sm text-muted-foreground">Set up automatic report generation</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardHeader className="flex flex-row items-center justify-center pb-2">
            <FileSpreadsheet className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <h3 className="font-semibold">Advanced Analytics</h3>
            <p className="text-sm text-muted-foreground">Access in-depth data analysis</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardHeader className="flex flex-row items-center justify-center pb-2">
            <Filter className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <h3 className="font-semibold">Custom Filtering</h3>
            <p className="text-sm text-muted-foreground">Create custom filters for reports</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
