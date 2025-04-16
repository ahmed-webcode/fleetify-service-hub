
import React, { useState } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Search, Plus, Trash2, Edit, Building, School, MapPin } from "lucide-react";
import { toast } from "sonner";

// Types for organization structure
type College = {
  id: string;
  name: string;
  description?: string;
  positions?: CollegePosition[];
  campuses?: string[];
};

type CollegePosition = {
  title: string;
  name: string;
};

type Institute = {
  id: string;
  name: string;
  location?: string;
  description?: string;
};

type Campus = {
  id: string;
  name: string;
  collegeId: string;
  location?: string;
};

// Mock data for organization structure
const MOCK_COLLEGES: College[] = [
  {
    id: "col1",
    name: "College of Business and Economics",
    description: "Offers programs in business, economics, accounting and finance",
    positions: [
      { title: "Executive Dean", name: "Dr. Samuel Tadesse" },
      { title: "Vice Executive Dean (Campus)", name: "Dr. Helen Abebe" },
      { title: "Vice Executive Dean for Academics", name: "Dr. Michael Hailu" },
      { title: "Vice Executive Dean for Research and Engagement", name: "Dr. Meron Tesfaye" },
      { title: "Operational Director for FBE Campus", name: "Mr. Dawit Nega" },
      { title: "Operational Director for Commerce", name: "Ms. Tigist Demeke" }
    ],
    campuses: ["FBE Campus", "Commerce"]
  },
  {
    id: "col2",
    name: "College of Social Science, Arts and Humanities",
    description: "Offers programs in social sciences, arts, literature and humanities",
    positions: [
      { title: "Executive Dean", name: "Dr. Tigist Alemu" },
      { title: "Vice Executive Dean (Campus)", name: "Dr. Abebe Kebede" },
      { title: "Vice Executive Dean for Academics", name: "Dr. Sara Mengiste" },
      { title: "Vice Executive Dean for Research and Engagement", name: "Dr. Daniel Gebre" }
    ],
    campuses: ["Main Campus", "Yared Campus", "Art Campus"]
  },
  {
    id: "col3",
    name: "College of Veterinary Medicine and Agriculture",
    description: "Focuses on veterinary medicine and agricultural sciences",
    positions: [
      { title: "Executive Dean", name: "Dr. Fekadu Bekele" },
      { title: "Vice Executive Dean (Campus)", name: "Dr. Hanna Tesfaye" },
      { title: "Vice Executive Dean for Academics", name: "Dr. Solomon Abera" },
      { title: "Vice Executive Dean for Research and Engagement", name: "Dr. Bethel Tadesse" }
    ],
    campuses: ["Veterinary Campus"]
  },
  {
    id: "col4",
    name: "College of Technology and Built Environment",
    description: "Focuses on engineering, technology and built environment disciplines",
    positions: [
      { title: "Executive Dean", name: "Dr. Dawit Haile" },
      { title: "Vice Executive Dean (Campus)", name: "Dr. Yonas Arega" },
      { title: "Vice Executive Dean for Academics", name: "Dr. Elizabeth Tadesse" },
      { title: "Vice Executive Dean for Research and Engagement", name: "Dr. Mekonnen Abebe" }
    ],
    campuses: ["Technology", "Built Environment"]
  },
  {
    id: "col5",
    name: "College of Natural and Computational Sciences",
    description: "Focuses on natural sciences, mathematics and computing",
    positions: [
      { title: "Executive Dean", name: "Dr. Alemayehu Deresa" },
      { title: "Vice Executive Dean (Campus)", name: "Dr. Selamawit Mengistu" },
      { title: "Vice Executive Dean for Academics", name: "Dr. Abel Tesfaye" },
      { title: "Vice Executive Dean for Research and Engagement", name: "Dr. Ruth Kinfe" }
    ]
  },
  {
    id: "col6",
    name: "College of Education and Language Studies",
    description: "Focuses on education, pedagogy and language studies",
    positions: [
      { title: "Executive Dean", name: "Dr. Tewodros Abebe" },
      { title: "Vice Executive Dean (Campus)", name: "Dr. Meseret Hailu" },
      { title: "Vice Executive Dean for Academics", name: "Dr. Biruk Solomon" },
      { title: "Vice Executive Dean for Research and Engagement", name: "Dr. Hiwot Tekle" }
    ]
  },
  {
    id: "col7",
    name: "College of Health Science",
    description: "Focuses on medical and health sciences",
    positions: [
      { title: "Executive Dean", name: "Dr. Elias Mulatu" },
      { title: "Vice Executive Dean (Campus)", name: "Dr. Senait Tadesse" },
      { title: "Vice Executive Dean for Academics", name: "Dr. Mesfin Hailu" },
      { title: "Vice Executive Dean for Research and Engagement", name: "Dr. Kidist Alemu" }
    ],
    campuses: ["Tikur Anbessa", "Seferselam"]
  },
  {
    id: "col8",
    name: "School of Law",
    description: "Focuses on legal education and research",
    positions: [
      { title: "Executive Dean", name: "Dr. Eshetu Girma" },
      { title: "Vice Executive Dean (Campus)", name: "Dr. Rahel Mesele" },
      { title: "Vice Executive Dean for Academics", name: "Dr. Getachew Assefa" },
      { title: "Vice Executive Dean for Research and Engagement", name: "Dr. Haregewoin Teklu" }
    ]
  }
];

