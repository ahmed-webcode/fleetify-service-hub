
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ProjectForm } from "@/components/projects/ProjectForm";
import { PlusCircle, FileText } from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";

// Define the project type
interface Project {
  id: string;
  projectName: string;
  description: string;
  college: string;
  budget: string;
  startDate: string;
  endDate?: string;
  projectManager: string;
  status: string;
}

// Project form schema
const formSchema = z.object({
  projectName: z.string().min(2),
  description: z.string().min(10),
  college: z.string().min(1),
  budget: z.string().min(1),
  startDate: z.string().min(1),
  endDate: z.string().optional(),
  projectManager: z.string().min(1),
  status: z.string().min(1),
});

type FormValues = z.infer<typeof formSchema>;

interface ProjectsListProps {
  collegeId: string;
  collegeName: string;
}

export function ProjectsList({ collegeId, collegeName }: ProjectsListProps) {
  const [isAddProjectOpen, setIsAddProjectOpen] = useState(false);
  const [projects, setProjects] = useState<Project[]>([
    {
      id: "proj1",
      projectName: "Campus Building Renovation",
      description: "Renovation of the main campus building",
      college: collegeId,
      budget: "5000000",
      startDate: "2023-06-01",
      endDate: "2023-12-31",
      projectManager: "John Doe",
      status: "active"
    },
    {
      id: "proj2",
      projectName: "Lab Equipment Upgrade",
      description: "Upgrade of laboratory equipment in science departments",
      college: collegeId,
      budget: "2500000",
      startDate: "2023-07-15",
      endDate: "2023-11-30",
      projectManager: "Jane Smith",
      status: "planning"
    }
  ]);

  const handleAddProject = (data: FormValues & { files: File[] }) => {
    // In a real app, this would be an API call
    const newProject: Project = {
      id: `proj${projects.length + 1}`,
      projectName: data.projectName,
      description: data.description,
      college: data.college || collegeId,
      budget: data.budget,
      startDate: data.startDate,
      endDate: data.endDate,
      projectManager: data.projectManager,
      status: data.status
    };
    
    setProjects([...projects, newProject]);
    setIsAddProjectOpen(false);
    toast.success("Project added successfully");
    
    // Log files uploaded (in a real app, these would be saved to storage)
    if (data.files && data.files.length > 0) {
      console.log("Files uploaded:", data.files);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Projects for {collegeName}</h3>
        <Dialog open={isAddProjectOpen} onOpenChange={setIsAddProjectOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-2">
              <PlusCircle className="h-4 w-4" />
              Add Project
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[95vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl">Add New Project for {collegeName}</DialogTitle>
            </DialogHeader>
            <ProjectForm 
              onSubmit={handleAddProject} 
              onCancel={() => setIsAddProjectOpen(false)}
              defaultValues={{ college: collegeId }}
            />
          </DialogContent>
        </Dialog>
      </div>
      
      {projects.length === 0 ? (
        <div className="text-center py-12 border border-dashed rounded-md">
          <FileText className="mx-auto h-12 w-12 text-muted-foreground/60" />
          <h3 className="mt-4 text-lg font-medium">No projects yet</h3>
          <p className="text-muted-foreground">Add a new project to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <Card key={project.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-base">{project.projectName}</CardTitle>
                  <StatusBadge status={project.status} />
                </div>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <p className="text-muted-foreground line-clamp-2">{project.description}</p>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Budget:</span>
                    <span className="font-medium">{Number(project.budget).toLocaleString()} ETB</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Manager:</span>
                    <span>{project.projectManager}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Timeline:</span>
                    <span>
                      {new Date(project.startDate).toLocaleDateString()} 
                      {project.endDate && ` - ${new Date(project.endDate).toLocaleDateString()}`}
                    </span>
                  </div>
                </div>
                <div className="pt-3">
                  <Button variant="outline" size="sm" className="w-full">View Details</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case "planning":
        return { variant: "secondary", label: "Planning" };
      case "active":
        return { variant: "default", label: "Active" };
      case "paused":
        return { variant: "warning", label: "Paused" };
      case "completed":
        return { variant: "success", label: "Completed" };
      case "canceled":
        return { variant: "destructive", label: "Canceled" };
      default:
        return { variant: "outline", label: status };
    }
  };

  const config = getStatusConfig(status);

  return (
    <Badge variant={config.variant as any}>{config.label}</Badge>
  );
}
