import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { apiClient } from "@/lib/apiClient";
import { TripRequestDto, TripRecordFullDto } from "@/types/trip";
import { RequestStatus } from "@/types/common";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePicker } from "@/components/reports/DatePicker";
import { toast } from "sonner";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { Loader2, FileSpreadsheet } from "lucide-react";

// Simple Zod schema for both filters
const filterSchema = z.object({
  reportType: z.enum(["requests", "records"]),
  status: z.string().default("any"), // use "any" as default value
  requestedBy: z.string().optional(),
  assignedBy: z.string().optional(),
  from: z.date().optional(),
  to: z.date().optional(),
});

type FilterValues = z.infer<typeof filterSchema>;

export function TripReportsExporter() {
  const [loading, setLoading] = useState(false);

  const form = useForm<FilterValues>({
    resolver: zodResolver(filterSchema),
    defaultValues: {
      reportType: "requests",
      status: "any", // default to "any" instead of ""
      requestedBy: "",
      assignedBy: "",
      from: undefined,
      to: undefined,
    },
  });

  // Map status keys for drop-down
  const statusOptions = [
    { label: "Pending", value: "PENDING" },
    { label: "Approved", value: "APPROVED" },
    { label: "Rejected", value: "REJECTED" },
  ];

  async function fetchRequests(filters: FilterValues): Promise<TripRequestDto[]> {
    const params: Record<string, any> = {
      size: 1000,
      ...(filters.status && filters.status !== "any" ? { status: filters.status } : {}),
    };

    const resp = await apiClient.trips.requests.getAll(params);
    let data = resp.content as TripRequestDto[];

    // Filter client-side for optional filters and date
    if (filters.requestedBy) {
      data = data.filter(req =>
        req.requestedBy.toLowerCase().includes(filters.requestedBy!.toLowerCase())
      );
    }
    if (filters.from) {
      data = data.filter(req => new Date(req.requestedAt) >= filters.from!);
    }
    if (filters.to) {
      data = data.filter(req => new Date(req.requestedAt) <= filters.to!);
    }
    return data;
  }
  async function fetchRecords(filters: FilterValues): Promise<TripRecordFullDto[]> {
    const params: Record<string, any> = {
      size: 1000,
    };

    const resp = await apiClient.tripRecords.getAll(params);
    let data = resp.content as TripRecordFullDto[];
    if (filters.assignedBy) {
      data = data.filter(rec =>
        `${rec.assignedBy.firstName} ${rec.assignedBy.lastName}`.toLowerCase().includes(filters.assignedBy!.toLowerCase())
      );
    }
    if (filters.from) {
      data = data.filter(rec => new Date(rec.assignedAt) >= filters.from!);
    }
    if (filters.to) {
      data = data.filter(rec => new Date(rec.assignedAt) <= filters.to!);
    }
    return data;
  }

  const handleExport = async (values: FilterValues) => {
    setLoading(true);
    try {
      if (values.reportType === "requests") {
        const requests = await fetchRequests(values);
        if (!requests.length) {
          toast.warning("No trip requests found for the selected filters.");
          setLoading(false);
          return;
        }
        // Prepare data for Excel
        const ws_data = [
          [
            "ID", "Purpose", "Status", "Passenger Count", "Requested By", "Requested At", "Start", "End", "Is Round Trip",
          ],
          ...requests.map(req => [
            req.id,
            req.purpose,
            req.status,
            req.passengerCount,
            req.requestedBy,
            req.requestedAt,
            req.startLocation + (req.startTime ? ` (${req.startTime})` : ""),
            req.endLocation + (req.endTime ? ` (${req.endTime})` : ""),
            req.isRoundTrip ? "Yes" : "No",
          ]),
        ];
        const ws = XLSX.utils.aoa_to_sheet(ws_data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "TripRequests");
        const buf = XLSX.write(wb, { bookType: "xlsx", type: "array" });
        saveAs(new Blob([buf], { type: "application/octet-stream" }), "TripRequests.xlsx");
        toast.success(`Exported ${requests.length} trip requests.`);
      } else {
        const records = await fetchRecords(values);
        if (!records.length) {
          toast.warning("No trip records found for the selected filters.");
          setLoading(false);
          return;
        }
        const ws_data = [
          [
            "Record ID", "Purpose", "Level", "Vehicle Plate", "Driver", "Assigned By", "Assigned At",
          ],
          ...records.map(rec => [
            rec.id,
            rec.tripRequest?.purpose,
            rec.level?.name,
            rec.vehicle?.plateNumber,
            rec.driver ? rec.driver.firstName + " " + rec.driver.lastName : "",
            rec.assignedBy ? rec.assignedBy.firstName + " " + rec.assignedBy.lastName : "",
            rec.assignedAt,
          ]),
        ];
        const ws = XLSX.utils.aoa_to_sheet(ws_data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "TripRecords");
        const buf = XLSX.write(wb, { bookType: "xlsx", type: "array" });
        saveAs(new Blob([buf], { type: "application/octet-stream" }), "TripRecords.xlsx");
        toast.success(`Exported ${records.length} trip records.`);
      }
    } catch (e: any) {
      toast.error("Error generating report: " + (e.message || "Unknown error"));
    }
    setLoading(false);
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <Form {...form}>
          <form
            className="space-y-4"
            onSubmit={form.handleSubmit(handleExport)}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                        <SelectItem value="requests">Trip Requests</SelectItem>
                        <SelectItem value="records">Trip Records</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="status"
                render={({ field }) =>
                  form.watch("reportType") === "requests" ? (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Any" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {/* Fix: use value="any" for "Any" option */}
                          <SelectItem value="any">Any</SelectItem>
                          {statusOptions.map(s => (
                            <SelectItem key={s.value} value={s.value}>
                              {s.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  ) : null
                }
              />
              <FormField
                control={form.control}
                name="requestedBy"
                render={({ field }) =>
                  form.watch("reportType") === "requests" ? (
                    <FormItem>
                      <FormLabel>Requested By</FormLabel>
                      <FormControl>
                        <Input placeholder="Name/email" {...field} />
                      </FormControl>
                    </FormItem>
                  ) : null
                }
              />
              <FormField
                control={form.control}
                name="assignedBy"
                render={({ field }) =>
                  form.watch("reportType") === "records" ? (
                    <FormItem>
                      <FormLabel>Assigned By</FormLabel>
                      <FormControl>
                        <Input placeholder="Name/email" {...field} />
                      </FormControl>
                    </FormItem>
                  ) : null
                }
              />
              <FormField
                control={form.control}
                name="from"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      From {form.watch("reportType") === "requests" ? "Requested At" : "Assigned At"}
                    </FormLabel>
                    <FormControl>
                      <DatePicker
                        date={field.value}
                        onSelect={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="to"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      To {form.watch("reportType") === "requests" ? "Requested At" : "Assigned At"}
                    </FormLabel>
                    <FormControl>
                      <DatePicker
                        date={field.value}
                        onSelect={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <div className="pt-4 flex justify-end">
              <Button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileSpreadsheet className="h-4 w-4" />}
                Export as Excel
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

export default TripReportsExporter;
