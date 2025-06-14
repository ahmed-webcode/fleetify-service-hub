
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { apiClient } from "@/lib/apiClient";
import { Project, ProjectStatus, CreateProjectDto, UpdateProjectDto } from "@/types/project";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { PageHeader } from "@/components/layout/PageHeader";

export default function ProjectsManagement() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [newProject, setNewProject] = useState<CreateProjectDto>({
    name: "",
    description: "",
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
    status: ProjectStatus.ON_GOING,
  });
  const [editProject, setEditProject] = useState<UpdateProjectDto>({
    name: "",
    description: "",
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
    status: ProjectStatus.ON_GOING,
  });
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const resp = await apiClient.projects.getAll();
      setProjects((resp as any).content || []); // fallback if .content missing
    } catch (error) {
      toast.error("Failed to load projects");
    }
  };

  const handleCreateProject = async () => {
    try {
      await apiClient.projects.create(newProject);
      toast.success("Project created successfully!");
      setOpenCreate(false);
      fetchProjects();
      setNewProject({
        name: "",
        description: "",
        startDate: new Date().toISOString().split("T")[0],
        endDate: new Date().toISOString().split("T")[0],
        status: ProjectStatus.ON_GOING,
      });
    } catch (error: any) {
      toast.error("Failed to create project: " + error.message);
    }
  };

  const handleUpdateProject = async () => {
    if (!selectedProject) {
      toast.error("No project selected to update.");
      return;
    }
    try {
      await apiClient.projects.update(selectedProject.id, editProject);
      toast.success("Project updated successfully!");
      setOpenEdit(false);
      fetchProjects();
    } catch (error: any) {
      toast.error("Failed to update project: " + error.message);
    }
  };

  const handleDeleteProject = async (id: number) => {
    try {
      // No delete method on projects; let's just remove it from UI (or if backend provides, add API method).
      toast.info("Delete endpoint not implemented.");
      // await apiClient.projects.delete(id);
      // toast.success("Project deleted successfully!");
      // fetchProjects();
    } catch (error: any) {
      toast.error("Failed to delete project: " + error.message);
    }
  };

  // Helper for ProjectStatus dropdown
  const renderStatusSelect = (value: ProjectStatus, onChange: (value: ProjectStatus) => void, id: string) => (
    <select
      id={id}
      className="col-span-3 border rounded p-2"
      value={value}
      onChange={e => onChange(e.target.value as ProjectStatus)}
    >
      {Object.values(ProjectStatus).map(st => (
        <option key={st} value={st}>
          {st.replace("_", " ").replace(/^\w/, c => c.toUpperCase())}
        </option>
      ))}
    </select>
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Projects"
        description="Manage and oversee all fleet projects"
      />
      <Card>
        <CardHeader>
          <CardTitle>Projects</CardTitle>
          <CardDescription>Manage your fleet projects</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell>{project.name}</TableCell>
                  <TableCell>{project.description}</TableCell>
                  <TableCell>{project.startDate}</TableCell>
                  <TableCell>{project.endDate}</TableCell>
                  <TableCell>{project.status}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedProject(project);
                        setEditProject({
                          name: project.name,
                          description: project.description,
                          startDate: project.startDate,
                          endDate: project.endDate,
                          status: project.status as ProjectStatus,
                        });
                        setOpenEdit(true);
                      }}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteProject(project.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={openCreate} onOpenChange={setOpenCreate}>
        <DialogTrigger asChild>
          <Button variant="outline">
            <Plus className="mr-2 h-4 w-4" />
            Create Project
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create Project</DialogTitle>
            <DialogDescription>
              Create a new project to manage your fleet
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                type="text"
                id="name"
                value={newProject.name}
                onChange={(e) =>
                  setNewProject({ ...newProject, name: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Input
                type="text"
                id="description"
                value={newProject.description}
                onChange={(e) =>
                  setNewProject({ ...newProject, description: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="startDate" className="text-right">
                Start Date
              </Label>
              <Input
                type="date"
                id="startDate"
                value={newProject.startDate}
                onChange={(e) =>
                  setNewProject({ ...newProject, startDate: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="endDate" className="text-right">
                End Date
              </Label>
              <Input
                type="date"
                id="endDate"
                value={newProject.endDate}
                onChange={(e) =>
                  setNewProject({ ...newProject, endDate: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Status
              </Label>
              {renderStatusSelect(
                newProject.status as ProjectStatus,
                value => setNewProject({ ...newProject, status: value }),
                "status"
              )}
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" onClick={handleCreateProject}>
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Project</DialogTitle>
            <DialogDescription>
              Make changes to your project here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-name" className="text-right">
                Name
              </Label>
              <Input
                type="text"
                id="edit-name"
                value={editProject.name || ""}
                onChange={(e) =>
                  setEditProject({ ...editProject, name: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-description" className="text-right">
                Description
              </Label>
              <Input
                type="text"
                id="edit-description"
                value={editProject.description || ""}
                onChange={(e) =>
                  setEditProject({ ...editProject, description: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-startDate" className="text-right">
                Start Date
              </Label>
              <Input
                type="date"
                id="edit-startDate"
                value={editProject.startDate || ""}
                onChange={(e) =>
                  setEditProject({ ...editProject, startDate: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-endDate" className="text-right">
                End Date
              </Label>
              <Input
                type="date"
                id="edit-endDate"
                value={editProject.endDate || ""}
                onChange={(e) =>
                  setEditProject({ ...editProject, endDate: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-status" className="text-right">
                Status
              </Label>
              {renderStatusSelect(
                editProject.status as ProjectStatus,
                value => setEditProject({ ...editProject, status: value }),
                "edit-status"
              )}
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" onClick={handleUpdateProject}>
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
