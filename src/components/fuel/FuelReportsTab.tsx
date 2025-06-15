import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FileDown, FileSpreadsheet } from "lucide-react";
import { useState, useMemo } from "react";
import * as XLSX from "xlsx";
import { FuelRecordFullDto, RecordType } from "@/types/fuel";
import { toast } from "@/hooks/use-toast";
import { Combobox } from "@/components/ui/combobox";

export default function FuelReportsTab() {
  const [downloading, setDownloading] = useState(false);
  // Filter state
  const [fuelType, setFuelType] = useState<string | null>(null);
  const [recordType, setRecordType] = useState<string | null>(null);
  const [levelId, setLevelId] = useState<string | null>(null);

  // Fetch all fuel records (max 5000)
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

  // Fetch fuel types & levels for filters
  const { data: fuelTypesData } = useQuery<{ id: number; name: string }[]>({
    queryKey: ["fuelTypes"],
    // FIX: use getFuelTypes, not types.getAll
    queryFn: () => apiClient.fuel.getFuelTypes() as Promise<{ id: number; name: string }[]>,
  });

  const { data: levelsData } = useQuery({
    queryKey: ["levels"],
    queryFn: () => apiClient.levels.getAll(),
  });

  // Compute options for comboboxes, start with "All"
  const fuelTypeOptions = [{ value: "", label: "All fuel types" }]
    .concat(
      (fuelTypesData?.map((f: any) => ({
        value: String(f.id),
        label: f.name,
      })) || [])
    );
  const recordTypeOptions = [
    { value: "", label: "All record types" },
    { value: RecordType.QUOTA, label: "Quota" },
    { value: RecordType.REQUEST, label: "Request" },
    { value: RecordType.EXTERNAL, label: "External" },
  ];
  const levelOptions = [{ value: "", label: "All levels" }]
    .concat(
      levelsData?.map((lvl: any) => ({
        value: String(lvl.id),
        label: lvl.name,
      })) || []
    );

  // Helper: filter records
  const filteredRecords = useMemo(() => {
    if (!data?.content) return [];
    return data.content.filter((r: FuelRecordFullDto) => {
      const matchFuelType =
        !fuelType || fuelType === "" || String(r.fuelType?.id) === fuelType;
      const matchRecordType =
        !recordType || recordType === "" || r.recordType === recordType;
      const matchLevel =
        !levelId || levelId === "" || (r.level && String(r.level.id) === levelId);
      return matchFuelType && matchRecordType && matchLevel;
    });
  }, [data, fuelType, recordType, levelId]);

  // Helper: format rows for Excel
  function formatRows(records: FuelRecordFullDto[]): any[] {
    return records.map(r => ({
      "Record Type": r.recordType,
      "Fuel Type": r.fuelType?.name || "",
      "Vehicle Plate Number": r.vehicle?.plateNumber || "",
      "Level Name": r.level?.name || "",
      "Issued Amount (L)": r.issuedAmount,
      "Received Amount (L)": r.receivedAmount ?? "",
      "Issued At": r.issuedAt ? new Date(r.issuedAt).toLocaleString() : "",
      "Received At": r.receivedAt ? new Date(r.receivedAt).toLocaleString() : "",
      "Issued By": r.issuedBy ? `${r.issuedBy.firstName} ${r.issuedBy.lastName}` : "",
      "Received By": r.receivedBy ? `${r.receivedBy.firstName} ${r.receivedBy.lastName}` : "",
    }));
  }

  function handleDownloadExcel() {
    if (!filteredRecords.length) {
      toast({
        title: "No records to export",
        description: "There is no data to export with the selected filters.",
      });
      return;
    }
    setDownloading(true);
    const rows = formatRows(filteredRecords);
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "FuelRecords");
    XLSX.writeFile(wb, "fuel-records-report.xlsx");
    setDownloading(false);
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-row items-center justify-between flex-wrap gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <FileSpreadsheet className="h-5 w-5 text-muted-foreground" />
              Fuel Reports
            </CardTitle>
            <CardDescription>
              Export Excel report for fuel records, filtered as needed (max 5000 rows).
            </CardDescription>
          </div>
          <Button onClick={() => refetch()} variant="outline" size="sm" disabled={isLoading}>
            Refresh
          </Button>
        </div>
        {/* Filters */}
        <div className="flex flex-wrap gap-3 mt-6">
          <div className="w-[180px]">
            <Combobox
              options={fuelTypeOptions}
              value={fuelType ?? ""}
              onChange={setFuelType}
              placeholder="Fuel type"
              isLoading={false}
              className="w-full"
            />
          </div>
          <div className="w-[180px]">
            <Combobox
              options={recordTypeOptions}
              value={recordType ?? ""}
              onChange={setRecordType}
              placeholder="Record type"
              isLoading={false}
              className="w-full"
            />
          </div>
          <div className="w-[180px]">
            <Combobox
              options={levelOptions}
              value={levelId ?? ""}
              onChange={setLevelId}
              placeholder="Level"
              isLoading={false}
              className="w-full"
            />
          </div>
          <Button
            onClick={handleDownloadExcel}
            disabled={isLoading || downloading}
            className="gap-2"
          >
            <FileDown className="h-4 w-4" />
            Download Excel
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isError && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 text-red-700 mb-4">
            Error loading fuel records. Try refreshing.
          </div>
        )}
        {isLoading && (
          <div className="text-muted-foreground">Fetching fuel records…</div>
        )}
        {!isLoading && (!data?.content || data.content.length === 0) && (
          <span className="text-muted-foreground">No fuel records to download.</span>
        )}
        {!isLoading && filteredRecords.length > 0 && (
          <div className="overflow-x-auto max-h-[300px] border rounded mt-4">
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
                {filteredRecords.slice(0, 10).map(r => (
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
              Showing first 10 of {filteredRecords.length} records for preview.
            </div>
          </div>
        )}
        {!isLoading && filteredRecords.length === 0 && data?.content?.length > 0 && (
          <div className="pt-4 text-muted-foreground">No records match these filters.</div>
        )}
      </CardContent>
    </Card>
  );
}