const MOCK_INSTITUTES: Institute[] = [
  {
    id: "inst1",
    name: "Aklilu Lema Institute of Health Research (ALIHR)",
    location: "Health Science Campus"
  },
  {
    id: "inst2",
    name: "Institute of Ethiopian Studies (IES)",
    location: "Central"
  },
  {
    id: "inst3",
    name: "Institute of Water, Environment and Climate Research",
    location: "5 Kilo"
  },
  {
    id: "inst4",
    name: "Institute of Social & Economic Research",
    location: "FBE"
  },
  {
    id: "inst5",
    name: "Institute of Geophysics, Space Science and Astronomy",
    location: "4 Kilo"
  },
  {
    id: "inst6",
    name: "Institute of Peace and Security Studies",
    location: "Central"
  },
  {
    id: "inst7",
    name: "Institute of Advanced Science and Technology",
    location: "5 Kilo"
  }
];

const MOCK_CAMPUSES: Campus[] = [
  { id: "campus1", name: "FBE Campus", collegeId: "col1", location: "FBE" },
  { id: "campus2", name: "Commerce", collegeId: "col1", location: "Commerce Area" },
  { id: "campus3", name: "Main Campus", collegeId: "col2", location: "Central AAU" },
  { id: "campus4", name: "Yared Campus", collegeId: "col2", location: "Arts District" },
  { id: "campus5", name: "Art Campus", collegeId: "col2", location: "Arts District" },
  { id: "campus6", name: "Veterinary Campus", collegeId: "col3", location: "Debre Zeit" },
  { id: "campus7", name: "Technology", collegeId: "col4", location: "5 Kilo" },
  { id: "campus8", name: "Built Environment", collegeId: "col4", location: "5 Kilo" },
  { id: "campus9", name: "Tikur Anbessa", collegeId: "col7", location: "Medical District" },
  { id: "campus10", name: "Seferselam", collegeId: "col7", location: "Medical District" }
];

