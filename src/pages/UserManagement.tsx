
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, Filter, Users, Briefcase } from "lucide-react";
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

// Mock data for demonstration
const mockUsers = [
  {
    id: 1,
    username: "admin",
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@university.edu",
    roles: ["Transport Director"],
    enabled: true,
    createdAt: "2024-01-15",
  },
  {
    id: 2,
    username: "driver1",
    firstName: "Jane",
    lastName: "Smith",
    email: "jane.smith@university.edu",
    roles: ["Driver"],
    enabled: true,
    createdAt: "2024-02-20",
  },
  {
    id: 3,
    username: "staff1",
    firstName: "Bob",
    lastName: "Johnson",
    email: "bob.johnson@university.edu",
    roles: ["Staff"],
    enabled: false,
    createdAt: "2024-03-10",
  },
];

const UserManagement = () => {
  const [activeTab, setActiveTab] = useState("users");
  const [searchText, setSearchText] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [users] = useState(mockUsers);

  const filteredUsers = users.filter((user) => {
    const matchesSearch = 
      user.firstName.toLowerCase().includes(searchText.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchText.toLowerCase()) ||
      user.username.toLowerCase().includes(searchText.toLowerCase()) ||
      user.email.toLowerCase().includes(searchText.toLowerCase());

    const matchesRole = roleFilter === "all" || 
      user.roles.some(role => role.toLowerCase().includes(roleFilter.toLowerCase()));

    return matchesSearch && matchesRole;
  });

  const getRoleBadgeVariant = (role: string) => {
    switch (role.toLowerCase()) {
      case "transport director":
        return "default";
      case "driver":
        return "secondary";
      case "staff":
        return "outline";
      default:
        return "outline";
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
                      onChange={(e) => setSearchText(e.target.value)}
                    />
                  </div>
                </div>
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Filter by role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="transport director">Transport Director</SelectItem>
                    <SelectItem value="driver">Driver</SelectItem>
                    <SelectItem value="staff">Staff</SelectItem>
                    <SelectItem value="fuel manager">Fuel Manager</SelectItem>
                    <SelectItem value="maintenance manager">Maintenance Manager</SelectItem>
                  </SelectContent>
                </Select>
                <Button>
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
                    {filteredUsers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center h-24 text-muted-foreground">
                          No users found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">
                            {user.firstName} {user.lastName}
                          </TableCell>
                          <TableCell>{user.username}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {user.roles.map((role) => (
                                <Badge
                                  key={role}
                                  variant={getRoleBadgeVariant(role) as any}
                                  className="text-xs"
                                >
                                  {role}
                                </Badge>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={user.enabled ? "default" : "secondary"}>
                              {user.enabled ? "Active" : "Inactive"}
                            </Badge>
                          </TableCell>
                          <TableCell>{user.createdAt}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm">
                              Edit
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="positions">
          <PositionsManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserManagement;
