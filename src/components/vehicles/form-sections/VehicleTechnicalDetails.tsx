
import { Control } from "react-hook-form";
import {
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface VehicleTechnicalDetailsProps {
    control: Control<any>;
}

export function VehicleTechnicalDetails({ control }: VehicleTechnicalDetailsProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <FormField
                control={control}
                name="horsePower"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Horse Power</FormLabel>
                        <FormControl>
                            <Input type="number" step="0.1" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={control}
                name="singleWeight"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Single Weight (kg)</FormLabel>
                        <FormControl>
                            <Input type="number" step="0.1" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={control}
                name="totalWeight"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Total Weight (kg)</FormLabel>
                        <FormControl>
                            <Input type="number" step="0.1" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={control}
                name="cylinderCount"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Number of Cylinders</FormLabel>
                        <FormControl>
                            <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={control}
                name="axleCount"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Number of Axles</FormLabel>
                        <FormControl>
                            <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={control}
                name="fuelConsumptionRate"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Fuel Consumption Rate (L/100km)</FormLabel>
                        <FormControl>
                            <Input type="number" step="0.1" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={control}
                name="workEnvironment"
                render={({ field }) => (
                    <FormItem className="col-span-full">
                        <FormLabel>Work Environment</FormLabel>
                        <FormControl>
                            <Textarea
                                placeholder="Where will this vehicle be used?"
                                className="resize-none"
                                {...field}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
    );
}