const ManageColleges = () => {
  const [activeTab, setActiveTab] = useState("colleges");
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddCollegeOpen, setIsAddCollegeOpen] = useState(false);
  const [isAddInstituteOpen, setIsAddInstituteOpen] = useState(false);
  const [isAddCampusOpen, setIsAddCampusOpen] = useState(false);
  const [selectedCollege, setSelectedCollege] = useState<College | null>(null);
  
  // Form state
  const [newCollege, setNewCollege] = useState({ name: "" });
  const [newInstitute, setNewInstitute] = useState({ name: "", location: "" });
  const [newCampus, setNewCampus] = useState({ name: "", collegeId: "", location: "" });
  
  // Filtered data based on search
  const filteredColleges = MOCK_COLLEGES.filter(college => 
    college.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const filteredInstitutes = MOCK_INSTITUTES.filter(institute => 
    institute.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const filteredCampuses = MOCK_CAMPUSES.filter(campus => 
    campus.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddCollege = () => {
    if (!newCollege.name.trim()) {
      toast.error("College name is required");
      return;
    }

    toast.success("College added successfully");
    setIsAddCollegeOpen(false);
    setNewCollege({ name: "" });
  };

  const handleAddInstitute = () => {
    if (!newInstitute.name.trim()) {
      toast.error("Institute name is required");
      return;
    }

    toast.success("Institute added successfully");
    setIsAddInstituteOpen(false);
    setNewInstitute({ name: "", location: "" });
  };

  const handleAddCampus = () => {
    if (!newCampus.name.trim() || !newCampus.collegeId) {
      toast.error("Campus name and college are required");
      return;
    }

    toast.success("Campus added successfully");
    setIsAddCampusOpen(false);
    setNewCampus({ name: "", collegeId: "", location: "" });
  };

  return (
    <PageLayout>
      <div className="page-container">
        <div className="page-title-container">
          <h1 className="page-title">Manage Educational Units</h1>
          <p className="page-description">Manage colleges, institutes, and campuses</p>
        </div>

        <div className="card-uniform">
          <Tabs 
            defaultValue="colleges" 
            value={activeTab} 
            onValueChange={setActiveTab}
            className="space-y-6"
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
              <TabsList className="h-auto p-1">
                <TabsTrigger value="colleges" className="px-4">
                  <Building className="mr-2 h-4 w-4" />
                  Colleges
                </TabsTrigger>
                <TabsTrigger value="institutes" className="px-4">
                  <School className="mr-2 h-4 w-4" />
                  Institutes
                </TabsTrigger>
                <TabsTrigger value="campuses" className="px-4">
                  <MapPin className="mr-2 h-4 w-4" />
                  Campuses
                </TabsTrigger>
              </TabsList>

              <div className="flex gap-2">
                {activeTab === "colleges" && (
                  <Button onClick={() => setIsAddCollegeOpen(true)} size="sm">
                    <Plus className="h-4 w-4 mr-1" /> Add College
                  </Button>
                )}
                {activeTab === "institutes" && (
                  <Button onClick={() => setIsAddInstituteOpen(true)} size="sm">
                    <Plus className="h-4 w-4 mr-1" /> Add Institute
                  </Button>
                )}
                {activeTab === "campuses" && (
                  <Button onClick={() => setIsAddCampusOpen(true)} size="sm">
                    <Plus className="h-4 w-4 mr-1" /> Add Campus
                  </Button>
                )}
              </div>
            </div>
            
            <div className="mb-6 flex items-center">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder={`Search ${activeTab}...`} 
                  className="pl-9" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <TabsContent value="colleges" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredColleges.length > 0 ? filteredColleges.map((college) => (
                  <Card key={college.id} className="overflow-hidden">
                    <CardHeader className="pb-3">
                      <CardTitle>{college.name}</CardTitle>
                      <CardDescription>{college.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-sm font-medium mb-2">Leadership Positions</h4>
                          <div className="space-y-2">
                            {college.positions?.map((position, idx) => (
                              <div key={idx} className="text-sm">
                                <span className="font-medium">{position.title}:</span> {position.name}
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        {college.campuses && college.campuses.length > 0 && (
                          <div>
                            <h4 className="text-sm font-medium mb-2">Campuses</h4>
                            <div className="flex flex-wrap gap-2">
                              {college.campuses.map((campus, idx) => (
                                <div key={idx} className="text-xs bg-muted px-2 py-1 rounded-md">
                                  {campus}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        <div className="flex justify-end gap-2 pt-3">
                          <Button variant="outline" size="sm" onClick={() => setSelectedCollege(college)}>
                            <Edit className="h-4 w-4 mr-1" /> Edit
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )) : (
                  <div className="col-span-full flex justify-center p-8 border rounded-lg bg-muted/20">
                    No colleges found matching your search.
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="institutes" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredInstitutes.length > 0 ? filteredInstitutes.map((institute) => (
                  <Card key={institute.id} className="overflow-hidden">
                    <CardHeader>
                      <CardTitle className="text-lg">{institute.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <span className="text-sm font-medium">Location:</span> {institute.location}
                        </div>
                        
                        <div>
                          <span className="text-sm font-medium">Director:</span> Dr. Getachew Mekonen
                        </div>
                        
                        <div className="flex justify-end gap-2 pt-3">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4 mr-1" /> Edit
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )) : (
                  <div className="col-span-full flex justify-center p-8 border rounded-lg bg-muted/20">
                    No institutes found matching your search.
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="campuses" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCampuses.length > 0 ? filteredCampuses.map((campus) => (
                  <Card key={campus.id} className="overflow-hidden">
                    <CardHeader>
                      <CardTitle className="text-lg">{campus.name}</CardTitle>
                      <CardDescription>
                        {MOCK_COLLEGES.find(c => c.id === campus.collegeId)?.name}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {campus.location && (
                          <div>
                            <span className="text-sm font-medium">Location:</span> {campus.location}
                          </div>
                        )}
                        
                        <div className="flex justify-end gap-2 pt-3">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4 mr-1" /> Edit
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )) : (
                  <div className="col-span-full flex justify-center p-8 border rounded-lg bg-muted/20">
                    No campuses found matching your search.
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Add College Dialog */}
        <Dialog open={isAddCollegeOpen} onOpenChange={setIsAddCollegeOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New College</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="college-name">College Name</Label>
                <Input 
                  id="college-name" 
                  placeholder="Enter college name" 
                  value={newCollege.name}
                  onChange={(e) => setNewCollege({ ...newCollege, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="college-description">Description (Optional)</Label>
                <Input 
                  id="college-description" 
                  placeholder="Brief description of the college"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddCollegeOpen(false)}>Cancel</Button>
              <Button onClick={handleAddCollege}>Add College</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Add Institute Dialog */}
        <Dialog open={isAddInstituteOpen} onOpenChange={setIsAddInstituteOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Institute</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="institute-name">Institute Name</Label>
                <Input 
                  id="institute-name" 
                  placeholder="Enter institute name" 
                  value={newInstitute.name}
                  onChange={(e) => setNewInstitute({ ...newInstitute, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="institute-location">Location</Label>
                <Input 
                  id="institute-location" 
                  placeholder="Location (e.g., Campus name or area)" 
                  value={newInstitute.location}
                  onChange={(e) => setNewInstitute({ ...newInstitute, location: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddInstituteOpen(false)}>Cancel</Button>
              <Button onClick={handleAddInstitute}>Add Institute</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Add Campus Dialog */}
        <Dialog open={isAddCampusOpen} onOpenChange={setIsAddCampusOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Campus</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="campus-name">Campus Name</Label>
                <Input 
                  id="campus-name" 
                  placeholder="Enter campus name" 
                  value={newCampus.name}
                  onChange={(e) => setNewCampus({ ...newCampus, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="campus-college">Associated College</Label>
                <Select 
                  value={newCampus.collegeId} 
                  onValueChange={(value) => setNewCampus({ ...newCampus, collegeId: value })}
                >
                  <SelectTrigger id="campus-college">
                    <SelectValue placeholder="Select a college" />
                  </SelectTrigger>
                  <SelectContent>
                    {MOCK_COLLEGES.map(college => (
                      <SelectItem key={college.id} value={college.id}>{college.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="campus-location">Location</Label>
                <Input 
                  id="campus-location" 
                  placeholder="Location details" 
                  value={newCampus.location}
                  onChange={(e) => setNewCampus({ ...newCampus, location: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddCampusOpen(false)}>Cancel</Button>
              <Button onClick={handleAddCampus}>Add Campus</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </PageLayout>
  );
};

export default ManageColleges;
