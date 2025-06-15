import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FileDown, FileSpreadsheet } from "lucide-react";
import { useState } from "react";
import * as XLSX from "xlsx";
import { FuelRecordFullDto } from "@/types/fuel";

export default function FuelReportsTab() {
  const [downloading, setDownloading] = useState(false);

  // Fetch all fuel records (let's use a high pageSize to get all),
  // or in a real scenario, would do paging/download per filter.
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["fuelRecords-report"],
    queryFn: () =>
      apiClient.fuel.records.getAll({
        page: 0,
        size: 5000,
        sortBy: "issuedAt",
        direction: "DESC",
      }),
  });

  // Helper: format rows for Excel
  function formatRows(records: FuelRecordFullDto[]): any[] {
    // Flatten the record fields as much as makes sense for Excel readability
    return records.map(r => ({
      "Record Type": r.recordType,
      "Fuel Type": r.fuelType?.name || "",
      "Vehicle Plate Number": r.vehicle?.plateNumber || "",
      "Level Name": r.level?.name || "",
      "Requested By": r.fuelRequest?.id ? "" : (r.issuedBy?.firstName + " " + r.issuedBy?.lastName),
      "Issued Amount (L)": r.issuedAmount,
      "Received Amount (L)": r.receivedAmount !== null && r.receivedAmount !== undefined ? r.receivedAmount : "",
      "Issued At": r.issuedAt ? new Date(r.issuedAt).toLocaleString() : "",
      "Received At": r.receivedAt ? new Date(r.receivedAt).toLocaleString() : "",
      "Issued By": r.issuedBy ? `${r.issuedBy.firstName} ${r.issuedBy.lastName}` : "",
      "Received By": r.receivedBy ? `${r.receivedBy.firstName} ${r.receivedBy.lastName}` : "",
    }));
  }

  function handleDownloadExcel() {
    if (!data || !data.content) return;
    setDownloading(true);
    // Data preparation
    const rows = formatRows(data.content);
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "FuelRecords");
    // Download
    XLSX.writeFile(wb, "fuel-records-report.xlsx");
    setDownloading(false);
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <FileSpreadsheet className="h-5 w-5 text-muted-foreground" />
              Fuel Reports
            </CardTitle>
            <CardDescription>
              Download an Excel report of all fuel issue records (max 5000 rows).
            </CardDescription>
          </div>
          <Button onClick={() => refetch()} variant="outline" size="sm" disabled={isLoading}>
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isError && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 text-red-700 mb-4">
            Error loading fuel records. Try refreshing.
          </div>
        )}
        <div className="flex items-center gap-4 pb-6">
          <Button
            onClick={handleDownloadExcel}
            disabled={isLoading || !data?.content?.length || downloading}
            className="gap-2"
          >
            <FileDown className="h-4 w-4" />
            Download Excel
          </Button>
          {isLoading && <span className="text-muted-foreground">Fetching fuel records…</span>}
          {!isLoading && data?.content?.length === 0 && (
            <span className="text-muted-foreground">No fuel records to download.</span>
          )}
        </div>
        {!isLoading && data?.content?.length > 0 && (
          <div className="overflow-x-auto max-h-[300px] border rounded">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-muted/50">
                  <th className="px-2 py-2 font-semibold text-left">Record Type</th>
                  <th className="px-2 py-2 font-semibold text-left">Fuel Type</th>
                  <th className="px-2 py-2 font-semibold text-left">Vehicle</th>
                  <th className="px-2 py-2 font-semibold text-left">Level</th>
                  <th className="px-2 py-2 font-semibold text-left">Issued Amt (L)</th>
                  <th className="px-2 py-2 font-semibold text-left">Received Amt (L)</th>
                  <th className="px-2 py-2 font-semibold text-left">Issued At</th>
                  <th className="px-2 py-2 font-semibold text-left">Received At</th>
                  <th className="px-2 py-2 font-semibold text-left">Issued By</th>
                  <th className="px-2 py-2 font-semibold text-left">Received By</th>
                </tr>
              </thead>
              <tbody>
                {data.content.slice(0, 10).map(r => (
                  <tr key={r.id} className="border-b last:border-0">
                    <td className="px-2 py-2">{r.recordType}</td>
                    <td className="px-2 py-2">{r.fuelType?.name || ""}</td>
                    <td className="px-2 py-2">{r.vehicle?.plateNumber || ""}</td>
                    <td className="px-2 py-2">{r.level?.name || ""}</td>
                    <td className="px-2 py-2">{r.issuedAmount}</td>
                    <td className="px-2 py-2">{r.receivedAmount ?? ""}</td>
                    <td className="px-2 py-2">{r.issuedAt ? new Date(r.issuedAt).toLocaleString() : ""}</td>
                    <td className="px-2 py-2">{r.receivedAt ? new Date(r.receivedAt).toLocaleString() : ""}</td>
                    <td className="px-2 py-2">{r.issuedBy ? `${r.issuedBy.firstName} ${r.issuedBy.lastName}` : ""}</td>
                    <td className="px-2 py-2">{r.receivedBy ? `${r.receivedBy.firstName} ${r.receivedBy.lastName}` : ""}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="pt-1 text-xs text-right text-muted-foreground px-2">
              Showing first 10 of {data.content.length} records for preview.
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
