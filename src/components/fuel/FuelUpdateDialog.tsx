import React, { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FuelFull } from "@/types/fuel";
import { apiClient } from "@/lib/apiClient";
import { toast } from "sonner";

interface FuelUpdateDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    fuel: FuelFull | null;
    onSuccess: () => void;
}

export default function FuelUpdateDialog({
    open,
    onOpenChange,
    fuel,
    onSuccess,
}: FuelUpdateDialogProps) {
    const [amount, setAmount] = useState<number | "">(fuel?.amount ?? "");
    const [pricePerLiter, setPricePerLiter] = useState<number | "">(fuel?.pricePerLiter ?? "");
    const [loading, setLoading] = useState(false);

    React.useEffect(() => {
        setAmount(fuel?.amount ?? "");
        setPricePerLiter(fuel?.pricePerLiter ?? "");
    }, [fuel, open]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!fuel) return;
        if (
            amount === "" ||
            pricePerLiter === "" ||
            Number(amount) <= 0 ||
            Number(pricePerLiter) <= 0
        ) {
            toast.error("Please enter valid positive values for both fields.");
            return;
        }
        setLoading(true);
        try {
            await apiClient.fuel.updateFuel(fuel.id, {
                amount: Number(amount),
                pricePerLiter: Number(pricePerLiter),
            });
            toast.success("Fuel updated successfully.");
            onOpenChange(false);
            onSuccess();
        } catch (err) {
            toast.error("Failed to update fuel.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Edit Fuel</DialogTitle>
                        <DialogDescription>
                            Update the price per liter and amount for <b>{fuel?.fuelType.name}</b>.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-2">
                        <div>
                            <label className="block text-xs mb-1" htmlFor="pricePerLiter">
                                Price per Liter
                            </label>
                            <Input
                                id="pricePerLiter"
                                type="number"
                                step="0.01"
                                min={0.01}
                                value={pricePerLiter}
                                onChange={(e) =>
                                    setPricePerLiter(
                                        e.target.value === "" ? "" : Number(e.target.value)
                                    )
                                }
                                required
                                disabled={loading}
                            />
                        </div>
                        <div>
                            <label className="block text-xs mb-1" htmlFor="amount">
                                Amount (L)
                            </label>
                            <Input
                                id="amount"
                                type="number"
                                step="0.01"
                                min={0.01}
                                value={amount}
                                onChange={(e) =>
                                    setAmount(e.target.value === "" ? "" : Number(e.target.value))
                                }
                                required
                                disabled={loading}
                            />
                        </div>
                    </div>
                    <DialogFooter className="mt-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading}>
                            Update
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
