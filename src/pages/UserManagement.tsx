import { useState, useEffect, useMemo, useCallback, memo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, Users, Briefcase, Edit2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import PositionsManagement from "./PositionsManagement";
import { apiClient } from "@/lib/apiClient";
import { UserDto, CreateUserDto, UpdateUserDto, Gender } from "@/types/user";
import { Level } from "@/types/level";
import { Position } from "@/types/position";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { ROLE_DETAILS } from "@/lib/jwtUtils";

// --- UserFormFields inline (copy of ManageUsers.tsx) ---
interface UserFormFieldsProps {
  isEdit?: boolean;
  formState: Partial<CreateUserDto> | Partial<UpdateUserDto>;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>, formType: "new" | "edit") => void;
  handleCheckboxChange: (name: string, checked: boolean, formType: "new" | "edit") => void;
  handleSelectChange: (name: string, value: string, formType: "new" | "edit") => void;
  levels: Level[];
  positions: Position[];
}

const UserFormFields: React.FC<UserFormFieldsProps> = memo(
  ({
    isEdit = false,
    formState,
    handleInputChange: parentHandleInputChange,
    handleCheckboxChange: parentHandleCheckboxChange,
    handleSelectChange: parentHandleSelectChange,
    levels,
    positions,
  }) => {
    const formType = isEdit ? "edit" : "new";

    const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement>) =>
      parentHandleInputChange(e, formType);
    const handleSelectFieldChange = (name: string, value: string) =>
      parentHandleSelectChange(name, value, formType);
    const handleCheckBoxFieldChange = (name: string, checked: boolean) =>
      parentHandleCheckboxChange(name, checked, formType);

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
      </div>
    );
  }
);
UserFormFields.displayName = "UserFormFields";

// Dynamically generate role options from ROLE_DETAILS
const allRoles = Object.values(ROLE_DETAILS).map((role) => ({
  value: role.name,
  label: role.name,
}));

const roleOptions = [
  { value: "all", label: "All Roles" },
  ...allRoles,
];

const ITEMS_PER_PAGE = 12;

const UserManagement = () => {
  const [activeTab, setActiveTab] = useState("users");
  const [searchText, setSearchText] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [users, setUsers] = useState<UserDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  // Add logic for add/edit modals and form states
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isEditUserOpen, setIsEditUserOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserDto | null>(null);

  // For positions and org levels
  const [levels, setLevels] = useState<Level[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);

  // User form states
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
  });
  const [editUser, setEditUser] = useState<Partial<UpdateUserDto>>({});

  useEffect(() => {
    fetchUsers();
    fetchLevels();
    fetchPositions();
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const fetchedUsers = await apiClient.users.getAll();
      setUsers(fetchedUsers || []);
    } catch (error) {
      toast.error("Error loading users");
      setUsers([]);
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

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>, formType: "new" | "edit") => {
      const { name, value } = e.target;
      if (formType === "new") {
        setNewUser((prev) => ({ ...prev, [name]: value }));
      } else {
        setEditUser((prev) => ({ ...prev, [name]: value }));
      }
    },
    []
  );

  const handleCheckboxChange = useCallback(
    (name: string, checked: boolean, formType: "new" | "edit") => {
      if (formType === "new") {
        setNewUser((prev) => ({ ...prev, [name]: checked }));
      } else {
        setEditUser((prev) => ({ ...prev, [name]: checked }));
      }
    },
    []
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
    []
  );

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        user.firstName?.toLowerCase().includes(searchText.toLowerCase()) ||
        user.lastName?.toLowerCase().includes(searchText.toLowerCase()) ||
        user.username?.toLowerCase().includes(searchText.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchText.toLowerCase());
      const matchesRole =
        roleFilter === "all" ||
        user.roles?.some((roleObj) =>
          roleObj.name?.toLowerCase().includes(roleFilter.toLowerCase())
        );
      return matchesSearch && matchesRole;
    });
  }, [users, searchText, roleFilter]);

  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredUsers.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredUsers, currentPage]);

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / ITEMS_PER_PAGE));

  // Modal logic for Add
  const handleAddUser = async () => {
    if (
      !newUser.username ||
      !newUser.password ||
      !newUser.firstName ||
      !newUser.lastName ||
      !newUser.email ||
      !newUser.universityId
    ) {
      toast.error(
        "Please fill all required fields: Username, Password, First Name, Last Name, Email, University ID."
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

    try {
      const changedFields: Partial<UpdateUserDto> = {};
      const formValues = editUser;
      const originalUser = selectedUser;

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

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground">
            Manage users and positions in the system
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 max-w-[400px]">
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Users
          </TabsTrigger>
          <TabsTrigger value="positions" className="flex items-center gap-2">
            <Briefcase className="h-4 w-4" />
            Positions
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                      placeholder="Search users..."
                      className="pl-9"
                      value={searchText}
                      onChange={(e) => {
                        setSearchText(e.target.value);
                        setCurrentPage(1);
                      }}
                    />
                  </div>
                </div>
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Filter by role" />
                  </SelectTrigger>
                  <SelectContent>
                    {roleOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button onClick={() => setIsAddUserOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add User
                </Button>
              </div>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Username</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Roles</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center h-24 text-muted-foreground">
                          Loading...
                        </TableCell>
                      </TableRow>
                    ) : paginatedUsers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center h-24 text-muted-foreground">
                          No users found
                        </TableCell>
                      </TableRow>
                    ) : (
                      paginatedUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">
                            {user.firstName} {user.lastName}
                          </TableCell>
                          <TableCell>{user.username}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {user.roles?.map((role) => (
                                <Badge
                                  key={role.id}
                                  variant={getRoleBadgeVariant(role.name) as any}
                                  className="text-xs"
                                >
                                  {role.name}
                                </Badge>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={user.enabled ? "default" : "secondary"}>
                              {user.enabled ? "Active" : "Inactive"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {user.createdAt &&
                              new Date(user.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openEditDialog(user)}
                            >
                              <Edit2 className="h-4 w-4" />
                              Edit
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
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
        </TabsContent>
        <TabsContent value="positions">
          <PositionsManagement />
        </TabsContent>
      </Tabs>

      {/* Add User Modal */}
      <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
        <DialogContent className="sm:max-w-[625px]">
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
      {/* Edit User Modal */}
      <Dialog open={isEditUserOpen} onOpenChange={setIsEditUserOpen}>
        <DialogContent className="sm:max-w-[625px]">
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
    </div>
  );
};

export default UserManagement;
