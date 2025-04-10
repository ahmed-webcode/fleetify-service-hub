
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth, College, Institute, Campus, MOCK_COLLEGES, MOCK_INSTITUTES, MOCK_CAMPUSES } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Search, Plus, Edit2, Trash2, Building, Building2, MapPin, User } from "lucide-react";

export default function ManageColleges() {
  const [colleges, setColleges] = useState<College[]>([]);
  const [institutes, setInstitutes] = useState<Institute[]>([]);
  const [campuses, setCampuses] = useState<Campus[]>([]);
  
  const [activeTab, setActiveTab] = useState("colleges");
  const [searchTerm, setSearchTerm] = useState("");
  
  const [isAddCollegeOpen, setIsAddCollegeOpen] = useState(false);
  const [isEditCollegeOpen, setIsEditCollegeOpen] = useState(false);
  const [isDeleteCollegeOpen, setIsDeleteCollegeOpen] = useState(false);
  const [selectedCollege, setSelectedCollege] = useState<College | null>(null);
  
  const [isAddInstituteOpen, setIsAddInstituteOpen] = useState(false);
  const [isEditInstituteOpen, setIsEditInstituteOpen] = useState(false);
  const [isDeleteInstituteOpen, setIsDeleteInstituteOpen] = useState(false);
  const [selectedInstitute, setSelectedInstitute] = useState<Institute | null>(null);
  
  const [isAddCampusOpen, setIsAddCampusOpen] = useState(false);
  const [isEditCampusOpen, setIsEditCampusOpen] = useState(false);
  const [isDeleteCampusOpen, setIsDeleteCampusOpen] = useState(false);
  const [selectedCampus, setSelectedCampus] = useState<Campus | null>(null);
  
  const [newCollege, setNewCollege] = useState({ name: "" });
  const [newInstitute, setNewInstitute] = useState({ name: "", collegeId: "" });
  const [newCampus, setNewCampus] = useState({ name: "", instituteId: "" });
  
  const { hasPermission } = useAuth();

  useEffect(() => {
    // Load initial data (in a real app, this would be API calls)
    setColleges(MOCK_COLLEGES);
    setInstitutes(MOCK_INSTITUTES);
    setCampuses(MOCK_CAMPUSES);
  }, []);

  // Filter data based on search term
  const filteredColleges = colleges.filter(college => 
    college.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const filteredInstitutes = institutes.filter(institute => 
    institute.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const filteredCampuses = campuses.filter(campus => 
    campus.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // College handlers
  const handleAddCollege = () => {
    if (!newCollege.name) {
      toast.error("College name is required");
      return;
    }
    
    const newCollegeObj: College = {
      id: `${Date.now()}`,
      name: newCollege.name
    };
    
    setColleges([...colleges, newCollegeObj]);
    toast.success("College added successfully");
    setIsAddCollegeOpen(false);
    setNewCollege({ name: "" });
  };
  
  const handleEditCollege = () => {
    if (!selectedCollege) return;
    
    const updatedColleges = colleges.map(college => 
      college.id === selectedCollege.id ? selectedCollege : college
    );
    
    setColleges(updatedColleges);
    toast.success("College updated successfully");
    setIsEditCollegeOpen(false);
    setSelectedCollege(null);
  };
  
  const handleDeleteCollege = () => {
    if (!selectedCollege) return;
    
    // Check if there are related institutes
    const relatedInstitutes = institutes.filter(institute => institute.collegeId === selectedCollege.id);
    if (relatedInstitutes.length > 0) {
      toast.error("Cannot delete college with associated institutes");
      setIsDeleteCollegeOpen(false);
      return;
    }
    
    const updatedColleges = colleges.filter(college => college.id !== selectedCollege.id);
    setColleges(updatedColleges);
    toast.success("College deleted successfully");
    setIsDeleteCollegeOpen(false);
    setSelectedCollege(null);
  };

  // Institute handlers
  const handleAddInstitute = () => {
    if (!newInstitute.name || !newInstitute.collegeId) {
      toast.error("Institute name and college are required");
      return;
    }
    
    const newInstituteObj: Institute = {
      id: `${Date.now()}`,
      name: newInstitute.name,
      collegeId: newInstitute.collegeId
    };
    
    setInstitutes([...institutes, newInstituteObj]);
    toast.success("Institute added successfully");
    setIsAddInstituteOpen(false);
    setNewInstitute({ name: "", collegeId: "" });
  };
  
  const handleEditInstitute = () => {
    if (!selectedInstitute) return;
    
    const updatedInstitutes = institutes.map(institute => 
      institute.id === selectedInstitute.id ? selectedInstitute : institute
    );
    
    setInstitutes(updatedInstitutes);
    toast.success("Institute updated successfully");
    setIsEditInstituteOpen(false);
    setSelectedInstitute(null);
  };
  
  const handleDeleteInstitute = () => {
    if (!selectedInstitute) return;
    
    // Check if there are related campuses
    const relatedCampuses = campuses.filter(campus => campus.instituteId === selectedInstitute.id);
    if (relatedCampuses.length > 0) {
      toast.error("Cannot delete institute with associated campuses");
      setIsDeleteInstituteOpen(false);
      return;
    }
    
    const updatedInstitutes = institutes.filter(institute => institute.id !== selectedInstitute.id);
    setInstitutes(updatedInstitutes);
    toast.success("Institute deleted successfully");
    setIsDeleteInstituteOpen(false);
    setSelectedInstitute(null);
  };

  // Campus handlers
  const handleAddCampus = () => {
    if (!newCampus.name || !newCampus.instituteId) {
      toast.error("Campus name and institute are required");
      return;
    }
    
    const newCampusObj: Campus = {
      id: `${Date.now()}`,
      name: newCampus.name,
      instituteId: newCampus.instituteId
    };
    
    setCampuses([...campuses, newCampusObj]);
    toast.success("Campus added successfully");
    setIsAddCampusOpen(false);
    setNewCampus({ name: "", instituteId: "" });
  };
  
  const handleEditCampus = () => {
    if (!selectedCampus) return;
    
    const updatedCampuses = campuses.map(campus => 
      campus.id === selectedCampus.id ? selectedCampus : campus
    );
    
    setCampuses(updatedCampuses);
    toast.success("Campus updated successfully");
    setIsEditCampusOpen(false);
    setSelectedCampus(null);
  };
  
  const handleDeleteCampus = () => {
    if (!selectedCampus) return;
    
    const updatedCampuses = campuses.filter(campus => campus.id !== selectedCampus.id);
    setCampuses(updatedCampuses);
    toast.success("Campus deleted successfully");
    setIsDeleteCampusOpen(false);
    setSelectedCampus(null);
  };

  // Helper function to get college name from ID
  const getCollegeName = (id: string) => {
    const college = colleges.find(c => c.id === id);
    return college ? college.name : "Unknown";
  };

  // Helper function to get institute name from ID
  const getInstituteName = (id: string) => {
    const institute = institutes.find(i => i.id === id);
    return institute ? institute.name : "Unknown";
  };

  if (!hasPermission("add_users")) {
    return (
      <div className="py-12 text-center">
        <User className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h2 className="text-2xl font-bold mb-2">Access Restricted</h2>
        <p className="text-muted-foreground">You don't have permission to manage organizational structure</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Organizational Structure</h1>
        <p className="text-muted-foreground">Manage colleges, institutes, and campuses</p>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>AAU Academic Structure</CardTitle>
          <CardDescription>
            Manage the organizational hierarchy of the university
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6 justify-between">
            <div className="relative w-full sm:w-1/3">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button 
              onClick={() => {
                if (activeTab === "colleges") setIsAddCollegeOpen(true);
                else if (activeTab === "institutes") setIsAddInstituteOpen(true);
                else setIsAddCampusOpen(true);
              }} 
              className="w-full sm:w-auto gap-1.5"
            >
              <Plus className="h-4 w-4" />
              Add {activeTab.charAt(0).toUpperCase() + activeTab.slice(0, -1)}
            </Button>
          </div>

          <Tabs onValueChange={setActiveTab} defaultValue="colleges">
            <TabsList className="mb-4 w-full max-w-md">
              <TabsTrigger value="colleges" className="flex-1">
                <Building className="h-4 w-4 mr-2" />
                Colleges
              </TabsTrigger>
              <TabsTrigger value="institutes" className="flex-1">
                <Building2 className="h-4 w-4 mr-2" />
                Institutes
              </TabsTrigger>
              <TabsTrigger value="campuses" className="flex-1">
                <MapPin className="h-4 w-4 mr-2" />
                Campuses
              </TabsTrigger>
            </TabsList>

            <TabsContent value="colleges">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>College/Faculty Name</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredColleges.length > 0 ? (
                      filteredColleges.map((college) => (
                        <TableRow key={college.id}>
                          <TableCell className="font-medium">{college.name}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => {
                                  setSelectedCollege(college);
                                  setIsEditCollegeOpen(true);
                                }}
                              >
                                <Edit2 className="h-4 w-4" />
                                <span className="sr-only">Edit</span>
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => {
                                  setSelectedCollege(college);
                                  setIsDeleteCollegeOpen(true);
                                }}
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
                        <TableCell colSpan={2} className="h-24 text-center">
                          No colleges found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            
            <TabsContent value="institutes">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Institute Name</TableHead>
                      <TableHead>College/Faculty</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredInstitutes.length > 0 ? (
                      filteredInstitutes.map((institute) => (
                        <TableRow key={institute.id}>
                          <TableCell className="font-medium">{institute.name}</TableCell>
                          <TableCell>{getCollegeName(institute.collegeId)}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => {
                                  setSelectedInstitute(institute);
                                  setIsEditInstituteOpen(true);
                                }}
                              >
                                <Edit2 className="h-4 w-4" />
                                <span className="sr-only">Edit</span>
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => {
                                  setSelectedInstitute(institute);
                                  setIsDeleteInstituteOpen(true);
                                }}
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
                        <TableCell colSpan={3} className="h-24 text-center">
                          No institutes found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            
            <TabsContent value="campuses">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Campus Name</TableHead>
                      <TableHead>Institute</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCampuses.length > 0 ? (
                      filteredCampuses.map((campus) => (
                        <TableRow key={campus.id}>
                          <TableCell className="font-medium">{campus.name}</TableCell>
                          <TableCell>{getInstituteName(campus.instituteId)}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => {
                                  setSelectedCampus(campus);
                                  setIsEditCampusOpen(true);
                                }}
                              >
                                <Edit2 className="h-4 w-4" />
                                <span className="sr-only">Edit</span>
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => {
                                  setSelectedCampus(campus);
                                  setIsDeleteCampusOpen(true);
                                }}
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
                        <TableCell colSpan={3} className="h-24 text-center">
                          No campuses found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* College Dialogs */}
      {/* Add College Dialog */}
      <Dialog open={isAddCollegeOpen} onOpenChange={setIsAddCollegeOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New College</DialogTitle>
            <DialogDescription>
              Create a new college or faculty
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="college-name">
                College Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="college-name"
                value={newCollege.name}
                onChange={(e) => setNewCollege({ ...newCollege, name: e.target.value })}
                placeholder="Enter college name"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddCollegeOpen(false)}>Cancel</Button>
            <Button onClick={handleAddCollege}>Add College</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit College Dialog */}
      <Dialog open={isEditCollegeOpen} onOpenChange={setIsEditCollegeOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit College</DialogTitle>
            <DialogDescription>
              Update college information
            </DialogDescription>
          </DialogHeader>
          {selectedCollege && (
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-college-name">
                  College Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="edit-college-name"
                  value={selectedCollege.name}
                  onChange={(e) => setSelectedCollege({ ...selectedCollege, name: e.target.value })}
                  placeholder="Enter college name"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditCollegeOpen(false)}>Cancel</Button>
            <Button onClick={handleEditCollege}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete College Dialog */}
      <Dialog open={isDeleteCollegeOpen} onOpenChange={setIsDeleteCollegeOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete College</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedCollege?.name}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteCollegeOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteCollege}>Delete College</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Institute Dialogs */}
      {/* Add Institute Dialog */}
      <Dialog open={isAddInstituteOpen} onOpenChange={setIsAddInstituteOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Institute</DialogTitle>
            <DialogDescription>
              Create a new institute
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="institute-name">
                Institute Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="institute-name"
                value={newInstitute.name}
                onChange={(e) => setNewInstitute({ ...newInstitute, name: e.target.value })}
                placeholder="Enter institute name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="institute-college">
                College <span className="text-destructive">*</span>
              </Label>
              <Select
                value={newInstitute.collegeId}
                onValueChange={(value) => setNewInstitute({ ...newInstitute, collegeId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a college" />
                </SelectTrigger>
                <SelectContent>
                  {colleges.map((college) => (
                    <SelectItem key={college.id} value={college.id}>
                      {college.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddInstituteOpen(false)}>Cancel</Button>
            <Button onClick={handleAddInstitute}>Add Institute</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Institute Dialog */}
      <Dialog open={isEditInstituteOpen} onOpenChange={setIsEditInstituteOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Institute</DialogTitle>
            <DialogDescription>
              Update institute information
            </DialogDescription>
          </DialogHeader>
          {selectedInstitute && (
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-institute-name">
                  Institute Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="edit-institute-name"
                  value={selectedInstitute.name}
                  onChange={(e) => setSelectedInstitute({ ...selectedInstitute, name: e.target.value })}
                  placeholder="Enter institute name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-institute-college">
                  College <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={selectedInstitute.collegeId}
                  onValueChange={(value) => setSelectedInstitute({ ...selectedInstitute, collegeId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a college" />
                  </SelectTrigger>
                  <SelectContent>
                    {colleges.map((college) => (
                      <SelectItem key={college.id} value={college.id}>
                        {college.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditInstituteOpen(false)}>Cancel</Button>
            <Button onClick={handleEditInstitute}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Institute Dialog */}
      <Dialog open={isDeleteInstituteOpen} onOpenChange={setIsDeleteInstituteOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Institute</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedInstitute?.name}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteInstituteOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteInstitute}>Delete Institute</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Campus Dialogs */}
      {/* Add Campus Dialog */}
      <Dialog open={isAddCampusOpen} onOpenChange={setIsAddCampusOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Campus</DialogTitle>
            <DialogDescription>
              Create a new campus
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="campus-name">
                Campus Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="campus-name"
                value={newCampus.name}
                onChange={(e) => setNewCampus({ ...newCampus, name: e.target.value })}
                placeholder="Enter campus name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="campus-institute">
                Institute <span className="text-destructive">*</span>
              </Label>
              <Select
                value={newCampus.instituteId}
                onValueChange={(value) => setNewCampus({ ...newCampus, instituteId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select an institute" />
                </SelectTrigger>
                <SelectContent>
                  {institutes.map((institute) => (
                    <SelectItem key={institute.id} value={institute.id}>
                      {institute.name} ({getCollegeName(institute.collegeId)})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddCampusOpen(false)}>Cancel</Button>
            <Button onClick={handleAddCampus}>Add Campus</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Campus Dialog */}
      <Dialog open={isEditCampusOpen} onOpenChange={setIsEditCampusOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Campus</DialogTitle>
            <DialogDescription>
              Update campus information
            </DialogDescription>
          </DialogHeader>
          {selectedCampus && (
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-campus-name">
                  Campus Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="edit-campus-name"
                  value={selectedCampus.name}
                  onChange={(e) => setSelectedCampus({ ...selectedCampus, name: e.target.value })}
                  placeholder="Enter campus name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-campus-institute">
                  Institute <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={selectedCampus.instituteId}
                  onValueChange={(value) => setSelectedCampus({ ...selectedCampus, instituteId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select an institute" />
                  </SelectTrigger>
                  <SelectContent>
                    {institutes.map((institute) => (
                      <SelectItem key={institute.id} value={institute.id}>
                        {institute.name} ({getCollegeName(institute.collegeId)})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditCampusOpen(false)}>Cancel</Button>
            <Button onClick={handleEditCampus}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Campus Dialog */}
      <Dialog open={isDeleteCampusOpen} onOpenChange={setIsDeleteCampusOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Campus</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedCampus?.name}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteCampusOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteCampus}>Delete Campus</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
