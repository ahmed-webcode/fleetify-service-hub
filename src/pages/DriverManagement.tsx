import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Search, Users, FileText, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { useAuth, MOCK_COLLEGES, MOCK_INSTITUTES, MOCK_CAMPUSES } from "@/contexts/AuthContext";

const MOCK_DRIVERS = [
  {
    id: "1",
    name: "Tadesse Bekele",
    gender: "MALE",
    phone: "+251911222333",
    licenseNumber: "ETH-DL-98765",
    universityId: "AAU-DRV-001",
    status: "active",
    collegeId: "1",
    instituteId: "1",
    campusId: "1",
    assignedVehicle: "Toyota Land Cruiser (AAU-3201)"
  },
  {
    id: "2",
    name: "Meron Hailu",
    gender: "FEMALE",
    phone: "+251922333444",
    licenseNumber: "ETH-DL-54321",
    universityId: "AAU-DRV-002",
    status: "active",
    collegeId: "3",
    instituteId: "4",
    campusId: "5",
    assignedVehicle: "Nissan Patrol (AAU-1450)"
  },
  {
    id: "3",
    name: "Solomon Tesfaye",
    gender: "MALE",
    phone: "+251933444555",
    licenseNumber: "ETH-DL-13579",
    universityId: "AAU-DRV-003",
    status: "on_leave",
    collegeId: "2",
    instituteId: "3",
    campusId: "4",
    assignedVehicle: null
  },
  {
    id: "4",
    name: "Hiwot Mengistu",
    gender: "FEMALE",
    phone: "+251944555666",
    licenseNumber: "ETH-DL-24680",
    universityId: "AAU-DRV-004",
    status: "active",
    collegeId: "5",
    instituteId: "6",
    campusId: "7",
    assignedVehicle: "Toyota Corolla (AAU-5214)"
  }
];

