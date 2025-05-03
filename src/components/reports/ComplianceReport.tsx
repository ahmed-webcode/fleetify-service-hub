
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { InsuranceStatusChart } from "@/components/reports/charts/InsuranceStatusChart"
import { GovernmentFeesChart } from "@/components/reports/charts/GovernmentFeesChart"

interface ComplianceReportProps {
  data: {
    insurance: {
      summaryMetrics: {
        totalPremiums: number
        activeInsurance: number
        expiredInsurance: number
        outstandingPremiums: number
      }
      vehicleBreakdown: Array<{
        vehicleId: string
        vehicle: string
        policyNumber: string
        company: string
        startDate: string
        expiryDate: string
        premium: number
        status: string
        lastPayment: string | null
      }>
      collegeBreakdown: Array<{
        name: string
        activeInsurance: number
        expiredInsurance: number
        totalPaid: number
        totalOutstanding: number
      }>
    }
    governmentFees: {
      summaryMetrics: {
        totalPaid: number
        paidCurrentYear: number
        outstandingCurrentYear: number
        totalOutstanding: number
      }
      vehicleBreakdown: Array<{
        vehicleId: string
        vehicle: string
        feeAmount: number
        status: string
        paymentDate: string | null
        dueDate: string
      }>
      collegeBreakdown: Array<{
        name: string
        paidFees: number
        outstandingFees: number
        totalPaid: number
        totalOutstanding: number
      }>
    }
  }
}

export function ComplianceReport({ data }: ComplianceReportProps) {
  const { insurance, governmentFees } = data
  
  const getPaymentStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'overdue':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="insurance">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="insurance">Insurance</TabsTrigger>
          <TabsTrigger value="governmentfees">Government Fees</TabsTrigger>
        </TabsList>
        
        <TabsContent value="insurance" className="space-y-6 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Insurance Premiums Paid</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{insurance.summaryMetrics.totalPremiums.toLocaleString()} ETB</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Vehicles with Active Insurance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{insurance.summaryMetrics.activeInsurance}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Vehicles with Expired Insurance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{insurance.summaryMetrics.expiredInsurance}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Outstanding Premiums</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{insurance.summaryMetrics.outstandingPremiums.toLocaleString()} ETB</div>
              </CardContent>
            </Card>
          </div>
          
          <Tabs defaultValue="vehicles">
            <TabsList>
              <TabsTrigger value="vehicles">Per Vehicle</TabsTrigger>
              <TabsTrigger value="colleges">Per College/Office</TabsTrigger>
              <TabsTrigger value="chart">Chart</TabsTrigger>
            </TabsList>
            
            <TabsContent value="vehicles" className="space-y-4 mt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Vehicle</TableHead>
                    <TableHead>Policy Number</TableHead>
                    <TableHead>Insurance Company</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>Expiry Date</TableHead>
                    <TableHead>Premium</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Payment</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {insurance.vehicleBreakdown.map((item) => (
                    <TableRow key={item.vehicleId}>
                      <TableCell className="font-medium">{item.vehicle}</TableCell>
                      <TableCell>{item.policyNumber}</TableCell>
                      <TableCell>{item.company}</TableCell>
                      <TableCell>{item.startDate}</TableCell>
                      <TableCell>{item.expiryDate}</TableCell>
                      <TableCell>{item.premium.toLocaleString()} ETB</TableCell>
                      <TableCell>
                        <Badge className={getPaymentStatusColor(item.status)} variant="outline">
                          {item.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{item.lastPayment || "-"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
            
            <TabsContent value="colleges" className="space-y-4 mt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>College/Office</TableHead>
                    <TableHead className="text-right">Active Insurance</TableHead>
                    <TableHead className="text-right">Expired Insurance</TableHead>
                    <TableHead className="text-right">Total Paid</TableHead>
                    <TableHead className="text-right">Total Outstanding</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {insurance.collegeBreakdown.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell className="text-right">{item.activeInsurance}</TableCell>
                      <TableCell className="text-right">{item.expiredInsurance}</TableCell>
                      <TableCell className="text-right">{item.totalPaid.toLocaleString()} ETB</TableCell>
                      <TableCell className="text-right">{item.totalOutstanding.toLocaleString()} ETB</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
            
            <TabsContent value="chart" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-md">Insurance Status</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <InsuranceStatusChart 
                    active={insurance.summaryMetrics.activeInsurance}
                    expired={insurance.summaryMetrics.expiredInsurance}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </TabsContent>
        
        <TabsContent value="governmentfees" className="space-y-6 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Government Fees Paid</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{governmentFees.summaryMetrics.totalPaid.toLocaleString()} ETB</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Vehicles with Fees Paid</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{governmentFees.summaryMetrics.paidCurrentYear}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Vehicles with Outstanding Fees</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{governmentFees.summaryMetrics.outstandingCurrentYear}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Outstanding Fees</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{governmentFees.summaryMetrics.totalOutstanding.toLocaleString()} ETB</div>
              </CardContent>
            </Card>
          </div>
          
          <Tabs defaultValue="vehicles">
            <TabsList>
              <TabsTrigger value="vehicles">Per Vehicle</TabsTrigger>
              <TabsTrigger value="colleges">Per College/Office</TabsTrigger>
              <TabsTrigger value="chart">Chart</TabsTrigger>
            </TabsList>
            
            <TabsContent value="vehicles" className="space-y-4 mt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Vehicle</TableHead>
                    <TableHead className="text-right">Fee Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Payment Date</TableHead>
                    <TableHead>Due Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {governmentFees.vehicleBreakdown.map((item) => (
                    <TableRow key={item.vehicleId}>
                      <TableCell className="font-medium">{item.vehicle}</TableCell>
                      <TableCell className="text-right">{item.feeAmount.toLocaleString()} ETB</TableCell>
                      <TableCell>
                        <Badge className={getPaymentStatusColor(item.status)} variant="outline">
                          {item.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{item.paymentDate || "-"}</TableCell>
                      <TableCell>{item.dueDate}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
            
            <TabsContent value="colleges" className="space-y-4 mt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>College/Office</TableHead>
                    <TableHead className="text-right">Vehicles with Fees Paid</TableHead>
                    <TableHead className="text-right">Vehicles with Outstanding Fees</TableHead>
                    <TableHead className="text-right">Total Paid</TableHead>
                    <TableHead className="text-right">Total Outstanding</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {governmentFees.collegeBreakdown.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell className="text-right">{item.paidFees}</TableCell>
                      <TableCell className="text-right">{item.outstandingFees}</TableCell>
                      <TableCell className="text-right">{item.totalPaid.toLocaleString()} ETB</TableCell>
                      <TableCell className="text-right">{item.totalOutstanding.toLocaleString()} ETB</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
            
            <TabsContent value="chart" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-md">Government Fees Status</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <GovernmentFeesChart 
                    paid={governmentFees.summaryMetrics.paidCurrentYear}
                    outstanding={governmentFees.summaryMetrics.outstandingCurrentYear}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </TabsContent>
      </Tabs>
    </div>
  )
}
