
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FleetUsageChart } from "@/components/reports/charts/FleetUsageChart"
import { VehicleStatusChart } from "@/components/reports/charts/VehicleStatusChart"

interface FleetManagementReportProps {
  data: {
    summaryMetrics: {
      totalTrips: number
      totalKm: number
      avgKmPerVehicle: number
      activeVehicles: number
      inactiveVehicles: number
    }
    vehicleBreakdown: Array<{
      id: string
      vehicle: string
      totalTrips: number
      totalKm: number
      daysInService: number
      daysOutOfService: number
      reason?: string
    }>
    driverBreakdown: Array<{
      id: string
      driver: string
      totalTrips: number
      totalKm: number
      vehiclesDriven: number
    }>
    collegeBreakdown: Array<{
      id: string
      name: string
      totalTrips: number
      totalKm: number
      avgTripsPerVehicle: number
    }>
  }
}

export function FleetManagementReport({ data }: FleetManagementReportProps) {
  const { summaryMetrics, vehicleBreakdown, driverBreakdown, collegeBreakdown } = data

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Trips</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summaryMetrics.totalTrips.toLocaleString()}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Distance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summaryMetrics.totalKm.toLocaleString()} km</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Avg. per Vehicle</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summaryMetrics.avgKmPerVehicle.toLocaleString()} km</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Vehicles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summaryMetrics.activeVehicles}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Inactive Vehicles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summaryMetrics.inactiveVehicles}</div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="vehicles">
        <TabsList>
          <TabsTrigger value="vehicles">Per Vehicle</TabsTrigger>
          <TabsTrigger value="drivers">Per Driver</TabsTrigger>
          <TabsTrigger value="colleges">Per College/Office</TabsTrigger>
          <TabsTrigger value="charts">Charts</TabsTrigger>
        </TabsList>
        
        <TabsContent value="vehicles" className="space-y-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vehicle</TableHead>
                <TableHead className="text-right">Total Trips</TableHead>
                <TableHead className="text-right">Kilometers Driven</TableHead>
                <TableHead className="text-right">Days in Service</TableHead>
                <TableHead className="text-right">Days Out of Service</TableHead>
                <TableHead>Reason</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vehicleBreakdown.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.vehicle}</TableCell>
                  <TableCell className="text-right">{item.totalTrips}</TableCell>
                  <TableCell className="text-right">{item.totalKm.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{item.daysInService}</TableCell>
                  <TableCell className="text-right">{item.daysOutOfService}</TableCell>
                  <TableCell>{item.reason || "-"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>
        
        <TabsContent value="drivers" className="space-y-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Driver</TableHead>
                <TableHead className="text-right">Total Trips</TableHead>
                <TableHead className="text-right">Kilometers Driven</TableHead>
                <TableHead className="text-right">Vehicles Driven</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {driverBreakdown.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.driver}</TableCell>
                  <TableCell className="text-right">{item.totalTrips}</TableCell>
                  <TableCell className="text-right">{item.totalKm.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{item.vehiclesDriven}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>
        
        <TabsContent value="colleges" className="space-y-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>College/Office</TableHead>
                <TableHead className="text-right">Total Trips</TableHead>
                <TableHead className="text-right">Kilometers Driven</TableHead>
                <TableHead className="text-right">Avg. Trips per Vehicle</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {collegeBreakdown.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell className="text-right">{item.totalTrips}</TableCell>
                  <TableCell className="text-right">{item.totalKm.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{item.avgTripsPerVehicle}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>
        
        <TabsContent value="charts" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-md">Fleet Usage by Vehicle</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <FleetUsageChart data={vehicleBreakdown} />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-md">Vehicle Status</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <VehicleStatusChart 
                  active={summaryMetrics.activeVehicles} 
                  inactive={summaryMetrics.inactiveVehicles} 
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
