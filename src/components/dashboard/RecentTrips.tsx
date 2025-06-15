
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { TripRecordFullDto } from "@/types/trip";
import { Users, Car } from "lucide-react";

interface RecentTripsProps {
  records: TripRecordFullDto[];
  loading: boolean;
}

export function RecentTrips({ records, loading }: RecentTripsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Recent Trips</CardTitle>
        <CardDescription>Latest 3 assigned trips</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {loading ? (
          <div className="text-muted-foreground">Loading...</div>
        ) : records.length === 0 ? (
          <div className="text-muted-foreground">No recent trips recorded</div>
        ) : (
          records.map((rec) => (
            <div key={rec.id} className="flex items-center gap-3 border-b last:border-b-0 pb-2">
              <Car size={18} className="text-blue-500" />
              <div>
                <div className="font-medium">
                  {rec.vehicle?.plateNumber ?? "—"}
                  <span className="ml-2 text-sm text-muted-foreground">({rec.tripRequest?.purpose ?? "trip"})</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  Driver: {rec.driver.firstName} {rec.driver.lastName}
                  <span className="ml-2">Assigned: {new Date(rec.assignedAt).toLocaleString()}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
