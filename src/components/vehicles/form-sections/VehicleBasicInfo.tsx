
import { Control } from "react-hook-form";
import {
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { VehicleType, VehicleStatus } from "@/types/vehicle";

interface FuelType {
    id: number;
    name: string;
}

interface VehicleBasicInfoProps {
    control: Control<any>;
    fuelTypes: FuelType[] | undefined;
}

export function VehicleBasicInfo({ control, fuelTypes }: VehicleBasicInfoProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <FormField
                control={control}
                name="vehicleType"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Vehicle Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {Object.values(VehicleType).map((type) => (
                                    <SelectItem key={type} value={type}>
                                        {type}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={control}
                name="model"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Model</FormLabel>
                        <FormControl>
                            <Input placeholder="e.g. Land Cruiser" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={control}
                name="madeYear"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Year</FormLabel>
                        <FormControl>
                            <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={control}
                name="plateNumber"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>License Plate</FormLabel>
                        <FormControl>
                            <Input placeholder="e.g. AA-2-A-33273" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={control}
                name="chassisNumber"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Chassis Number</FormLabel>
                        <FormControl>
                            <Input placeholder="Chassis Number" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={control}
                name="motorNumber"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Motor Number</FormLabel>
                        <FormControl>
                            <Input placeholder="Motor Number" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={control}
                name="fuelTypeId"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Fuel Type</FormLabel>
                        <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value?.toString()}
                        >
                            <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select fuel type" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {fuelTypes?.map((fuelType) => (
                                    <SelectItem
                                        key={fuelType.id}
                                        value={fuelType.id.toString()}
                                    >
                                        {fuelType.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={control}
                name="color"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Color</FormLabel>
                        <FormControl>
                            <Input placeholder="e.g. White" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={control}
                name="status"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {Object.values(VehicleStatus).map((status) => (
                                    <SelectItem key={status} value={status}>
                                        {status.replace(/_/g, " ")}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={control}
                name="kmReading"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Odometer Reading (km)</FormLabel>
                        <FormControl>
                            <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={control}
                name="madeIn"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Country of Origin</FormLabel>
                        <FormControl>
                            <Input placeholder="e.g. Japan" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={control}
                name="seatsCount"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Number of Seats</FormLabel>
                        <FormControl>
                            <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
    );
}
