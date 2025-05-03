
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Download } from "lucide-react";
import { toast } from "sonner";

interface InsuranceClaim {
  id: string;
  vehicleId: string;
  vehicleName: string;
  licensePlate: string;
  policyNumber: string;
  claimDate: string;
  incidentDate: string;
  description: string;
  claimAmount: number;
  status: string;
  approvedAmount: number | null;
  documents: string[];
}

interface InsuranceClaimsListProps {
  claims: InsuranceClaim[];
}

export function InsuranceClaimsList({ claims }: InsuranceClaimsListProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };
  
  const getStatusVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
        return "success";
      case "pending":
        return "secondary";
      case "processing":
        return "warning";
      case "rejected":
        return "destructive";
      default:
        return "outline";
    }
  };
  
  const handleViewDetails = (claimId: string) => {
    // In a real app, this would navigate to a details page
    toast.info(`Viewing details for claim ${claimId}`);
  };
  
  const handleDownloadDocuments = (claimId: string) => {
    // In a real app, this would download the documents
    toast.success(`Documents for claim ${claimId} downloaded`);
  };
  
  return (
    <div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Vehicle</TableHead>
              <TableHead>Claim Date</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {claims.length > 0 ? (
              claims.map((claim) => (
                <TableRow key={claim.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{claim.vehicleName}</div>
                      <div className="text-xs text-muted-foreground">
                        {claim.licensePlate}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div>{formatDate(claim.claimDate)}</div>
                      <div className="text-xs text-muted-foreground">
                        Incident: {formatDate(claim.incidentDate)}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-[200px] truncate" title={claim.description}>
                      {claim.description}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div>{claim.claimAmount.toLocaleString()} ETB</div>
                      {claim.approvedAmount !== null && (
                        <div className="text-xs text-muted-foreground">
                          Approved: {claim.approvedAmount.toLocaleString()} ETB
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(claim.status)}>
                      {claim.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleViewDetails(claim.id)}
                      >
                        <FileText className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDownloadDocuments(claim.id)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No insurance claims found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
