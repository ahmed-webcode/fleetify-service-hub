import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import { FuelRecordFullDto } from "@/types/fuel";
import FuelRecordsList from "./FuelRecordsList";
import { HasPermission } from "@/components/auth/HasPermission";
import { PlusCircle } from "lucide-react";
import FuelIssueDialog from "./FuelIssueDialog";

export default function FuelRecordsTab() {
    const [page, setPage] = useState(0);
    const pageSize = 10;

    // State for issue dialog
    const [issueDialogOpen, setIssueDialogOpen] = useState(false);

    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: ["fuelRecords", page, pageSize],
        queryFn: () =>
            apiClient.fuel.records.getAll({
                page,
                size: pageSize,
                sortBy: "issuedAt",
                direction: "DESC",
            }),
    });

    if (isLoading) {
        return <div>Loading fuel records...</div>;
    }
    if (isError) {
        return <div className="bg-red-50 border-l-4 border-red-500 p-4">Failed to load fuel records.</div>;
    }

    return (
        <div className="space-y-4">
            {/* Add Issue Fuel Button if user has permission */}
            <HasPermission permission="issue_fuel">
                <div className="flex justify-end mb-2">
                    <Button
                        className="gap-1.5"
                        onClick={() => setIssueDialogOpen(true)}
                    >
                        <PlusCircle className="h-4 w-4" />
                        <span>Issue Fuel</span>
                    </Button>
                </div>
            </HasPermission>

            {/* The list */}
            <FuelRecordsList
                records={data?.content ?? []}
                total={data?.totalElements ?? 0}
                page={page}
                pageSize={pageSize}
                pageCount={data?.totalPages ?? 1}
                onPageChange={setPage}
                refetch={refetch}
            />

            {/* The issue dialog */}
            <FuelIssueDialog
                open={issueDialogOpen}
                onOpenChange={setIssueDialogOpen}
                onSuccess={refetch}
            />
        </div>
    );
}
