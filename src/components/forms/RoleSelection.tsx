
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ROLE_DETAILS } from "@/lib/jwtUtils";

interface RoleSelectionProps {
    selectedRoleIds: number[];
    onRoleChange: (roleIds: number[]) => void;
}

export function RoleSelection({ selectedRoleIds, onRoleChange }: RoleSelectionProps) {
    const allRoles = Object.values(ROLE_DETAILS);

    const handleRoleToggle = (roleId: number, checked: boolean) => {
        if (checked) {
            onRoleChange([...selectedRoleIds, roleId]);
        } else {
            onRoleChange(selectedRoleIds.filter(id => id !== roleId));
        }
    };

    return (
        <div className="space-y-2 col-span-1 md:col-span-2">
            <Label className="text-sm font-medium">Roles (select at least one)</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 p-3 border rounded-md">
                {allRoles.map((role) => (
                    <div key={role.id} className="flex items-center space-x-2">
                        <Checkbox
                            id={`role-${role.id}`}
                            checked={selectedRoleIds.includes(role.id)}
                            onCheckedChange={(checked) => {
                                if (typeof checked === "boolean") {
                                    handleRoleToggle(role.id, checked);
                                }
                            }}
                        />
                        <Label
                            htmlFor={`role-${role.id}`}
                            className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                            {role.name}
                        </Label>
                    </div>
                ))}
            </div>
        </div>
    );
}
