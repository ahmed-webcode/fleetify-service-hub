
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileEdit, Trash2, FileText } from "lucide-react";
import { toast } from "sonner";

interface InsurancePolicy {
  id: string;
  vehicleId: string;
  vehicleName: string;
  licensePlate: string;
  policyNumber: string;
  insuranceCompany: string;
  startDate: string;
  expiryDate: string;
  coverageType: string;
  premiumAmount: number;
  paymentStatus: string;
  lastPaymentDate: string | null;
}

interface InsurancePoliciesListProps {
  policies: InsurancePolicy[];
}

export function InsurancePoliciesList({ policies }: InsurancePoliciesListProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedPolicyId, setSelectedPolicyId] = useState<string | null>(null);
  
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };
  
  const handleDelete = (policyId: string) => {
    setSelectedPolicyId(policyId);
    setDeleteDialogOpen(true);
  };
  
  const confirmDelete = () => {
    // In a real app, this would make an API call
    toast.success("Insurance policy deleted successfully");
    setDeleteDialogOpen(false);
  };
  
  const handleEdit = (policyId: string) => {
    // In a real app, this would open an edit dialog
    toast.info(`Editing policy ${policyId}`);
  };
  
  const handleViewDetails = (policyId: string) => {
    // In a real app, this would navigate to a details page
    toast.info(`Viewing details for policy ${policyId}`);
  };
  
  const isPolicyExpired = (expiryDate: string) => {
    return new Date(expiryDate) < new Date();
  };
  
  return (
    <div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Vehicle</TableHead>
              <TableHead>Policy Number</TableHead>
              <TableHead>Insurance Company</TableHead>
              <TableHead>Coverage</TableHead>
              <TableHead>Expiry Date</TableHead>
              <TableHead>Premium</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {policies.length > 0 ? (
              policies.map((policy) => (
                <TableRow key={policy.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{policy.vehicleName}</div>
                      <div className="text-xs text-muted-foreground">
                        {policy.licensePlate}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{policy.policyNumber}</TableCell>
                  <TableCell>{policy.insuranceCompany}</TableCell>
                  <TableCell>{policy.coverageType}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span>{formatDate(policy.expiryDate)}</span>
                      {isPolicyExpired(policy.expiryDate) && (
                        <Badge variant="destructive" className="mt-1 w-fit">
                          Expired
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{policy.premiumAmount.toLocaleString()} ETB</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        policy.paymentStatus === "paid" ? "outline" : "secondary"
                      }
                    >
                      {policy.paymentStatus === "paid" ? "Paid" : "Pending"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleViewDetails(policy.id)}
                      >
                        <FileText className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(policy.id)}
                      >
                        <FileEdit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(policy.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  No insurance policies found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              insurance policy record.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
