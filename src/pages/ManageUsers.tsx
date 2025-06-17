import { useState, useEffect, useMemo, useCallback, memo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { apiClient } from "@/lib/apiClient";
import { Level } from "@/types/level";
import { Position } from "@/types/position";
import { UserDto, CreateUserDto, UpdateUserDto, Gender } from "@/types/user";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Search, Plus, Edit2, UserCircle, CheckSquare, XSquare } from "lucide-react";
import { RoleSelection } from "@/components/forms/RoleSelection";

const ITEMS_PER_PAGE = 10;

// Define Props for the new UserFormFields component
interface UserFormFieldsProps {
    isEdit?: boolean;
    formState: Partial<CreateUserDto> | Partial<UpdateUserDto>;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement>, formType: "new" | "edit") => void;
    handleCheckboxChange: (name: string, checked: boolean, formType: "new" | "edit") => void;
    handleSelectChange: (name: string, value: string, formType: "new" | "edit") => void;
    handleRoleChange: (roleIds: number[], formType: "new" | "edit") => void;
    levels: Level[];
    positions: Position[];
}

// Define UserFormFields as a standalone, memoized component
const UserFormFields: React.FC<UserFormFieldsProps> = memo(
    ({
        isEdit = false,
        formState,
        handleInputChange: parentHandleInputChange,
        handleCheckboxChange: parentHandleCheckboxChange,
        handleSelectChange: parentHandleSelectChange,
        handleRoleChange: parentHandleRoleChange,
        levels,
        positions,
    }) => {
        const formType = isEdit ? "edit" : "new";

        // Internal handlers call the memoized parent handlers with the correct formType
        const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement>) =>
            parentHandleInputChange(e, formType);
        const handleSelectFieldChange = (name: string, value: string) =>
            parentHandleSelectChange(name, value, formType);
        const handleCheckBoxFieldChange = (name: string, checked: boolean) =>
            parentHandleCheckboxChange(name, checked, formType);
        const handleRoleFieldChange = (roleIds: number[]) =>
            parentHandleRoleChange(roleIds, formType);

        return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                        id="username"
                        name="username"
                        value={formState.username || ""}
                        onChange={handleFieldChange}
                        placeholder="e.g. john.doe"
                        disabled={isEdit}
                    />
                </div>
                {!isEdit && (
                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            name="password"
                            type="password"
                            value={(formState as CreateUserDto).password || ""}
                            onChange={handleFieldChange}
                            placeholder="Min. 8 characters"
                        />
                    </div>
                )}
                <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                        id="firstName"
                        name="firstName"
                        value={formState.firstName || ""}
                        onChange={handleFieldChange}
                        placeholder="John"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                        id="lastName"
                        name="lastName"
                        value={formState.lastName || ""}
                        onChange={handleFieldChange}
                        placeholder="Doe"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formState.email || ""}
                        onChange={handleFieldChange}
                        placeholder="john.doe@example.com"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="universityId">University ID</Label>
                    <Input
                        id="universityId"
                        name="universityId"
                        value={formState.universityId || ""}
                        onChange={handleFieldChange}
                        placeholder="Ets0123/10"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="phoneNumber">Phone Number</Label>
                    <Input
                        id="phoneNumber"
                        name="phoneNumber"
                        value={formState.phoneNumber || ""}
                        onChange={handleFieldChange}
                        placeholder="0912345678"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    <Select
                        name="gender"
                        value={formState.gender}
                        onValueChange={(value) => handleSelectFieldChange("gender", value)}
                    >
                        <SelectTrigger id="gender">
                            <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value={Gender.MALE}>Male</SelectItem>
                            <SelectItem value={Gender.FEMALE}>Female</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="levelId">Organizational Level</Label>
                    <Select
                        name="levelId"
                        value={formState.levelId?.toString()}
                        onValueChange={(value) => handleSelectFieldChange("levelId", value)}
                    >
                        <SelectTrigger id="levelId">
                            <SelectValue placeholder="Select level" />
                        </SelectTrigger>
                        <SelectContent>
                            {levels.map((level) => (
                                <SelectItem key={level.id} value={level.id.toString()}>
                                    {level.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="positionId">Position</Label>
                    <Select
                        name="positionId"
                        value={formState.positionId?.toString()}
                        onValueChange={(value) => handleSelectFieldChange("positionId", value)}
                    >
                        <SelectTrigger id="positionId">
                            <SelectValue placeholder="Select position" />
                        </SelectTrigger>
                        <SelectContent>
                            {positions.map((pos) => (
                                <SelectItem key={pos.id} value={pos.id.toString()}>
                                    {pos.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex items-center space-x-2 col-span-1 md:col-span-2 pt-2">
                    <Checkbox
                        id="canDrive"
                        name="canDrive"
                        checked={formState.canDrive}
                        onCheckedChange={(checked) => {
                            if (typeof checked === "boolean") {
                                handleCheckBoxFieldChange("canDrive", checked);
                            }
                        }}
                    />
                    <Label
                        htmlFor="canDrive"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                        Can Drive
                    </Label>
                </div>
                <RoleSelection
                    selectedRoleIds={formState.roleIds || []}
                    onRoleChange={handleRoleFieldChange}
                />
            </div>
        );
    }
);
UserFormFields.displayName = "UserFormFields"; // Adding display name for better debugging

export default function ManageUsers() {
    const [users, setUsers] = useState<UserDto[]>([]);
    const [levels, setLevels] = useState<Level[]>([]);
    const [positions, setPositions] = useState<Position[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [isAddUserOpen, setIsAddUserOpen] = useState(false);
    const [isEditUserOpen, setIsEditUserOpen] = useState(false);
    const [isDeleteUserOpen, setIsDeleteUserOpen] = useState(false);

    const [searchTerm, setSearchTerm] = useState("");
    const [selectedUser, setSelectedUser] = useState<UserDto | null>(null);

    const [newUser, setNewUser] = useState<Partial<CreateUserDto>>({
        username: "",
        password: "",
        firstName: "",
        lastName: "",
        universityId: "",
        email: "",
        gender: Gender.MALE,
        phoneNumber: "",
        canDrive: false,
        roleIds: [],
    });

    const [editUser, setEditUser] = useState<Partial<UpdateUserDto>>({});

    const [currentPage, setCurrentPage] = useState(1);

    const { hasPermission } = useAuth();

    useEffect(() => {
        fetchUsers();
        fetchLevels();
        fetchPositions();
    }, []);

    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            const fetchedUsers = await apiClient.users.getAll();
            setUsers(fetchedUsers);
        } catch (error) {
            toast.error("Failed to fetch users.");
            console.error("Fetch users error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchLevels = async () => {
        try {
            const fetchedLevels = await apiClient.levels.getAll();
            setLevels(fetchedLevels || []);
        } catch (error) {
            toast.error("Failed to fetch organizational levels.");
            console.error("Fetch levels error:", error);
        }
    };

    const fetchPositions = async () => {
        try {
            const fetchedPositionsResponse = await apiClient.positions.getAll({
                page: 0,
                size: 1000,
            });
            setPositions(fetchedPositionsResponse?.content || []);
        } catch (error) {
            toast.error("Failed to fetch positions.");
            console.error("Fetch positions error:", error);
        }
    };

    // Memoize handler functions
    const handleInputChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>, formType: "new" | "edit") => {
            const { name, value } = e.target;
            if (formType === "new") {
                setNewUser((prev) => ({ ...prev, [name]: value }));
            } else {
                setEditUser((prev) => ({ ...prev, [name]: value }));
            }
        },
        [setNewUser, setEditUser] // Dependencies for useCallback
    );

    const handleCheckboxChange = useCallback(
        (name: string, checked: boolean, formType: "new" | "edit") => {
            if (formType === "new") {
                setNewUser((prev) => ({ ...prev, [name]: checked }));
            } else {
                setEditUser((prev) => ({ ...prev, [name]: checked }));
            }
        },
        [setNewUser, setEditUser] // Dependencies for useCallback
    );

    const handleSelectChange = useCallback(
        (name: string, value: string, formType: "new" | "edit") => {
            const numValue =
                name === "levelId" || name === "positionId" ? parseInt(value, 10) : value;
            if (formType === "new") {
                setNewUser((prev) => ({ ...prev, [name]: numValue }));
            } else {
                setEditUser((prev) => ({ ...prev, [name]: numValue }));
            }
        },
        [setNewUser, setEditUser] // Dependencies for useCallback
    );

    const handleRoleChange = useCallback(
        (roleIds: number[], formType: "new" | "edit") => {
            if (formType === "new") {
                setNewUser((prev) => ({ ...prev, roleIds }));
            } else {
                setEditUser((prev) => ({ ...prev, roleIds }));
            }
        },
        [setNewUser, setEditUser]
    );

    const filteredUsers = useMemo(() => {
        return users.filter(
            (user) =>
                (user.username?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
                (user.firstName?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
                (user.lastName?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
                (user.email?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
                (user.universityId?.toLowerCase() || "").includes(searchTerm.toLowerCase())
        );
    }, [users, searchTerm]);

    const paginatedUsers = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredUsers.slice(start, start + ITEMS_PER_PAGE);
    }, [filteredUsers, currentPage]);

    const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);

    const handleAddUser = async () => {
        if (
            !newUser.username ||
            !newUser.password ||
            !newUser.firstName ||
            !newUser.lastName ||
            !newUser.email ||
            !newUser.universityId ||
            !newUser.roleIds ||
            newUser.roleIds.length === 0
        ) {
            toast.error(
                "Please fill all required fields including at least one role."
            );
            return;
        }

        try {
            const createdUser = await apiClient.users.create(newUser as CreateUserDto);
            setUsers((prev) =>
                [createdUser, ...prev].sort((a, b) => a.username.localeCompare(b.username))
            );
            toast.success("User added successfully!");
            setIsAddUserOpen(false);
            setNewUser({
                username: "",
                password: "",
                firstName: "",
                lastName: "",
                universityId: "",
                email: "",
                gender: Gender.MALE,
                phoneNumber: "",
                canDrive: false,
                levelId: undefined,
                positionId: undefined,
                roleIds: [],
            });
        } catch (error: any) {
            toast.error(`Failed to add user: ${error.message || "Unknown error"}`);
            console.error("Add user error:", error);
        }
    };

    const openEditDialog = (user: UserDto) => {
        setSelectedUser(user);
        setEditUser({
            id: user.id,
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            universityId: user.universityId,
            email: user.email,
            phoneNumber: user.phoneNumber,
            canDrive: user.canDrive,
            gender: user.gender,
            levelId: levels.find((l) => l.name === user.levelName)?.id,
            positionId: positions.find((p) => p.name === user.positionName)?.id,
            roleIds: user.roles?.map(role => role.id) || [],
        });
        setIsEditUserOpen(true);
    };

    const handleUpdateUser = async () => {
        if (!selectedUser || !editUser.id) {
            toast.error("No user selected for update.");
            return;
        }
        if (!editUser.email || !editUser.universityId) {
            toast.error("Email and University ID are required for update.");
            return;
        }
        if (!editUser.roleIds || editUser.roleIds.length === 0) {
            toast.error("At least one role must be selected.");
            return;
        }

        try {
            const changedFields: Partial<UpdateUserDto> = {};
            const formValues = editUser;
            const originalUser = selectedUser;

            // Include roleIds in the editable properties
            const editableProperties: (keyof Omit<UpdateUserDto, "id" | "username">)[] = [
                "firstName",
                "lastName",
                "universityId",
                "email",
                "phoneNumber",
                "canDrive",
                "gender",
                "levelId",
                "positionId",
                "roleIds",
            ];

            for (const key of editableProperties) {
                const currentValue: UpdateUserDto[typeof key] = formValues[key];
                let originalComparableValue: any;

                switch (key) {
                    case "levelId":
                        originalComparableValue = levels.find(
                            (l) => l.name === originalUser.levelName
                        )?.id;
                        break;
                    case "positionId":
                        originalComparableValue = positions.find(
                            (p) => p.name === originalUser.positionName
                        )?.id;
                        break;
                    case "roleIds":
                        originalComparableValue = originalUser.roles?.map(role => role.id) || [];
                        // Compare arrays
                        if (Array.isArray(currentValue) && Array.isArray(originalComparableValue)) {
                            const sortedCurrent = [...currentValue].sort();
                            const sortedOriginal = [...originalComparableValue].sort();
                            if (JSON.stringify(sortedCurrent) !== JSON.stringify(sortedOriginal)) {
                                (changedFields as any)[key] = currentValue;
                            }
                        }
                        continue;
                    case "phoneNumber":
                        originalComparableValue = originalUser.phoneNumber;
                        break;
                    default:
                        originalComparableValue = originalUser[key as keyof UserDto];
                        break;
                }

                if (currentValue !== originalComparableValue) {
                    (changedFields as any)[key] = currentValue;
                }
            }

            if (Object.keys(changedFields).length === 0) {
                toast.info("No changes detected.");
                setIsEditUserOpen(false);
                setSelectedUser(null);
                return;
            }

            const payload: Partial<UpdateUserDto> = {
                id: originalUser.id,
                ...changedFields,
            };

            Object.keys(payload).forEach((k) => {
                const key = k as keyof Partial<UpdateUserDto>;
                if (payload[key] === undefined) {
                    delete payload[key];
                }
            });

            if (Object.keys(payload).length <= 1 && "id" in payload) {
                toast.info("No effective changes to update.");
                setIsEditUserOpen(false);
                setSelectedUser(null);
                return;
            }

            const updatedUser = await apiClient.users.update(payload as UpdateUserDto);
            setUsers((prevUsers) =>
                prevUsers
                    .map((u) => (u.id === updatedUser.id ? updatedUser : u))
                    .sort((a, b) => a.username.localeCompare(b.username))
            );
            toast.success("User updated successfully!");
            setIsEditUserOpen(false);
            setSelectedUser(null);
        } catch (error: any) {
            toast.error(`Failed to update user: ${error.message || "Unknown error"}`);
            console.error("Update user error:", error);
        }
    };

    const openDeleteDialog = (user: UserDto) => {
        setSelectedUser(user);
        setIsDeleteUserOpen(true);
    };

    const handleDeleteUser = async () => {
        if (!selectedUser) return;
        try {
            await apiClient.users.delete(selectedUser.id);
            setUsers((prevUsers) => prevUsers.filter((u) => u.id !== selectedUser.id));
            toast.success("User deleted successfully!");
            setIsDeleteUserOpen(false);
            setSelectedUser(null);
            if (paginatedUsers.length === 1 && currentPage > 1 && filteredUsers.length - 1 > 0) {
                setCurrentPage(currentPage - 1);
            } else if (
                paginatedUsers.length === 1 &&
                currentPage === 1 &&
                filteredUsers.length - 1 === 0
            ) {
                setCurrentPage(1);
            }
        } catch (error: any) {
            toast.error(`Failed to delete user: ${error.message || "Unknown error"}`);
            console.error("Delete user error:", error);
        }
    };

    if (isLoading && users.length === 0) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!hasPermission("manage_user")) {
        return (
            <div className="py-12 text-center">
                <UserCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h2 className="text-2xl font-bold mb-2">Access Restricted</h2>
                <p className="text-muted-foreground">You don't have permission to manage users</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
                <p className="text-muted-foreground">Manage user accounts</p>
            </div>

            <Card>
                <CardHeader className="pb-3">
                    <CardTitle>Users</CardTitle>
                    <CardDescription>Manage user accounts and permissions</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col sm:flex-row gap-4 mb-6 justify-between">
                        <div className="relative w-full sm:w-1/3">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search users..."
                                className="pl-8"
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    setCurrentPage(1);
                                }}
                            />
                        </div>
                        <Button
                            onClick={() => setIsAddUserOpen(true)}
                            className="w-full sm:w-auto gap-1.5"
                        >
                            <Plus className="h-4 w-4" />
                            Add User
                        </Button>
                    </div>

                    {isLoading && users.length > 0 && (
                        <div className="flex items-center justify-center py-4">
                            <p className="text-sm text-muted-foreground">Loading users...</p>
                        </div>
                    )}
                    {!isLoading && paginatedUsers.length === 0 && (
                        <div className="text-center text-muted-foreground py-8">
                            {searchTerm ? "No users match your search." : "No users found."}
                        </div>
                    )}
                    {paginatedUsers.length > 0 && (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Username</TableHead>
                                    <TableHead>Full Name</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>University ID</TableHead>
                                    <TableHead>Level</TableHead>
                                    <TableHead>Position</TableHead>
                                    <TableHead className="text-center">Enabled</TableHead>
                                    <TableHead className="text-center">Can Drive</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {paginatedUsers.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell className="font-medium">
                                            <div className="flex items-center gap-2">
                                                <UserCircle
                                                    size={18}
                                                    className="text-muted-foreground"
                                                />{" "}
                                                {user.username}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {user.firstName} {user.lastName}
                                        </TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>{user.universityId}</TableCell>
                                        <TableCell>{user.levelName || "N/A"}</TableCell>
                                        <TableCell>{user.positionName || "N/A"}</TableCell>
                                        <TableCell className="text-center">
                                            {user.enabled ? (
                                                <CheckSquare
                                                    size={18}
                                                    className="text-green-500 mx-auto"
                                                />
                                            ) : (
                                                <XSquare
                                                    size={18}
                                                    className="text-red-500 mx-auto"
                                                />
                                            )}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            {user.canDrive ? (
                                                <CheckSquare
                                                    size={18}
                                                    className="text-green-500 mx-auto"
                                                />
                                            ) : (
                                                <XSquare
                                                    size={18}
                                                    className="text-red-500 mx-auto"
                                                />
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right space-x-2">
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                onClick={() => openEditDialog(user)}
                                                disabled={isLoading}
                                            >
                                                <Edit2 className="h-4 w-4" />
                                                <span className="sr-only">Edit User</span>
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-end space-x-2 py-4">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                                disabled={currentPage === 1 || isLoading}
                            >
                                Previous
                            </Button>
                            <span className="text-sm text-muted-foreground">
                                Page {currentPage} of {totalPages}
                            </span>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                    setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                                }
                                disabled={currentPage === totalPages || isLoading}
                            >
                                Next
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>

            <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
                <DialogContent className="sm:max-w-[625px] max-h-[95vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Add New User</DialogTitle>
                        <DialogDescription>
                            Fill in the details below to create a new user account.
                        </DialogDescription>
                    </DialogHeader>
                    <UserFormFields
                        isEdit={false}
                        formState={newUser}
                        handleInputChange={handleInputChange}
                        handleCheckboxChange={handleCheckboxChange}
                        handleSelectChange={handleSelectChange}
                        handleRoleChange={handleRoleChange}
                        levels={levels}
                        positions={positions}
                    />
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" variant="outline">
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button type="submit" onClick={handleAddUser}>
                            Add User
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={isEditUserOpen} onOpenChange={setIsEditUserOpen}>
                <DialogContent className="sm:max-w-[625px] max-h-[95vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Edit User: {selectedUser?.username}</DialogTitle>
                        <DialogDescription>
                            Update the details for this user account.
                        </DialogDescription>
                    </DialogHeader>
                    <UserFormFields
                        isEdit={true}
                        formState={editUser}
                        handleInputChange={handleInputChange}
                        handleCheckboxChange={handleCheckboxChange}
                        handleSelectChange={handleSelectChange}
                        handleRoleChange={handleRoleChange}
                        levels={levels}
                        positions={positions}
                    />
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" variant="outline">
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button type="submit" onClick={handleUpdateUser}>
                            Save Changes
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={isDeleteUserOpen} onOpenChange={setIsDeleteUserOpen}>
                <DialogContent className="sm:max-w-[425px] max-h-[95vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Delete User: {selectedUser?.username}</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this user? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" variant="outline">
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button type="button" variant="destructive" onClick={handleDeleteUser}>
                            Delete User
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
