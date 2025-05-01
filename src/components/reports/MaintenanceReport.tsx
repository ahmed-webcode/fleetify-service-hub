
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { MaintenanceCostChart } from "@/components/reports/charts/MaintenanceCostChart"
import { MaintenanceStatusChart } from "@/components/reports/charts/MaintenanceStatusChart"

interface MaintenanceReportProps {
  data: {
    summaryMetrics: {
      totalRequests: number
      completedWorkOrders: number
      inHouseRepairs: number
      outsourceRepairs: number
      totalCosts: number
      laborCosts: number
      partsCosts: number
      outsourceCosts: number
      pendingRequests: number
    }
    maintenanceRequests: Array<{
      id: string
      vehicleId: string
      vehicle: string
      requestDate: string
      department: string
      issue: string
      status: string
    }>
    workOrders: Array<{
      id: string
      vehicleId: string
      vehicle: string
      dateInitiated: string
      dateCompleted: string
      repairType: string
      description: string
      laborCost: number
      partsCost: number
      totalCost: number
      garage?: string
    }>
    partsUtilization: Array<{
      partName: string
      partNumber: string
      quantityUsed: number
      totalCost: number
    }>
  }
}

export function MaintenanceReport({ data }: MaintenanceReportProps) {
  const { summaryMetrics, maintenanceRequests, workOrders, partsUtilization } = data
  
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'in progress':
        return 'bg-blue-100 text-blue-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Maintenance Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summaryMetrics.totalRequests}</div>
            <p className="text-xs text-muted-foreground">
              {summaryMetrics.pendingRequests} pending
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Completed Work Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summaryMetrics.completedWorkOrders}</div>
            <div className="flex gap-2 text-xs text-muted-foreground">
              <span>{summaryMetrics.inHouseRepairs} in-house</span>
              <span>•</span>
              <span>{summaryMetrics.outsourceRepairs} outsourced</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Maintenance Costs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summaryMetrics.totalCosts.toLocaleString()} ETB</div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="requests">
        <TabsList>
          <TabsTrigger value="requests">Maintenance Requests</TabsTrigger>
          <TabsTrigger value="workorders">Work Orders</TabsTrigger>
          <TabsTrigger value="parts">Parts Utilization</TabsTrigger>
          <TabsTrigger value="charts">Charts</TabsTrigger>
        </TabsList>
        
        <TabsContent value="requests" className="space-y-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Request ID</TableHead>
                <TableHead>Vehicle</TableHead>
                <TableHead>Request Date</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Issue</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {maintenanceRequests.map((req) => (
                <TableRow key={req.id}>
                  <TableCell className="font-medium">{req.id}</TableCell>
                  <TableCell>{req.vehicle}</TableCell>
                  <TableCell>{req.requestDate}</TableCell>
                  <TableCell>{req.department}</TableCell>
                  <TableCell>{req.issue}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(req.status)} variant="outline">
                      {req.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>
        
        <TabsContent value="workorders" className="space-y-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Work Order ID</TableHead>
                <TableHead>Vehicle</TableHead>
                <TableHead>Date Initiated</TableHead>
                <TableHead>Date Completed</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Total Cost</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {workOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{order.vehicle}</TableCell>
                  <TableCell>{order.dateInitiated}</TableCell>
                  <TableCell>{order.dateCompleted}</TableCell>
                  <TableCell>{order.repairType}</TableCell>
                  <TableCell>{order.totalCost.toLocaleString()} ETB</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>
        
        <TabsContent value="parts" className="space-y-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Part Name</TableHead>
                <TableHead>Part Number</TableHead>
                <TableHead className="text-right">Quantity Used</TableHead>
                <TableHead className="text-right">Total Cost</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {partsUtilization.map((part, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{part.partName}</TableCell>
                  <TableCell>{part.partNumber}</TableCell>
                  <TableCell className="text-right">{part.quantityUsed}</TableCell>
                  <TableCell className="text-right">{part.totalCost.toLocaleString()} ETB</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>
        
        <TabsContent value="charts" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-md">Maintenance Cost Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <MaintenanceCostChart 
                  labor={summaryMetrics.laborCosts}
                  parts={summaryMetrics.partsCosts}
                  outsource={summaryMetrics.outsourceCosts}
                />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-md">Maintenance Request Status</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <MaintenanceStatusChart 
                  completed={summaryMetrics.completedWorkOrders}
                  pending={summaryMetrics.pendingRequests}
                  total={summaryMetrics.totalRequests}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
