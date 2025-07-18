import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import { MaintenanceRecordsList } from "@/components/maintenance/MaintenanceRecordsList";
import { MaintenanceRecordDialog } from "@/components/maintenance/MaintenanceRecordDialog";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HasPermission } from "@/components/auth/HasPermission";
import { Plus } from "lucide-react";

export function MaintenanceRecordsTab() {
    const [recordDialogOpen, setRecordDialogOpen] = useState(false);
    const [currentRecordsPage, setCurrentRecordsPage] = useState(0);
    const recordsPerPage = 10;

    const {
        data: maintenanceRecordsData,
        isLoading: isLoadingRecords,
        isError: isErrorRecords,
        refetch: refetchRecords,
    } = useQuery({
        queryKey: ["maintenanceRecords", currentRecordsPage, recordsPerPage],
        queryFn: async () => {
            return apiClient.maintenance.records.getAll({
                page: currentRecordsPage,
                size: recordsPerPage,
                sortBy: "createdAt",
                direction: "DESC",
            });
        },
    });
    const filteredRecords = maintenanceRecordsData?.content || [];

    return (
        <>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-3">
                    <div>
                        <CardTitle>Maintenance Records</CardTitle>
                        <CardDescription>
                            All completed maintenance work and history.
                        </CardDescription>
                    </div>
                    <HasPermission permission="manage_maintenance" fallback={null}>
                        <Button className="gap-1.5" onClick={() => setRecordDialogOpen(true)}>
                            <Plus className="h-4 w-4" />
                            <span>Add Record</span>
                        </Button>
                    </HasPermission>
                </CardHeader>
                <CardContent>
                    {isLoadingRecords ? (
                        <div className="flex justify-center p-8">
                            <p>Loading maintenance records...</p>
                        </div>
                    ) : isErrorRecords ? (
                        <div className="bg-red-50 border-l-4 border-red-500 p-4">
                            <p className="text-red-700">Error loading records. Please try again.</p>
                        </div>
                    ) : (
                        <MaintenanceRecordsList
                            records={filteredRecords}
                            onRefresh={refetchRecords}
                        />
                    )}
                </CardContent>
                <CardFooter className="border-t py-3 px-6">
                    <p className="text-xs text-muted-foreground">
                        {maintenanceRecordsData &&
                            `Showing ${filteredRecords.length} of ${maintenanceRecordsData.totalElements} records`}
                    </p>
                </CardFooter>
            </Card>
            <MaintenanceRecordDialog
                open={recordDialogOpen}
                onOpenChange={setRecordDialogOpen}
                onSuccess={() => {
                    setRecordDialogOpen(false);
                    refetchRecords();
                }}
            />
        </>
    );
}
