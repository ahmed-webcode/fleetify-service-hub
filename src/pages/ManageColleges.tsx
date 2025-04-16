
import { useState } from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ProjectsList } from "@/components/colleges/ProjectsList";
import { ChevronDown, ChevronRight, Building, GraduationCap, BookOpen } from "lucide-react";

// Define college structure
interface College {
  id: string;
  name: string;
  campuses?: Campus[];
}

// Define institute structure
interface Institute {
  id: string;
  name: string;
  location?: string;
}

// Define campus structure
interface Campus {
  id: string;
  name: string;
}

export default function ManageColleges() {
  const [expandedCollege, setExpandedCollege] = useState<string | null>(null);
  const [selectedCollege, setSelectedCollege] = useState<College | null>(null);
  const [activeTab, setActiveTab] = useState("colleges");
  
  // Sample colleges data
  const colleges: College[] = [
    {
      id: "cbe",
      name: "College of Business and Economics",
      campuses: [
        { id: "cbe1", name: "FBE Campus" },
        { id: "cbe2", name: "Commerce" }
      ]
    },
    {
      id: "csah",
      name: "College of Social Science, Arts and Humanities",
      campuses: [
        { id: "csah1", name: "Main Campus" },
        { id: "csah2", name: "Yared Campus" },
        { id: "csah3", name: "Art Campus" }
      ]
    },
    {
      id: "cvma",
      name: "College of Veterinary Medicine and Agriculture",
      campuses: [
        { id: "cvma1", name: "Veterinary Campus" }
      ]
    },
    {
      id: "ctbe",
      name: "College of Technology and Built Environment",
      campuses: [
        { id: "ctbe1", name: "Technology" },
        { id: "ctbe2", name: "Built Environment" }
      ]
    },
    {
      id: "cncs",
      name: "College of Natural and Computational Sciences",
      campuses: []
    },
    {
      id: "cels",
      name: "College of Education and Language Studies",
      campuses: []
    },
    {
      id: "chs",
      name: "College of Health Science",
      campuses: [
        { id: "chs1", name: "Tikur Anbessa" },
        { id: "chs2", name: "Seferselam" }
      ]
    },
    {
      id: "sol",
      name: "School of Law",
      campuses: []
    }
  ];
  
  // Sample institutes data
  const institutes: Institute[] = [
    {
      id: "alihr",
      name: "Aklilu Lema Institute of Health Research (ALIHR)"
    },
    {
      id: "ies",
      name: "Institute of Ethiopian Studies (Central)"
    },
    {
      id: "iwecr",
      name: "Institute of Water, Environment and Climate Research (5 kilo)"
    },
    {
      id: "iser",
      name: "Institute of Social & Economic Research (FBE)"
    },
    {
      id: "igsas",
      name: "Institute of Geophysics Space Science and Astronomy (4 kilo)"
    },
    {
      id: "ipss",
      name: "Institute of Peace and Security Studies (Central)"
    },
    {
      id: "iast",
      name: "Institute of Advanced Science and Technology (5 kilo)"
    }
  ];
  
  const toggleCollege = (collegeId: string, college: College) => {
    if (expandedCollege === collegeId) {
      setExpandedCollege(null);
      setSelectedCollege(null);
    } else {
      setExpandedCollege(collegeId);
      setSelectedCollege(college);
    }
  };
  
  return (
    <PageLayout>
      <div className="page-container">
        <div className="page-title-container">
          <h1 className="page-title">Manage Colleges & Institutes</h1>
          <p className="page-description">View and manage the university's academic units and their projects</p>
        </div>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Academic Units</CardTitle>
            <CardDescription>
              Addis Ababa University's colleges, institutes, and their associated campuses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="colleges" className="gap-2">
                  <GraduationCap className="h-4 w-4" />
                  Colleges
                </TabsTrigger>
                <TabsTrigger value="institutes" className="gap-2">
                  <BookOpen className="h-4 w-4" />
                  Institutes
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="colleges" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {colleges.map((college) => (
                    <div key={college.id} className="border rounded-lg overflow-hidden">
                      <div 
                        className="bg-muted/30 p-4 flex justify-between items-center cursor-pointer"
                        onClick={() => toggleCollege(college.id, college)}
                      >
                        <div className="flex items-center gap-3">
                          <Building className="h-5 w-5 text-muted-foreground" />
                          <h3 className="font-medium">{college.name}</h3>
                        </div>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          {expandedCollege === college.id ? 
                            <ChevronDown className="h-4 w-4" /> : 
                            <ChevronRight className="h-4 w-4" />
                          }
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                
                {selectedCollege && (
                  <Card className="mt-8">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-xl">{selectedCollege.name}</CardTitle>
                      <CardDescription className="flex flex-wrap gap-2">
                        {selectedCollege.campuses && selectedCollege.campuses.length > 0 ? (
                          <>
                            <span className="font-medium">Campuses:</span>
                            {selectedCollege.campuses.map((campus) => (
                              <span key={campus.id} className="bg-muted px-2 py-1 rounded text-sm">
                                {campus.name}
                              </span>
                            ))}
                          </>
                        ) : (
                          <span>No campuses assigned</span>
                        )}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ProjectsList 
                        collegeId={selectedCollege.id} 
                        collegeName={selectedCollege.name}
                      />
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
              
              <TabsContent value="institutes" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {institutes.map((institute) => (
                    <div key={institute.id} className="border rounded-lg overflow-hidden">
                      <div className="bg-muted/30 p-4 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <BookOpen className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <h3 className="font-medium">{institute.name}</h3>
                            {institute.location && (
                              <p className="text-xs text-muted-foreground">{institute.location}</p>
                            )}
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          View Projects
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
}
