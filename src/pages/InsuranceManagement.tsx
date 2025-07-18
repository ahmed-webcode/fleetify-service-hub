import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InsurancePoliciesList } from "@/components/insurance/InsurancePoliciesList";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AddInsurancePolicyForm } from "@/components/insurance/AddInsurancePolicyForm";
import { InsuranceStatusChart } from "@/components/reports/charts/InsuranceStatusChart";
import { toast } from "sonner";
import { apiClient } from "@/lib/apiClient";
import { InsuranceCreate } from "@/types/insurance";
import { useQuery, useMutation } from "@tanstack/react-query";

export default function InsuranceManagement() {
    const [addPolicyDialogOpen, setAddPolicyDialogOpen] = useState(false);

    // Fetch insurance policies from backend
    const {
        data: policies,
        isLoading,
        isError,
        refetch,
        error,
    } = useQuery({
        queryKey: ["insurances"],
        queryFn: () => apiClient.insurances.getAll(),
    });

    // Create insurance mutation
    const createMutation = useMutation({
        mutationFn: (data: InsuranceCreate) => apiClient.insurances.create(data),
        onSuccess: () => {
            toast.success("Insurance policy added successfully");
            setAddPolicyDialogOpen(false);
            refetch();
        },
        onError: (err: any) => {
            toast.error(err.message || "Failed to add policy");
        },
    });

    // Calculate statistics for dashboard
    const totalPolicies = policies?.content.length || 0;
    const activePolicies =
        policies?.content.filter((policy) => new Date(policy.policyEndDate) > new Date()).length ||
        0;
    const expiredPolicies = totalPolicies - activePolicies;
    const totalPremiums =
        policies?.content.reduce((sum, policy) => sum + policy.premiumAmount, 0) || 0;

    return (
        <>
            <div className="page-container">
                <div className="page-title-container">
                    <h1 className="page-title">Insurance Management</h1>
                    <p className="page-description">Manage insurance policies for all vehicles</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">
                                Active Insurance Policies
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {activePolicies}/{totalPolicies}
                            </div>
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
                            <div className="text-2xl font-bold">
                                {totalPremiums.toLocaleString()} ETB
                            </div>
                            <p className="text-xs text-muted-foreground">Year to date</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">Insurance Status</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <InsuranceStatusChart
                                active={activePolicies}
                                expired={expiredPolicies}
                            />
                        </CardContent>
                    </Card>
                </div>
                <Card className="p-6">
                    <div className="flex flex-col justify-between items-start mb-6 gap-4">
                        <div className="self-end">
                            <Button onClick={() => setAddPolicyDialogOpen(true)}>
                                <Plus className="h-4 w-4 mr-2" /> Add Policy
                            </Button>
                        </div>
                        {isLoading ? (
                            <div className="w-full text-center py-8">Loading policies...</div>
                        ) : isError ? (
                            <div className="w-full text-center text-destructive py-8">
                                {error?.message || "Failed to load policies"}
                            </div>
                        ) : (
                            <InsurancePoliciesList policies={policies?.content || []} />
                        )}
                    </div>
                </Card>
            </div>
            <Dialog open={addPolicyDialogOpen} onOpenChange={setAddPolicyDialogOpen}>
                <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Add New Insurance Policy</DialogTitle>
                    </DialogHeader>
                    <AddInsurancePolicyForm onSubmit={createMutation.mutate} />
                </DialogContent>
            </Dialog>
        </>
    );
}
