
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FuelRecordFullDto } from "@/types/fuel";
import { Fuel } from "lucide-react";

interface RecentFuelsProps {
  records: FuelRecordFullDto[];
  loading: boolean;
}

export function RecentFuels({ records, loading }: RecentFuelsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Recent Fuel Records</CardTitle>
        <CardDescription>Latest 3 fuel issues or receipts</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {loading ? (
          <div className="text-muted-foreground">Loading...</div>
        ) : records.length === 0 ? (
          <div className="text-muted-foreground">No recent fuel operations</div>
        ) : (
          records.map((rec) => (
            <div key={rec.id} className="flex items-center gap-3 border-b last:border-b-0 pb-2">
              <Fuel size={18} className="text-teal-500" />
              <div>
                <div className="font-medium">
                  {(rec.vehicle && rec.vehicle.plateNumber) || "—"} — {rec.fuelType.name}
                </div>
                <div className="text-xs text-muted-foreground">
                  Issued: {rec.issuedAmount} L by {rec.issuedBy.firstName} {rec.issuedBy.lastName} on {new Date(rec.issuedAt).toLocaleString()}
                </div>
                {rec.receivedBy && rec.receivedAmount !== null && (
                  <div className="text-xs text-muted-foreground">
                    Received: {rec.receivedAmount} L by {rec.receivedBy.firstName} {rec.receivedBy.lastName} on {rec.receivedAt ? new Date(rec.receivedAt).toLocaleString() : "—"}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
