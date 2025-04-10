
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth, User, UserRole, AVAILABLE_ROLES, MOCK_COLLEGES, MOCK_INSTITUTES, MOCK_CAMPUSES } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Search, Plus, Edit2, Trash2, User as UserIcon, Mail, Building, MapPin, UserCheck } from "lucide-react";

export default function ManageUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isEditUserOpen, setIsEditUserOpen] = useState(false);
  const [isDeleteUserOpen, setIsDeleteUserOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [collegeId, setCollegeId] = useState<string>("");
  const [instituteId, setInstituteId] = useState<string>("");
  const [currentTab, setCurrentTab] = useState<string>("active");

  const { hasPermission } = useAuth();

  // New user form state
  const [newUser, setNewUser] = useState({
    username: "",
    fullName: "",
    password: "",
    confirmPassword: "",
    role: "" as UserRole,
    email: "",
    college: "",
    institute: "",
    campus: ""
  });

  // Load users on component mount
  useEffect(() => {
    // This would be an API call in a real app
    // Mock data for now
    const mockUsers: User[] = [
      {
        id: "1",
        username: "transport_director",
        fullName: "Transport Director",
        role: "transport_director",
        email: "transport.director@aau.edu.et",
        college: "College of Natural and Social Sciences",
        institute: "Institute of Technology",
        campus: "Main Campus"
      },
      {
        id: "2",
        username: "operational_director",
        fullName: "Operational Director",
        role: "operational_director",
        email: "operational.director@aau.edu.et",
        college: "College of Natural and Social Sciences",
        institute: "Institute of Technology",
        campus: "Main Campus"
      },
      {
        id: "3",
        username: "fotl_user",
        fullName: "FOTL User",
        role: "fotl",
        email: "fotl@aau.edu.et",
        college: "College of Business and Economics",
        institute: "Institute of Management",
        campus: "Commerce Campus"
      },
      {
        id: "4",
        username: "ftl_user",
        fullName: "FTL User",
        role: "ftl",
        email: "ftl@aau.edu.et",
        college: "College of Health Sciences",
        institute: "Institute of Medicine",
        campus: "Black Lion Campus"
      }
    ];
    setUsers(mockUsers);
  }, []);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewUser({ ...newUser, [name]: value });
  };

  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setNewUser({ ...newUser, [name]: value });

    // Reset dependent fields when parent field changes
    if (name === "college") {
      setCollegeId(value);
      setNewUser({ ...newUser, college: value, institute: "", campus: "" });
      setInstituteId("");
    } else if (name === "institute") {
      setInstituteId(value);
      setNewUser({ ...newUser, institute: value, campus: "" });
    }
  };

  // Filter users based on search term and current tab
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (currentTab === "active") {
      return matchesSearch;
    } else if (currentTab === "transport_director") {
      return matchesSearch && user.role === "transport_director";
    } else if (currentTab === "operational_director") {
      return matchesSearch && user.role === "operational_director";
    } else if (currentTab === "fotl") {
      return matchesSearch && user.role === "fotl";
    } else if (currentTab === "ftl") {
      return matchesSearch && user.role === "ftl";
    }
    return matchesSearch;
  });

  // Add new user
  const handleAddUser = () => {
    // Validate form
    if (!newUser.username || !newUser.fullName || !newUser.role || !newUser.password) {
      toast.error("Please fill all required fields");
      return;
    }
    
    if (newUser.password !== newUser.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    // In a real application, this would be an API call
    const newUserObj: User = {
      id: `${users.length + 1}`,
      username: newUser.username,
      fullName: newUser.fullName,
      role: newUser.role,
      email: newUser.email,
      college: newUser.college,
      institute: newUser.institute,
      campus: newUser.campus
    };

    setUsers([...users, newUserObj]);
    toast.success("User added successfully");
    setIsAddUserOpen(false);
    
    // Reset form
    setNewUser({
      username: "",
      fullName: "",
      password: "",
      confirmPassword: "",
      role: "" as UserRole,
      email: "",
      college: "",
      institute: "",
      campus: ""
    });
    setCollegeId("");
    setInstituteId("");
  };

  // Edit user
  const handleEditUser = () => {
    if (!selectedUser) return;
    
    // In a real application, this would be an API call
    const updatedUsers = users.map(user => 
      user.id === selectedUser.id ? selectedUser : user
    );
    
    setUsers(updatedUsers);
    toast.success("User updated successfully");
    setIsEditUserOpen(false);
    setSelectedUser(null);
  };

  // Delete user
  const handleDeleteUser = () => {
    if (!selectedUser) return;
    
    // In a real application, this would be an API call
    const updatedUsers = users.filter(user => user.id !== selectedUser.id);
    
    setUsers(updatedUsers);
    toast.success("User deleted successfully");
    setIsDeleteUserOpen(false);
    setSelectedUser(null);
  };

  // Open edit dialog
  const openEditDialog = (user: User) => {
    setSelectedUser(user);
    
    // Set dependent field IDs for select components
    const college = MOCK_COLLEGES.find(c => c.name === user.college);
    if (college) {
      setCollegeId(college.id);
    }
    
    const institute = MOCK_INSTITUTES.find(i => i.name === user.institute);
    if (institute) {
      setInstituteId(institute.id);
    }
    
    setIsEditUserOpen(true);
  };

  // Open delete dialog
  const openDeleteDialog = (user: User) => {
    setSelectedUser(user);
    setIsDeleteUserOpen(true);
  };

  // Format role for display
  const formatRole = (role: UserRole) => {
    return role.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  };

  if (!hasPermission("add_users")) {
    return (
      <div className="py-12 text-center">
        <UserIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
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
          <CardDescription>
            Manage user accounts and permissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6 justify-between">
            <div className="relative w-full sm:w-1/3">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
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

          <Tabs onValueChange={setCurrentTab} defaultValue="active">
            <TabsList className="mb-4 w-full max-w-md">
              <TabsTrigger value="active" className="flex-1">All Users</TabsTrigger>
              <TabsTrigger value="transport_director" className="flex-1">Directors</TabsTrigger>
              <TabsTrigger value="fotl" className="flex-1">FOTL</TabsTrigger>
              <TabsTrigger value="ftl" className="flex-1">FTL</TabsTrigger>
            </TabsList>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead className="hidden md:table-cell">Username</TableHead>
                    <TableHead className="hidden lg:table-cell">Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead className="hidden lg:table-cell">College</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.fullName}</TableCell>
                        <TableCell className="hidden md:table-cell">{user.username}</TableCell>
                        <TableCell className="hidden lg:table-cell">{user.email}</TableCell>
                        <TableCell>
                          <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-primary/10 text-primary">
                            {formatRole(user.role)}
                          </span>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">{user.college}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => openEditDialog(user)}
                            >
                              <Edit2 className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => openDeleteDialog(user)}
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
                        No users found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </Tabs>
        </CardContent>
      </Card>

      {/* Add User Dialog */}
      <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
        <DialogContent className="sm:max-w-md md:max-w-lg">
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>
              Create a new user account. All fields marked with * are required.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">
                  Full Name <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <UserIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="fullName"
                    name="fullName"
                    placeholder="John Doe"
                    value={newUser.fullName}
                    onChange={handleInputChange}
                    className="pl-8"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="username">
                  Username <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="username"
                  name="username"
                  placeholder="john.doe"
                  value={newUser.username}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="john.doe@aau.edu.et"
                  value={newUser.email}
                  onChange={handleInputChange}
                  className="pl-8"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="password">
                  Password <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={newUser.password}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">
                  Confirm Password <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={newUser.confirmPassword}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="role">
                User Role <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <UserCheck className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Select 
                  value={newUser.role} 
                  onValueChange={(value) => handleSelectChange("role", value)}
                >
                  <SelectTrigger className="pl-8">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    {AVAILABLE_ROLES.map((role) => (
                      <SelectItem key={role} value={role}>
                        {formatRole(role)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="college">College/Faculty</Label>
              <div className="relative">
                <Building className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Select 
                  value={collegeId} 
                  onValueChange={(value) => handleSelectChange("college", value)}
                >
                  <SelectTrigger className="pl-8">
                    <SelectValue placeholder="Select a college" />
                  </SelectTrigger>
                  <SelectContent>
                    {MOCK_COLLEGES.map((college) => (
                      <SelectItem key={college.id} value={college.id}>
                        {college.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="institute">Institute</Label>
                <Select 
                  value={instituteId} 
                  onValueChange={(value) => handleSelectChange("institute", value)}
                  disabled={!collegeId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select an institute" />
                  </SelectTrigger>
                  <SelectContent>
                    {MOCK_INSTITUTES
                      .filter(institute => institute.collegeId === collegeId)
                      .map((institute) => (
                        <SelectItem key={institute.id} value={institute.id}>
                          {institute.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="campus">Campus</Label>
                <div className="relative">
                  <MapPin className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Select 
                    value={newUser.campus} 
                    onValueChange={(value) => handleSelectChange("campus", value)}
                    disabled={!instituteId}
                  >
                    <SelectTrigger className="pl-8">
                      <SelectValue placeholder="Select a campus" />
                    </SelectTrigger>
                    <SelectContent>
                      {MOCK_CAMPUSES
                        .filter(campus => campus.instituteId === instituteId)
                        .map((campus) => (
                          <SelectItem key={campus.id} value={campus.id}>
                            {campus.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddUserOpen(false)}>Cancel</Button>
            <Button onClick={handleAddUser}>Create User</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={isEditUserOpen} onOpenChange={setIsEditUserOpen}>
        <DialogContent className="sm:max-w-md md:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update user information for {selectedUser?.fullName}
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-fullName">Full Name</Label>
                  <Input
                    id="edit-fullName"
                    value={selectedUser.fullName}
                    onChange={(e) => setSelectedUser({...selectedUser, fullName: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-username">Username</Label>
                  <Input
                    id="edit-username"
                    value={selectedUser.username}
                    onChange={(e) => setSelectedUser({...selectedUser, username: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-email">Email Address</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={selectedUser.email || ""}
                  onChange={(e) => setSelectedUser({...selectedUser, email: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-role">User Role</Label>
                <Select 
                  value={selectedUser.role} 
                  onValueChange={(value: UserRole) => setSelectedUser({...selectedUser, role: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    {AVAILABLE_ROLES.map((role) => (
                      <SelectItem key={role} value={role}>
                        {formatRole(role)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-college">College/Faculty</Label>
                <Select 
                  value={collegeId}
                  onValueChange={(value) => {
                    setCollegeId(value);
                    const college = MOCK_COLLEGES.find(c => c.id === value);
                    setSelectedUser({...selectedUser, college: college ? college.name : ""});
                    setInstituteId("");
                    setSelectedUser(prev => ({...prev!, institute: "", campus: ""}));
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a college" />
                  </SelectTrigger>
                  <SelectContent>
                    {MOCK_COLLEGES.map((college) => (
                      <SelectItem key={college.id} value={college.id}>
                        {college.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-institute">Institute</Label>
                  <Select 
                    value={instituteId}
                    onValueChange={(value) => {
                      setInstituteId(value);
                      const institute = MOCK_INSTITUTES.find(i => i.id === value);
                      setSelectedUser({...selectedUser, institute: institute ? institute.name : ""});
                      setSelectedUser(prev => ({...prev!, campus: ""}));
                    }}
                    disabled={!collegeId}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select an institute" />
                    </SelectTrigger>
                    <SelectContent>
                      {MOCK_INSTITUTES
                        .filter(institute => institute.collegeId === collegeId)
                        .map((institute) => (
                          <SelectItem key={institute.id} value={institute.id}>
                            {institute.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-campus">Campus</Label>
                  <Select 
                    value={selectedUser.campus || ""}
                    onValueChange={(value) => setSelectedUser({...selectedUser, campus: value})}
                    disabled={!instituteId}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a campus" />
                    </SelectTrigger>
                    <SelectContent>
                      {MOCK_CAMPUSES
                        .filter(campus => campus.instituteId === instituteId)
                        .map((campus) => (
                          <SelectItem key={campus.id} value={campus.id}>
                            {campus.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditUserOpen(false)}>Cancel</Button>
            <Button onClick={handleEditUser}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete User Dialog */}
      <Dialog open={isDeleteUserOpen} onOpenChange={setIsDeleteUserOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the user account for {selectedUser?.fullName}?
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteUserOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteUser}>Delete User</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
