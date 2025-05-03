import React, { useState } from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InsurancePoliciesList } from "@/components/insurance/InsurancePoliciesList";
import { InsuranceClaimsList } from "@/components/insurance/InsuranceClaimsList";
import { Button } from "@/components/ui/button";
import { Plus, Download } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AddInsurancePolicyForm } from "@/components/insurance/AddInsurancePolicyForm";
import { ReportInsuranceClaimForm } from "@/components/insurance/ReportInsuranceClaimForm";
import { InsuranceStatusChart } from "@/components/reports/charts/InsuranceStatusChart";
import { toast } from "sonner";

const mockInsurancePolicies = [
  {
    id: "ip1",
    vehicleId: "v1",
    vehicleName: "Toyota Land Cruiser",
    licensePlate: "AAU-3201",
    policyNumber: "INS-1234-5678",
    insuranceCompany: "Awash Insurance",
    startDate: "2024-01-15",
    expiryDate: "2025-01-14",
    coverageType: "Comprehensive",
    premiumAmount: 35000,
    paymentStatus: "paid",
    lastPaymentDate: "2024-01-10",
  },
  {
    id: "ip2",
    vehicleId: "v2",
    vehicleName: "Nissan Patrol",
    licensePlate: "AAU-1450",
    policyNumber: "INS-2345-6789",
    insuranceCompany: "Nyala Insurance",
    startDate: "2023-11-20",
    expiryDate: "2024-11-19",
    coverageType: "Third-Party",
    premiumAmount: 22000,
    paymentStatus: "paid",
    lastPaymentDate: "2023-11-18",
  },
  {
    id: "ip3",
    vehicleId: "v3",
    vehicleName: "Toyota Hilux",
    licensePlate: "AAU-8742",
    policyNumber: "INS-3456-7890",
    insuranceCompany: "Awash Insurance",
    startDate: "2023-09-05",
    expiryDate: "2024-09-04",
    coverageType: "Comprehensive",
    premiumAmount: 28000,
    paymentStatus: "paid",
    lastPaymentDate: "2023-09-01",
  },
  {
    id: "ip4",
    vehicleId: "v4",
    vehicleName: "Toyota Corolla",
    licensePlate: "AAU-5214",
    policyNumber: "INS-4567-8901",
    insuranceCompany: "Ethio Insurance",
    startDate: "2023-12-10",
    expiryDate: "2024-12-09",
    coverageType: "Third-Party",
    premiumAmount: 15000,
    paymentStatus: "paid",
    lastPaymentDate: "2023-12-05",
  },
  {
    id: "ip5",
    vehicleId: "v5",
    vehicleName: "Hyundai H-1",
    licensePlate: "AAU-6390",
    policyNumber: "INS-5678-9012",
    insuranceCompany: "Nyala Insurance",
    startDate: "2024-03-22",
    expiryDate: "2025-03-21",
    coverageType: "Comprehensive",
    premiumAmount: 32000,
    paymentStatus: "pending",
    lastPaymentDate: null,
  },
];

const mockInsuranceClaims = [
  {
    id: "c1",
    vehicleId: "v1",
    vehicleName: "Toyota Land Cruiser",
    licensePlate: "AAU-3201",
    policyNumber: "INS-1234-5678",
    claimDate: "2024-04-05",
    incidentDate: "2024-04-03",
    description: "Minor accident involving front bumper damage",
    claimAmount: 12000,
    status: "Approved",
    approvedAmount: 10800,
    documents: ["accident_report.pdf", "damage_photos.jpg"],
  },
  {
    id: "c2",
    vehicleId: "v3",
    vehicleName: "Toyota Hilux",
    licensePlate: "AAU-8742",
    policyNumber: "INS-3456-7890",
    claimDate: "2024-03-15",
    incidentDate: "2024-03-12",
    description: "Side mirror damage and scratches on driver's side",
    claimAmount: 8500,
    status: "Pending",
    approvedAmount: null,
    documents: ["incident_report.pdf", "damage_assessment.pdf"],
  },
  {
    id: "c3",
    vehicleId: "v4",
    vehicleName: "Toyota Corolla",
    licensePlate: "AAU-5214",
    policyNumber: "INS-4567-8901",
    claimDate: "2024-02-28",
    incidentDate: "2024-02-25",
    description: "Windshield cracked due to stone impact",
    claimAmount: 6000,
    status: "Processing",
    approvedAmount: null,
    documents: ["damage_photos.jpg"],
  },
];

