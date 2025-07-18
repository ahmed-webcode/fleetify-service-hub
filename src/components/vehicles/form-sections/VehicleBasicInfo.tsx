import { Control } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { VehicleType, VehicleStatus } from "@/types/vehicle";

interface FuelType {
    id: number;
    name: string;
}

interface Level {
    id: number;
    name: string;
}

interface VehicleBasicInfoProps {
    control: Control<any>;
    fuelTypes: FuelType[] | undefined;
    levels: Level[] | undefined;
}

export function VehicleBasicInfo({ control, fuelTypes, levels }: VehicleBasicInfoProps) {
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
                                    <SelectItem key={fuelType.id} value={fuelType.id.toString()}>
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

            <FormField
                control={control}
                name="workEnvironment"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Work Environment</FormLabel>
                        <FormControl>
                            <Input placeholder="e.g. Addis Ababa" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            {/* New: Level selection */}
            <FormField
                control={control}
                name="levelId"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Level</FormLabel>
                        <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value?.toString()}
                        >
                            <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select level" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {levels?.map((level) => (
                                    <SelectItem key={level.id} value={level.id.toString()}>
                                        {level.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )}
            />

            {/* New: isService checkbox */}
            <FormField
                control={control}
                name="isService"
                render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-3 space-y-0 p-4 rounded-md border col-span-full">
                        <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                            <FormLabel>Service Vehicle</FormLabel>
                        </div>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
    );
}
