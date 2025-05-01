
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FuelChart } from "@/components/reports/charts/FuelChart"
import { FuelTrendChart } from "@/components/reports/charts/FuelTrendChart"

interface FuelUtilizationReportProps {
  data: {
    summaryMetrics: {
      totalFuelConsumed: number
      averageFuelConsumption: number
      totalFuelCost: number
    }
    vehicleBreakdown: Array<{
      id: string
      vehicle: string
      totalKm: number
      totalFuel: number
      fuelRate: number
      totalCost: number
    }>
    collegeBreakdown: Array<{
      id: string
      name: string
      totalKm: number
      totalFuel: number
      avgConsumption: number
      totalCost: number
    }>
    trendAnalysis?: {
      consumptionTrend: { change: string; percentage: number }
      costTrend: { change: string; percentage: number }
    }
  }
}

export function FuelUtilizationReport({ data }: FuelUtilizationReportProps) {
  const { summaryMetrics, vehicleBreakdown, collegeBreakdown, trendAnalysis } = data

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Fuel Consumed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summaryMetrics.totalFuelConsumed.toLocaleString()} L</div>
            {trendAnalysis && (
              <p className={`text-xs ${trendAnalysis.consumptionTrend.change === 'increase' ? 'text-red-500' : 'text-green-500'}`}>
                {trendAnalysis.consumptionTrend.change === 'increase' ? '↑' : '↓'} {trendAnalysis.consumptionTrend.percentage}% from previous period
              </p>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Average Fuel Consumption</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summaryMetrics.averageFuelConsumption.toFixed(2)} L/km</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Fuel Cost</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summaryMetrics.totalFuelCost.toLocaleString()} ETB</div>
            {trendAnalysis && (
              <p className={`text-xs ${trendAnalysis.costTrend.change === 'increase' ? 'text-red-500' : 'text-green-500'}`}>
                {trendAnalysis.costTrend.change === 'increase' ? '↑' : '↓'} {trendAnalysis.costTrend.percentage}% from previous period
              </p>
            )}
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="vehicles">
        <TabsList>
          <TabsTrigger value="vehicles">Per Vehicle</TabsTrigger>
          <TabsTrigger value="colleges">Per College/Office</TabsTrigger>
          <TabsTrigger value="charts">Charts</TabsTrigger>
        </TabsList>
        
        <TabsContent value="vehicles" className="space-y-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vehicle</TableHead>
                <TableHead className="text-right">Kilometers Driven</TableHead>
                <TableHead className="text-right">Fuel Consumed (L)</TableHead>
                <TableHead className="text-right">Rate (L/km)</TableHead>
                <TableHead className="text-right">Total Cost (ETB)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vehicleBreakdown.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.vehicle}</TableCell>
                  <TableCell className="text-right">{item.totalKm.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{item.totalFuel.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{item.fuelRate.toFixed(2)}</TableCell>
                  <TableCell className="text-right">{item.totalCost.toLocaleString()}</TableCell>
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
                <TableHead className="text-right">Kilometers Driven</TableHead>
                <TableHead className="text-right">Fuel Consumed (L)</TableHead>
                <TableHead className="text-right">Avg. Consumption (L/km)</TableHead>
                <TableHead className="text-right">Total Cost (ETB)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {collegeBreakdown.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell className="text-right">{item.totalKm.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{item.totalFuel.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{item.avgConsumption.toFixed(2)}</TableCell>
                  <TableCell className="text-right">{item.totalCost.toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>
        
        <TabsContent value="charts" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-md">Fuel Consumption by Vehicle</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <FuelChart data={vehicleBreakdown} />
              </CardContent>
            </Card>
            
            {trendAnalysis && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-md">Fuel Consumption Trend</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <FuelTrendChart />
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
