
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import { FuelRecordFullDto } from "@/types/fuel";
import FuelRecordsList from "./FuelRecordsList";

export default function FuelRecordsTab() {
    const [page, setPage] = useState(0);
    const pageSize = 10;

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
        <FuelRecordsList
            records={data?.content ?? []}
            total={data?.totalElements ?? 0}
            page={page}
            pageSize={pageSize}
            pageCount={data?.totalPages ?? 1}
            onPageChange={setPage}
            refetch={refetch}
        />
    );
}
