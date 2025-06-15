
import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import { FuelFull } from "@/types/fuel";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowDown, ArrowUp, Fuel } from "lucide-react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";

// Inline spinner component
const Spinner = () => (
  <svg className="animate-spin h-5 w-5 text-muted-foreground" viewBox="0 0 24 24" fill="none">
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
    />
  </svg>
);

type SortKey = keyof Pick<FuelFull, "amount" | "pricePerLiter" | "createdAt" | "updatedAt"> | "fuelType";

const HEADERS: { key: SortKey, label: string }[] = [
    { key: "fuelType", label: "Type" },
    { key: "pricePerLiter", label: "Price/Liter" },
    { key: "amount", label: "Amount (L)" },
    { key: "createdAt", label: "Created" },
    { key: "updatedAt", label: "Updated" }
];

// Helper for formatting dates
function formatDate(iso: string) {
    const d = new Date(iso);
    return d.toLocaleString();
}

export default function FuelList() {
    const { data, isLoading, isError } = useQuery({
        queryKey: ["fuels"],
        queryFn: apiClient.fuel.listFuels
    });

    const [sort, setSort] = useState<{ key: SortKey, asc: boolean }>({ key: "fuelType", asc: true });

    // Sorted fuels
    const fuels = useMemo(() => {
        if (!data) return [];
        const sorted = [...data];
        sorted.sort((a, b) => {
            let valA: any, valB: any;
            switch (sort.key) {
                case "fuelType":
                    valA = a.fuelType.name.toLowerCase();
                    valB = b.fuelType.name.toLowerCase();
                    break;
                case "pricePerLiter":
                    valA = a.pricePerLiter;
                    valB = b.pricePerLiter;
                    break;
                case "amount":
                    valA = a.amount;
                    valB = b.amount;
                    break;
                case "createdAt":
                    valA = a.createdAt;
                    valB = b.createdAt;
                    break;
                case "updatedAt":
                    valA = a.updatedAt;
                    valB = b.updatedAt;
                    break;
                default:
                    return 0;
            }
            if (valA < valB) return sort.asc ? -1 : 1;
            if (valA > valB) return sort.asc ? 1 : -1;
            return 0;
        });
        return sorted;
    }, [data, sort]);

    const handleSort = (key: SortKey) => {
        setSort(prev =>
            prev.key === key ? { key, asc: !prev.asc } : { key, asc: true }
        );
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center gap-2">
                    <Fuel className="h-5 w-5 text-primary" />
                    <CardTitle>Fuels</CardTitle>
                </div>
                <CardDescription>Overview of all fuel records</CardDescription>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <div className="w-full flex justify-center py-10"><Spinner /></div>
                ) : isError ? (
                    <div className="p-4 text-red-600">Failed to load fuels.</div>
                ) : (
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    {HEADERS.map(h => (
                                        <TableHead
                                            key={h.key}
                                            className="cursor-pointer select-none"
                                            onClick={() => handleSort(h.key)}
                                        >
                                            <span className="flex items-center">
                                                {h.label}
                                                {sort.key === h.key ? (
                                                    sort.asc ?
                                                        <ArrowUp className="ml-1 h-4 w-4 text-muted-foreground" /> :
                                                        <ArrowDown className="ml-1 h-4 w-4 text-muted-foreground" />
                                                ) : null}
                                            </span>
                                        </TableHead>
                                    ))}
                                    <TableHead>Created By</TableHead>
                                    <TableHead>Updated By</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {fuels.map(fuel => (
                                    <TableRow key={fuel.id}>
                                        <TableCell>{fuel.fuelType.name}</TableCell>
                                        <TableCell>{fuel.pricePerLiter.toFixed(2)}</TableCell>
                                        <TableCell>{fuel.amount.toLocaleString()}</TableCell>
                                        <TableCell>{formatDate(fuel.createdAt)}</TableCell>
                                        <TableCell>{formatDate(fuel.updatedAt)}</TableCell>
                                        <TableCell>
                                            {fuel.createdBy.firstName} {fuel.createdBy.lastName} <br />
                                            <span className="text-xs text-muted-foreground">{fuel.createdBy.email}</span>
                                        </TableCell>
                                        <TableCell>
                                            {fuel.updatedBy.firstName} {fuel.updatedBy.lastName} <br />
                                            <span className="text-xs text-muted-foreground">{fuel.updatedBy.email}</span>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        {fuels.length === 0 && (
                            <div className="text-center text-muted-foreground py-10">
                                No fuels found.
                            </div>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
