import { UseFormReturn } from "react-hook-form";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

interface VehicleInsuranceInfoProps {
    form: UseFormReturn<any>;
    insuranceExpiryDate: Date | undefined;
    setInsuranceExpiryDate: (date: Date | undefined) => void;
    boloExpiryDate: Date | undefined;
    setBoloExpiryDate: (date: Date | undefined) => void;
}

export function VehicleInsuranceInfo({
    form,
    insuranceExpiryDate,
    setInsuranceExpiryDate,
    boloExpiryDate,
    setBoloExpiryDate,
}: VehicleInsuranceInfoProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <FormField
                control={form.control}
                name="insuranceCompany"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Insurance Company</FormLabel>
                        <FormControl>
                            <Input placeholder="e.g. Awash Insurance" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormItem>
                <FormLabel>Insurance Expiry Date</FormLabel>
                <Popover>
                    <PopoverTrigger asChild>
                        <FormControl>
                            <Button
                                variant={"outline"}
                                className={cn(
                                    "w-full justify-start text-left font-normal",
                                    !insuranceExpiryDate && "text-muted-foreground"
                                )}
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {insuranceExpiryDate ? (
                                    format(insuranceExpiryDate, "PPP")
                                ) : (
                                    <span>Pick a date</span>
                                )}
                            </Button>
                        </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            mode="single"
                            selected={insuranceExpiryDate}
                            onSelect={(date) => {
                                setInsuranceExpiryDate(date);
                                form.setValue(
                                    "insuranceExpiryDate",
                                    date ? format(date, "yyyy-MM-dd") : ""
                                );
                            }}
                            initialFocus
                            className={cn("p-3 pointer-events-auto")}
                        />
                    </PopoverContent>
                </Popover>
                <FormMessage>
                    {form.formState.errors.insuranceExpiryDate?.message?.toString()}
                </FormMessage>
            </FormItem>

            <FormItem>
                <FormLabel>Bolo Expiry Date</FormLabel>
                <Popover>
                    <PopoverTrigger asChild>
                        <FormControl>
                            <Button
                                variant={"outline"}
                                className={cn(
                                    "w-full justify-start text-left font-normal",
                                    !boloExpiryDate && "text-muted-foreground"
                                )}
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {boloExpiryDate ? (
                                    format(boloExpiryDate, "PPP")
                                ) : (
                                    <span>Pick a date</span>
                                )}
                            </Button>
                        </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            mode="single"
                            selected={boloExpiryDate}
                            onSelect={(date) => {
                                setBoloExpiryDate(date);
                                form.setValue(
                                    "boloExpiryDate",
                                    date ? format(date, "yyyy-MM-dd") : ""
                                );
                            }}
                            initialFocus
                            className={cn("p-3 pointer-events-auto")}
                        />
                    </PopoverContent>
                </Popover>
                <FormMessage>
                    {form.formState.errors.boloExpiryDate?.message?.toString()}
                </FormMessage>
            </FormItem>
        </div>
    );
}