const DriverManagement = () => {
  const [driversList, setDriversList] = useState(MOCK_DRIVERS);
  const [searchQuery, setSearchQuery] = useState("");
  const [addDriverOpen, setAddDriverOpen] = useState(false);
  const [selectedCollege, setSelectedCollege] = useState("");
  const [selectedInstitute, setSelectedInstitute] = useState("");
  const [selectedCampus, setSelectedCampus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { hasPermission } = useAuth();

  const canAddDrivers = hasPermission("manage_user");

  const filteredInstitutes = selectedCollege
    ? MOCK_INSTITUTES.filter((inst) => inst.collegeId === selectedCollege)
    : [];

  const filteredCampuses = selectedInstitute
    ? MOCK_CAMPUSES.filter((campus) => campus.instituteId === selectedInstitute)
    : [];

  const filteredDrivers = driversList.filter((driver) =>
    driver.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    driver.licenseNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    driver.universityId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddDriver = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      toast.success("Driver added successfully");
      setAddDriverOpen(false);
    }, 1000);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800 border-green-200">Active</Badge>;
      case "on_leave":
        return <Badge className="bg-amber-100 text-amber-800 border-amber-200">On Leave</Badge>;
      case "unavailable":
        return <Badge className="bg-red-100 text-red-800 border-red-200">Unavailable</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">{status}</Badge>;
    }
  };

  return (
    <>
      <div className="page-container">
        <div className="page-title-container">
          <h1 className="page-title">Driver Management</h1>
          <p className="page-description">Manage driver assignments and performance</p>
        </div>

        <div className="card-uniform">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold">Manage Drivers</h1>
              <p className="text-muted-foreground">
                Add and manage drivers for university vehicles
              </p>
            </div>

            {canAddDrivers && (
              <Button className="gap-2" onClick={() => setAddDriverOpen(true)}>
                <Plus className="h-4 w-4" />
                Add Driver
              </Button>
            )}
          </div>

          <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search drivers by name, license or ID..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <Tabs defaultValue="grid" className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="text-sm text-muted-foreground">
                Showing {filteredDrivers.length} of {driversList.length} drivers
              </div>
              <TabsList>
                <TabsTrigger value="grid" className="gap-2">
                  <div className="grid grid-cols-2 gap-0.5 w-3 h-3">
                    <div className="bg-current rounded-sm"></div>
                    <div className="bg-current rounded-sm"></div>
                    <div className="bg-current rounded-sm"></div>
                    <div className="bg-current rounded-sm"></div>
                  </div>
                  Grid
                </TabsTrigger>
                <TabsTrigger value="list" className="gap-2">
                  <div className="flex flex-col gap-0.5 w-3">
                    <div className="h-0.5 w-full bg-current rounded-sm"></div>
                    <div className="h-0.5 w-full bg-current rounded-sm"></div>
                    <div className="h-0.5 w-full bg-current rounded-sm"></div>
                  </div>
                  List
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="grid" className="animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDrivers.map((driver) => (
                  <Card key={driver.id} className="overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex flex-col space-y-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-lg">{driver.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {driver.universityId}
                            </p>
                          </div>
                          {getStatusBadge(driver.status)}
                        </div>

                        <div className="space-y-2 text-sm">
                          <div className="grid grid-cols-3 gap-1">
                            <span className="text-muted-foreground">License:</span>
                            <span className="col-span-2 font-medium">{driver.licenseNumber}</span>
                          </div>
                          <div className="grid grid-cols-3 gap-1">
                            <span className="text-muted-foreground">Contact:</span>
                            <span className="col-span-2 font-medium">{driver.phone}</span>
                          </div>
                          <div className="grid grid-cols-3 gap-1">
                            <span className="text-muted-foreground">
                              Vehicle:
                            </span>
                            <span className="col-span-2 font-medium">
                              {driver.assignedVehicle || "None assigned"}
                            </span>
                          </div>
                        </div>

                        <div className="flex justify-end pt-2">
                          <Button variant="outline" size="sm">
                            Details
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="list" className="animate-fade-in">
              <div className="rounded-lg border border-border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>University ID</TableHead>
                      <TableHead>License Number</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Assigned Vehicle</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDrivers.map((driver) => (
                      <TableRow key={driver.id}>
                        <TableCell className="font-medium">{driver.name}</TableCell>
                        <TableCell>{driver.universityId}</TableCell>
                        <TableCell>{driver.licenseNumber}</TableCell>
                        <TableCell>{driver.phone}</TableCell>
                        <TableCell>
                          {driver.assignedVehicle || <span className="text-muted-foreground">None assigned</span>}
                        </TableCell>
                        <TableCell>{getStatusBadge(driver.status)}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>

          <Dialog open={addDriverOpen} onOpenChange={setAddDriverOpen}>
            <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Driver</DialogTitle>
              </DialogHeader>

              <form onSubmit={handleAddDriver} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" placeholder="Enter full name" required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    <Select required>
                      <SelectTrigger id="gender">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MALE">Male</SelectItem>
                        <SelectItem value="FEMALE">Female</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" placeholder="+251..." required />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="universityId">University ID</Label>
                    <Input id="universityId" placeholder="e.g. AAU-DRV-XXX" required />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="drivingLicense">Driving License Number</Label>
                  <Input
                    id="drivingLicense"
                    placeholder="Enter driving license number"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Location Assignment</Label>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="college">College</Label>
                      <Select
                        value={selectedCollege}
                        onValueChange={setSelectedCollege}
                      >
                        <SelectTrigger id="college">
                          <SelectValue placeholder="Select college" />
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

                    {selectedCollege && (
                      <div className="space-y-2">
                        <Label htmlFor="institute">Institute</Label>
                        <Select
                          value={selectedInstitute}
                          onValueChange={setSelectedInstitute}
                        >
                          <SelectTrigger id="institute">
                            <SelectValue placeholder="Select institute" />
                          </SelectTrigger>
                          <SelectContent>
                            {filteredInstitutes.map((institute) => (
                              <SelectItem key={institute.id} value={institute.id}>
                                {institute.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    {selectedInstitute && (
                      <div className="space-y-2">
                        <Label htmlFor="campus">Campus</Label>
                        <Select
                          value={selectedCampus}
                          onValueChange={setSelectedCampus}
                        >
                          <SelectTrigger id="campus">
                            <SelectValue placeholder="Select campus" />
                          </SelectTrigger>
                          <SelectContent>
                            {filteredCampuses.map((campus) => (
                              <SelectItem key={campus.id} value={campus.id}>
                                {campus.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>
                </div>

                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setAddDriverOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Adding..." : "Add Driver"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </>
  );
};

export default DriverManagement;
