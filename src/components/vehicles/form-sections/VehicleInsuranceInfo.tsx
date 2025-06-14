
import { UseFormReturn } from "react-hook-form";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import {
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

interface VehicleInsuranceInfoProps {
    form: UseFormReturn<any>;
    insuranceEndDate: Date | undefined;
    setInsuranceEndDate: (date: Date | undefined) => void;
    boloEndDate: Date | undefined;
    setBoloEndDate: (date: Date | undefined) => void;
}

export function VehicleInsuranceInfo({
    form,
    insuranceEndDate,
    setInsuranceEndDate,
    boloEndDate,
    setBoloEndDate
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
                <FormLabel>Insurance End Date</FormLabel>
                <Popover>
                    <PopoverTrigger asChild>
                        <FormControl>
                            <Button
                                variant={"outline"}
                                className={cn(
                                    "w-full justify-start text-left font-normal",
                                    !insuranceEndDate && "text-muted-foreground"
                                )}
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {insuranceEndDate
                                    ? format(insuranceEndDate, "PPP")
                                    : <span>Pick a date</span>}
                            </Button>
                        </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            mode="single"
                            selected={insuranceEndDate}
                            onSelect={(date) => {
                                setInsuranceEndDate(date);
                                form.setValue("insuranceEndDate", date ? format(date, "yyyy-MM-dd") : "");
                            }}
                            initialFocus
                            className={cn("p-3 pointer-events-auto")}
                        />
                    </PopoverContent>
                </Popover>
                <FormMessage>
                    {form.formState.errors.insuranceEndDate?.message?.toString()}
                </FormMessage>
            </FormItem>

            <FormItem>
                <FormLabel>Bolo End Date</FormLabel>
                <Popover>
                    <PopoverTrigger asChild>
                        <FormControl>
                            <Button
                                variant={"outline"}
                                className={cn(
                                    "w-full justify-start text-left font-normal",
                                    !boloEndDate && "text-muted-foreground"
                                )}
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {boloEndDate
                                    ? format(boloEndDate, "PPP")
                                    : <span>Pick a date</span>}
                            </Button>
                        </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            mode="single"
                            selected={boloEndDate}
                            onSelect={(date) => {
                                setBoloEndDate(date);
                                form.setValue("boloEndDate", date ? format(date, "yyyy-MM-dd") : "");
                            }}
                            initialFocus
                            className={cn("p-3 pointer-events-auto")}
                        />
                    </PopoverContent>
                </Popover>
                <FormMessage>
                    {form.formState.errors.boloEndDate?.message?.toString()}
                </FormMessage>
            </FormItem>
        </div>
    );
}