export default function InsuranceManagement() {
  const [activeTab, setActiveTab] = useState("policies");
  const [addPolicyDialogOpen, setAddPolicyDialogOpen] = useState(false);
  const [reportClaimDialogOpen, setReportClaimDialogOpen] = useState(false);
  
  // Calculate statistics for dashboard
  const totalPolicies = mockInsurancePolicies.length;
  const activePolicies = mockInsurancePolicies.filter(
    policy => new Date(policy.expiryDate) > new Date()
  ).length;
  const expiredPolicies = totalPolicies - activePolicies;
  const totalPremiums = mockInsurancePolicies.reduce(
    (sum, policy) => sum + policy.premiumAmount, 0
  );
  const totalClaims = mockInsuranceClaims.length;
  const approvedClaims = mockInsuranceClaims.filter(
    claim => claim.status === "Approved"
  ).length;
  
  const handlePolicySubmit = () => {
    setAddPolicyDialogOpen(false);
    toast.success("Insurance policy added successfully");
  };
  
  const handleClaimSubmit = () => {
    setReportClaimDialogOpen(false);
    toast.success("Insurance claim reported successfully");
  };
  
  const handleExportReport = () => {
    toast.info("Generating insurance report...");
    // This would be handled by the backend in a real implementation
    setTimeout(() => {
      toast.success("Report generated and downloaded successfully");
    }, 1500);
  };
  
  return (
    <PageLayout>
      <div className="page-container">
        <div className="page-title-container">
          <h1 className="page-title">Insurance Management</h1>
          <p className="page-description">
            Manage insurance policies and claims for all vehicles
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Active Insurance Policies
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activePolicies}/{totalPolicies}</div>
              <p className="text-xs text-muted-foreground">
                {expiredPolicies} policies need renewal
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Total Premium Amount
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalPremiums.toLocaleString()} ETB</div>
              <p className="text-xs text-muted-foreground">
                Year to date
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Active Claims
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalClaims - approvedClaims}</div>
              <p className="text-xs text-muted-foreground">
                {approvedClaims} claims approved
              </p>
            </CardContent>
          </Card>
        </div>
        
        <Card className="p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <Tabs 
              value={activeTab} 
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList>
                <TabsTrigger value="policies">Insurance Policies</TabsTrigger>
                <TabsTrigger value="claims">Insurance Claims</TabsTrigger>
                <TabsTrigger value="reports">Reports</TabsTrigger>
              </TabsList>
              
              <TabsContent value="policies" className="mt-6">
                <InsurancePoliciesList policies={mockInsurancePolicies} />
              </TabsContent>
              
              <TabsContent value="claims" className="mt-6">
                <InsuranceClaimsList claims={mockInsuranceClaims} />
              </TabsContent>
              
              <TabsContent value="reports" className="mt-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="p-6">
                    <CardTitle className="text-lg mb-4">Insurance Status</CardTitle>
                    <InsuranceStatusChart active={activePolicies} expired={expiredPolicies} />
                  </Card>
                  
                  <Card className="p-6">
                    <CardTitle className="text-lg mb-4">Claims Processing</CardTitle>
                    <div className="mt-4">
                      <p className="text-center text-muted-foreground mb-2">
                        Claims processing visualization will be displayed here
                      </p>
                    </div>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
            
            <div className="flex items-center gap-2">
              {activeTab === "policies" && (
                <Button onClick={() => setAddPolicyDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" /> Add Policy
                </Button>
              )}
              {activeTab === "claims" && (
                <Button onClick={() => setReportClaimDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" /> Report Claim
                </Button>
              )}
              {activeTab === "reports" && (
                <Button onClick={handleExportReport}>
                  <Download className="h-4 w-4 mr-2" /> Export Report
                </Button>
              )}
            </div>
          </div>
        </Card>
      </div>
      
      <Dialog open={addPolicyDialogOpen} onOpenChange={setAddPolicyDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Insurance Policy</DialogTitle>
          </DialogHeader>
          <AddInsurancePolicyForm onSubmit={handlePolicySubmit} />
        </DialogContent>
      </Dialog>
      
      <Dialog open={reportClaimDialogOpen} onOpenChange={setReportClaimDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Report Insurance Claim</DialogTitle>
          </DialogHeader>
          <ReportInsuranceClaimForm onSubmit={handleClaimSubmit} />
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
}
