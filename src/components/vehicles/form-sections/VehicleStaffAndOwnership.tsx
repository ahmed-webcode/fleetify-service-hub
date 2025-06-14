
import { Control } from "react-hook-form";
import {
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader } from "lucide-react";

interface User {
    id: number;
    username: string;
    firstName: string;
    lastName: string;
    canDrive: boolean;
}

interface VehicleStaffAndOwnershipProps {
    control: Control<any>;
    isLoadingUsers: boolean;
    staffUsers: User[];
    showDriverField: boolean;
    availableDrivers: User[];
}

export function VehicleStaffAndOwnership({
    control,
    isLoadingUsers,
    staffUsers,
    showDriverField,
    availableDrivers
}: VehicleStaffAndOwnershipProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 p-4 bg-muted/20 rounded-md border">
            <FormField
                control={control}
                name="isPrivate"
                render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-3 space-y-0 p-4 rounded-md border col-span-full">
                        <FormControl>
                            <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                            />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                            <FormLabel>Private Vehicle</FormLabel>
                        </div>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <h3 className="text-lg font-medium col-span-full mb-2">Staff Assignment</h3>

            <FormField
                control={control}
                name="responsibleStaffId"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Responsible Staff</FormLabel>
                        <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value?.toString()}
                            disabled={isLoadingUsers}
                        >
                            <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select staff member" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {isLoadingUsers ? (
                                    <div className="flex items-center justify-center p-2">
                                        <Loader className="h-4 w-4 animate-spin mr-2" />
                                        Loading...
                                    </div>
                                ) : (
                                    staffUsers.map((user) => (
                                        <SelectItem
                                            key={user.id}
                                            value={user.id.toString()}
                                        >
                                            {user.firstName} {user.lastName} (
                                            {user.canDrive ? "Can drive" : "Can't drive"})
                                        </SelectItem>
                                    ))
                                )}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )}
            />

            {showDriverField && (
                <FormField
                    control={control}
                    name="driverId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Driver</FormLabel>
                            <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value?.toString()}
                                disabled={isLoadingUsers}
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select driver" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {isLoadingUsers ? (
                                        <div className="flex items-center justify-center p-2">
                                            <Loader className="h-4 w-4 animate-spin mr-2" />
                                            Loading...
                                        </div>
                                    ) : (
                                        availableDrivers.map((driver) => (
                                            <SelectItem
                                                key={driver.id}
                                                value={driver.id.toString()}
                                            >
                                                {driver.firstName} {driver.lastName}
                                            </SelectItem>
                                        ))
                                    )}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            )}
        </div>
    );
}
