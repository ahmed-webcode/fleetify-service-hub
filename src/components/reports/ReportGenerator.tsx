
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { DatePicker } from "@/components/reports/DatePicker";
import { MultiSelect } from "@/components/reports/MultiSelect";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FuelUtilizationReport } from "@/components/reports/FuelUtilizationReport";
import { FleetManagementReport } from "@/components/reports/FleetManagementReport";
import { MaintenanceReport } from "@/components/reports/MaintenanceReport";
import { ComplianceReport } from "@/components/reports/ComplianceReport";
import { toast } from "sonner";
import { FileBarChart, FileText, Download } from "lucide-react";

// Schema for the report parameters
const reportSchema = z.object({
  reportType: z.string(),
  periodType: z.string(),
  startDate: z.date().optional(),
  endDate: z.date().optional(), 
  aggregationLevel: z.string(),
  vehicleIds: z.array(z.string()).optional(),
  driverIds: z.array(z.string()).optional(),
  collegeNames: z.array(z.string()).optional(),
  vehicleTypes: z.array(z.string()).optional(),
  maintenanceStatuses: z.array(z.string()).optional(),
});

type ReportFormValues = z.infer<typeof reportSchema>;

const ReportGenerator = () => {
  const [activeReport, setActiveReport] = useState<string | null>(null);
  const [reportData, setReportData] = useState<any>(null);

  const form = useForm<ReportFormValues>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      reportType: "fuel",
      periodType: "monthly",
      aggregationLevel: "vehicle", 
      vehicleIds: [],
      driverIds: [],
      collegeNames: [],
      vehicleTypes: [],
      maintenanceStatuses: [],
    },
  });
  
  const reportType = form.watch("reportType");
  const periodType = form.watch("periodType");
  
  // Mock data for the select fields
  const vehicles = [
    { id: "v1", label: "Toyota Land Cruiser (AAU-3201)" },
    { id: "v2", label: "Nissan Patrol (AAU-1450)" },
    { id: "v3", label: "Toyota Hilux (AAU-8742)" },
    { id: "v4", label: "Toyota Corolla (AAU-5214)" },
    { id: "v5", label: "Hyundai H-1 (AAU-6390)" },
    { id: "v6", label: "Mitsubishi L200 (AAU-7195)" },
  ];
  
  const drivers = [
    { id: "d1", label: "Abebe Kebede" },
    { id: "d2", label: "Bekele Tadesse" },
    { id: "d3", label: "Chala Tesfaye" },
    { id: "d4", label: "Daniel Girma" },
  ];
  
  const colleges = [
    { id: "c1", label: "College of Business and Economics" },
    { id: "c2", label: "College of Social Science, Arts and Humanities" },
    { id: "c3", label: "College of Technology and Built Environment" },
    { id: "c4", label: "College of Health Science" },
    { id: "c5", label: "College of Veterinary Medicine and Agriculture" },
    { id: "c6", label: "College of Natural and Computational Sciences" },
    { id: "c7", label: "College of Education and Language Studies" },
    { id: "c8", label: "School of Law" },
  ];
  
  const vehicleTypes = [
    { id: "SUV", label: "SUV" },
    { id: "Sedan", label: "Sedan" },
    { id: "Pickup", label: "Pickup" },
    { id: "Van", label: "Van" },
    { id: "Bus", label: "Bus" },
  ];
  
  const maintenanceStatuses = [
    { id: "pending", label: "Pending" },
    { id: "in-progress", label: "In Progress" },
    { id: "completed", label: "Completed" },
    { id: "cancelled", label: "Cancelled" },
  ];

  // Function to generate the report based on form values
  const onSubmit = (values: ReportFormValues) => {
    console.log("Generating report with parameters:", values);
    
    // In a real application, this would make an API call to fetch the report data
    // For now, we'll just simulate a loading state and then set some mock data
    toast.info("Generating report...");
    
    // Simulate API call
    setTimeout(() => {
      // Mock data for different report types
      let mockData;
      
      if (values.reportType === "fuel") {
        mockData = generateMockFuelData(values);
      } else if (values.reportType === "fleet") {
        mockData = generateMockFleetData(values);
      } else if (values.reportType === "maintenance") {
        mockData = generateMockMaintenanceData(values);
      } else if (values.reportType === "compliance") {
        mockData = generateMockComplianceData(values);
      }
      
      setReportData(mockData);
      setActiveReport(values.reportType);
      toast.success("Report generated successfully");
    }, 1500);
  };
  
  // Mock data generators for each report type
  const generateMockFuelData = (values: ReportFormValues) => {
    return {
      summaryMetrics: {
        totalFuelConsumed: 3250,
        averageFuelConsumption: 0.15,
        totalFuelCost: 325000
      },
      vehicleBreakdown: [
        { 
          id: "v1", 
          vehicle: "Toyota Land Cruiser (AAU-3201)",
          totalKm: 5200,
          totalFuel: 780,
          fuelRate: 0.15,
          totalCost: 78000
        },
        { 
          id: "v2", 
          vehicle: "Nissan Patrol (AAU-1450)",
          totalKm: 4800,
          totalFuel: 720,
          fuelRate: 0.15,
          totalCost: 72000
        },
        { 
          id: "v3", 
          vehicle: "Toyota Hilux (AAU-8742)",
          totalKm: 6300,
          totalFuel: 825,
          fuelRate: 0.13,
          totalCost: 82500
        }
      ],
      collegeBreakdown: [
        {
          id: "c1",
          name: "College of Business and Economics",
          totalKm: 8200,
          totalFuel: 1230,
          avgConsumption: 0.15,
          totalCost: 123000
        },
        {
          id: "c4",
          name: "College of Health Science",
          totalKm: 7500,
          totalFuel: 1125,
          avgConsumption: 0.15,
          totalCost: 112500
        }
      ],
      trendAnalysis: {
        consumptionTrend: { change: "increase", percentage: 5.2 },
        costTrend: { change: "increase", percentage: 7.8 }
      }
    };
  };
  
  const generateMockFleetData = (values: ReportFormValues) => {
    return {
      summaryMetrics: {
        totalTrips: 245,
        totalKm: 18500,
        avgKmPerVehicle: 3083,
        activeVehicles: 5,
        inactiveVehicles: 1
      },
      vehicleBreakdown: [
        {
          id: "v1",
          vehicle: "Toyota Land Cruiser (AAU-3201)",
          totalTrips: 52,
          totalKm: 5200,
          daysInService: 28,
          daysOutOfService: 2,
          reason: "Scheduled Maintenance"
        },
        {
          id: "v2",
          vehicle: "Nissan Patrol (AAU-1450)",
          totalTrips: 48,
          totalKm: 4800,
          daysInService: 30,
          daysOutOfService: 0
        }
      ],
      driverBreakdown: [
        {
          id: "d1",
          driver: "Abebe Kebede",
          totalTrips: 78,
          totalKm: 6240,
          vehiclesDriven: 3
        },
        {
          id: "d2",
          driver: "Bekele Tadesse",
          totalTrips: 65,
          totalKm: 5200,
          vehiclesDriven: 2
        }
      ],
      collegeBreakdown: [
        {
          id: "c1",
          name: "College of Business and Economics",
          totalTrips: 85,
          totalKm: 6800,
          avgTripsPerVehicle: 28
        }
      ]
    };
  };
  
  const generateMockMaintenanceData = (values: ReportFormValues) => {
    return {
      summaryMetrics: {
        totalRequests: 32,
        completedWorkOrders: 28,
        inHouseRepairs: 22,
        outsourceRepairs: 6,
        totalCosts: 85000,
        laborCosts: 25000,
        partsCosts: 35000,
        outsourceCosts: 25000,
        pendingRequests: 4
      },
      maintenanceRequests: [
        {
          id: "MR001",
          vehicleId: "v3",
          vehicle: "Toyota Hilux (AAU-8742)",
          requestDate: "2025-04-15",
          department: "College of Technology",
          issue: "Engine oil leak",
          status: "Completed"
        },
        {
          id: "MR002",
          vehicleId: "v1",
          vehicle: "Toyota Land Cruiser (AAU-3201)",
          requestDate: "2025-04-20",
          department: "College of Business",
          issue: "Brake pad replacement",
          status: "Completed"
        }
      ],
      workOrders: [
        {
          id: "WO001",
          vehicleId: "v3",
          vehicle: "Toyota Hilux (AAU-8742)",
          dateInitiated: "2025-04-16",
          dateCompleted: "2025-04-18",
          repairType: "In-house",
          description: "Replaced engine oil seal",
          laborCost: 2500,
          partsCost: 3500,
          totalCost: 6000,
          garage: "N/A"
        }
      ],
      partsUtilization: [
        {
          partName: "Engine Oil Seal",
          partNumber: "TO-5244",
          quantityUsed: 1,
          totalCost: 3500
        },
        {
          partName: "Brake Pad Set",
          partNumber: "BP-4425",
          quantityUsed: 2,
          totalCost: 4800
        }
      ]
    };
  };
  
  const generateMockComplianceData = (values: ReportFormValues) => {
    return {
      insurance: {
        summaryMetrics: {
          totalPremiums: 120000,
          activeInsurance: 5,
          expiredInsurance: 1,
          outstandingPremiums: 15000
        },
        vehicleBreakdown: [
          {
            vehicleId: "v1",
            vehicle: "Toyota Land Cruiser (AAU-3201)",
            policyNumber: "INS-123456",
            company: "Awash Insurance",
            startDate: "2025-01-01",
            expiryDate: "2025-12-31",
            premium: 25000,
            status: "Paid",
            lastPayment: "2025-01-05"
          },
          {
            vehicleId: "v6",
            vehicle: "Mitsubishi L200 (AAU-7195)",
            policyNumber: "INS-789012",
            company: "Nyala Insurance",
            startDate: "2024-12-01",
            expiryDate: "2025-11-30",
            premium: 15000,
            status: "Overdue",
            lastPayment: null
          }
        ],
        collegeBreakdown: [
          {
            name: "College of Business and Economics",
            activeInsurance: 2,
            expiredInsurance: 0,
            totalPaid: 45000,
            totalOutstanding: 0
          }
        ]
      },
      governmentFees: {
        summaryMetrics: {
          totalPaid: 35000,
          paidCurrentYear: 5,
          outstandingCurrentYear: 1,
          totalOutstanding: 5000
        },
        vehicleBreakdown: [
          {
            vehicleId: "v1",
            vehicle: "Toyota Land Cruiser (AAU-3201)",
            feeAmount: 7500,
            status: "Paid",
            paymentDate: "2025-02-15",
            dueDate: "2025-03-01"
          },
          {
            vehicleId: "v6",
            vehicle: "Mitsubishi L200 (AAU-7195)",
            feeAmount: 5000,
            status: "Pending",
            paymentDate: null,
            dueDate: "2025-03-01"
          }
        ],
        collegeBreakdown: [
          {
            name: "College of Business and Economics",
            paidFees: 2,
            outstandingFees: 0,
            totalPaid: 15000,
            totalOutstanding: 0
          }
        ]
      }
    };
  };

  // Function to export the report as PDF or CSV
  const exportReport = (format: 'pdf' | 'csv') => {
    toast.info(`Exporting report as ${format.toUpperCase()}...`);
    
    // In a real application, this would generate and download the report
    setTimeout(() => {
      toast.success(`Report exported as ${format.toUpperCase()}`);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="reportType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Report Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select report type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="fuel">Fuel Utilization Report</SelectItem>
                          <SelectItem value="fleet">Fleet Management Usage Report</SelectItem>
                          <SelectItem value="maintenance">Maintenance Management Report</SelectItem>
                          <SelectItem value="compliance">Financial & Compliance Status Report</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="periodType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Report Period</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select period type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="custom">Custom Date Range</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                
                {periodType === "custom" && (
                  <>
                    <FormField
                      control={form.control}
                      name="startDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Start Date</FormLabel>
                          <DatePicker
                            date={field.value}
                            onSelect={field.onChange}
                          />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="endDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>End Date</FormLabel>
                          <DatePicker
                            date={field.value}
                            onSelect={field.onChange}
                          />
                        </FormItem>
                      )}
                    />
                  </>
                )}
                
                <FormField
                  control={form.control}
                  name="aggregationLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Aggregation Level</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select aggregation level" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="vehicle">Per Vehicle</SelectItem>
                          <SelectItem value="driver">Per Driver</SelectItem>
                          <SelectItem value="college">Per College</SelectItem>
                          <SelectItem value="office">Per Office</SelectItem>
                          <SelectItem value="fleet">Overall Fleet</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="vehicleIds"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vehicles</FormLabel>
                      <FormControl>
                        <MultiSelect
                          options={vehicles}
                          selected={field.value}
                          onChange={field.onChange}
                          placeholder="Select vehicles"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="driverIds"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Drivers</FormLabel>
                      <FormControl>
                        <MultiSelect
                          options={drivers}
                          selected={field.value}
                          onChange={field.onChange}
                          placeholder="Select drivers"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="collegeNames"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Colleges/Offices</FormLabel>
                      <FormControl>
                        <MultiSelect
                          options={colleges}
                          selected={field.value}
                          onChange={field.onChange}
                          placeholder="Select colleges/offices"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                {reportType === "fuel" && (
                  <FormField
                    control={form.control}
                    name="vehicleTypes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Vehicle Types</FormLabel>
                        <FormControl>
                          <MultiSelect
                            options={vehicleTypes}
                            selected={field.value}
                            onChange={field.onChange}
                            placeholder="Select vehicle types"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                )}
                
                {(reportType === "maintenance" || reportType === "compliance") && (
                  <FormField
                    control={form.control}
                    name="maintenanceStatuses"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Maintenance Statuses</FormLabel>
                        <FormControl>
                          <MultiSelect
                            options={maintenanceStatuses}
                            selected={field.value}
                            onChange={field.onChange}
                            placeholder="Select statuses"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                )}
              </div>
              
              <div className="flex justify-end mt-4">
                <Button type="submit">Generate Report</Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {reportData && (
        <Card className="mt-8">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Report Results</h3>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => exportReport('pdf')}
                  className="flex items-center gap-1"
                >
                  <FileText className="h-4 w-4" />
                  Export as PDF
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => exportReport('csv')}
                  className="flex items-center gap-1"
                >
                  <Download className="h-4 w-4" />
                  Export as CSV
                </Button>
              </div>
            </div>
            
            {activeReport === "fuel" && <FuelUtilizationReport data={reportData} />}
            {activeReport === "fleet" && <FleetManagementReport data={reportData} />}
            {activeReport === "maintenance" && <MaintenanceReport data={reportData} />}
            {activeReport === "compliance" && <ComplianceReport data={reportData} />}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ReportGenerator;
