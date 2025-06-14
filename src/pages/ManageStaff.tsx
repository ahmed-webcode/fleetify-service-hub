import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Plus, Search, Users, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth, MOCK_COLLEGES, MOCK_INSTITUTES, MOCK_CAMPUSES } from '@/contexts/AuthContext';

// Mock staff data
const MOCK_STAFF = [
  {
    id: "1",
    name: "Dr. Abebe Bekele",
    gender: "MALE",
    department: "Technology Institute",
    phone: "+251911234567",
    position: "Dean",
    drivingLicense: "ETH-DL-12345",
    collegeId: "1",
    instituteId: "1",
    campusId: "1",
  },
  {
    id: "2",
    name: "Prof. Sara Mohammed",
    gender: "FEMALE",
    department: "College of Health Sciences",
    phone: "+251922345678",
    position: "Department Head",
    drivingLicense: "ETH-DL-23456",
    collegeId: "3",
    instituteId: "4",
    campusId: "5",
  },
  {
    id: "3",
    name: "Mr. Dawit Haile",
    gender: "MALE",
    department: "Administrative Services",
    phone: "+251933456789",
    position: "Administrative Director",
    drivingLicense: "",
    collegeId: "2",
    instituteId: "3",
    campusId: "4",
  },
];

// Mock positions
const POSITIONS = [
  { id: "1", name: "Dean", fuelQuota: 200 },
  { id: "2", name: "Vice Dean", fuelQuota: 150 },
  { id: "3", name: "Department Head", fuelQuota: 100 },
  { id: "4", name: "Administrative Director", fuelQuota: 120 },
  { id: "5", name: "Professor", fuelQuota: 80 },
  { id: "6", name: "Associate Professor", fuelQuota: 70 },
  { id: "7", name: "Assistant Professor", fuelQuota: 60 },
  { id: "8", name: "Lecturer", fuelQuota: 50 },
];

const ManageStaff = () => {
  const [staffList, setStaffList] = useState(MOCK_STAFF);
  const [searchQuery, setSearchQuery] = useState("");
  const [addStaffOpen, setAddStaffOpen] = useState(false);
  const [selectedCollege, setSelectedCollege] = useState("");
  const [selectedInstitute, setSelectedInstitute] = useState("");
  const [selectedCampus, setSelectedCampus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { hasPermission } = useAuth();

  const canAddStaff = hasPermission("add_users");

  // Filter institutes based on selected college
  const filteredInstitutes = selectedCollege
    ? MOCK_INSTITUTES.filter((inst) => inst.collegeId === selectedCollege)
    : [];

  // Filter campuses based on selected institute
  const filteredCampuses = selectedInstitute
    ? MOCK_CAMPUSES.filter((campus) => campus.instituteId === selectedInstitute)
    : [];

  // Filter staff based on search query
  const filteredStaff = staffList.filter((staff) =>
    staff.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddStaff = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success("Staff member added successfully");
      setAddStaffOpen(false);
    }, 1000);
  };

  return (
    <>
      <div className="page-container">
        <div className="page-title-container">
          <h1 className="page-title">Staff Management</h1>
          <p className="page-description">Manage transportation department staff</p>
        </div>

        <div className="card-uniform">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold">Manage Staff</h1>
              <p className="text-muted-foreground">
                Add and manage staff records for the system
              </p>
            </div>

            {canAddStaff && (
              <Button className="gap-2" onClick={() => setAddStaffOpen(true)}>
                <Plus className="h-4 w-4" />
                Add Staff
              </Button>
            )}
          </div>

          <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search staff..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <Tabs defaultValue="grid" className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="text-sm text-muted-foreground">
                Showing {filteredStaff.length} of {staffList.length} staff members
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
                {filteredStaff.map((staff) => (
                  <Card key={staff.id} className="overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex flex-col space-y-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-lg">{staff.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {staff.position}
                            </p>
                          </div>
                          <Badge variant="outline" className="bg-blue-50 text-blue-800">
                            {staff.gender}
                          </Badge>
                        </div>

                        <div className="space-y-2 text-sm">
                          <div className="grid grid-cols-3 gap-1">
                            <span className="text-muted-foreground">Department:</span>
                            <span className="col-span-2 font-medium">{staff.department}</span>
                          </div>
                          <div className="grid grid-cols-3 gap-1">
                            <span className="text-muted-foreground">Contact:</span>
                            <span className="col-span-2 font-medium">{staff.phone}</span>
                          </div>
                          <div className="grid grid-cols-3 gap-1">
                            <span className="text-muted-foreground">
                              Driving License:
                            </span>
                            <span className="col-span-2 font-medium">
                              {staff.drivingLicense || "N/A"}
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
                      <TableHead>Position</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Driving License</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStaff.map((staff) => (
                      <TableRow key={staff.id}>
                        <TableCell className="font-medium">{staff.name}</TableCell>
                        <TableCell>{staff.position}</TableCell>
                        <TableCell>{staff.department}</TableCell>
                        <TableCell>{staff.phone}</TableCell>
                        <TableCell>
                          {staff.drivingLicense || <span className="text-muted-foreground">N/A</span>}
                        </TableCell>
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

          <Dialog open={addStaffOpen} onOpenChange={setAddStaffOpen}>
            <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Staff Member</DialogTitle>
              </DialogHeader>

              <form onSubmit={handleAddStaff} className="space-y-6">
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

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" placeholder="+251..." required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="drivingLicense">Driving License (Optional)</Label>
                  <Input
                    id="drivingLicense"
                    placeholder="Enter driving license number"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="position">Position</Label>
                    <Select required>
                      <SelectTrigger id="position">
                        <SelectValue placeholder="Select position" />
                      </SelectTrigger>
                      <SelectContent>
                        {POSITIONS.map((position) => (
                          <SelectItem key={position.id} value={position.id}>
                            {position.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Location Information</Label>
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
                    onClick={() => setAddStaffOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Adding..." : "Add Staff"}
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

export default ManageStaff;
