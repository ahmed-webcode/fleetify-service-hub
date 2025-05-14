import { useEffect, useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Search, Plus, ArrowUpDown, Filter } from "lucide-react";

import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { apiClient, Project, ProjectStatus, ProjectQueryParams } from "@/lib/apiClient";
import { AddProjectDialog } from "@/components/projects/AddProjectDialog";
import { EditProjectDialog } from "@/components/projects/EditProjectDialog";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format, parseISO } from "date-fns";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const ProjectBadge = ({ status }: { status: ProjectStatus }) => {
  const variants: Record<ProjectStatus, { variant: "default" | "outline" | "secondary" | "destructive" | "success", label: string }> = {
    'PENDING': { variant: 'secondary', label: 'Pending' },
    'ON_GOING': { variant: 'success', label: 'On-going' },
    'ON_HOLD': { variant: 'outline', label: 'On Hold' },
    'EXPIRED': { variant: 'destructive', label: 'Expired' },
  };

  const { variant, label } = variants[status] || { variant: 'default', label: status };

  return <Badge variant={variant as any}>{label}</Badge>;
};

const ProjectsManagement = () => {
  const [searchText, setSearchText] = useState("");
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [pagination, setPagination] = useState<ProjectQueryParams>({
    page: 0,
    size: 10,
    sortBy: "createdAt",
    direction: "DESC"
  });
  const [selectedStatuses, setSelectedStatuses] = useState<ProjectStatus[]>([]);

  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['projects', pagination],
    queryFn: () => apiClient.projects.getAll(pagination),
  });

  const createProjectMutation = useMutation({
    mutationFn: apiClient.projects.create,
    onSuccess: () => {
      toast.success("Project created successfully");
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      setAddDialogOpen(false);
    },
    onError: (error: any) => {
      toast.error(`Failed to create project: ${error.message}`);
    }
  });

  const updateProjectMutation = useMutation({
    mutationFn: ({ id, data }: { id: number, data: any }) => 
      apiClient.projects.update(id, data),
    onSuccess: () => {
      toast.success("Project updated successfully");
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      setEditDialogOpen(false);
      setSelectedProject(null);
    },
    onError: (error: any) => {
      toast.error(`Failed to update project: ${error.message}`);
    }
  });

  const handleSort = (column: string) => {
    setPagination(prev => ({
      ...prev,
      sortBy: column,
      direction: prev.sortBy === column && prev.direction === "ASC" ? "DESC" : "ASC"
    }));
  };

  const handlePageChange = (page: number) => {
    setPagination({
      ...pagination,
      page: page
    });
  };

  const statusOptions = Object.values(ProjectStatus).map(status => ({
    value: status,
    label: status.replace('_', ' ').toLowerCase().replace(/\b\w/g, s => s.toUpperCase())
  }));

  const toggleStatusFilter = (status: ProjectStatus) => {
    setSelectedStatuses(prev => {
      if (prev.includes(status)) {
        return prev.filter(s => s !== status);
      } else {
        return [...prev, status];
      }
    });
  };

  const filteredProjects = useMemo(() => {
    if (!data?.content) return [];
    
    let filtered = data.content;
    
    // First apply text search
    if (searchText) {
      filtered = filtered.filter(project => 
        project.name.toLowerCase().includes(searchText.toLowerCase()) || 
        (project.description && project.description.toLowerCase().includes(searchText.toLowerCase()))
      );
    }
    
    // Then apply status filter
    if (selectedStatuses.length > 0) {
      filtered = filtered.filter(project => selectedStatuses.includes(project.status));
    }
    
    return filtered;
  }, [data?.content, searchText, selectedStatuses]);

  const handleEdit = (project: Project) => {
    setSelectedProject(project);
    setEditDialogOpen(true);
  };

  // Calculate pagination
  const totalPages = data?.totalPages || 0;
  const currentPage = pagination.page;

  if (error) {
    toast.error("Failed to load projects");
    return (
      <PageLayout title="Projects Management">
        <div className="p-6">
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <p className="text-red-700">Error loading projects. Please try again later.</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout title="Projects Management">
      <div className="p-6">
        <h1 className="text-2xl font-bold tracking-tight mb-6">Projects Management</h1>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search projects..."
                className="pl-9"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="ml-2">
                  <Filter className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48">
                <DropdownMenuGroup>
                  <div className="px-2 py-1.5 text-sm font-semibold">Filter by Status</div>
                  {statusOptions.map(status => (
                    <DropdownMenuItem 
                      key={status.value}
                      onClick={() => toggleStatusFilter(status.value as ProjectStatus)}
                      className="flex items-center gap-2"
                    >
                      <div className={cn(
                        "h-4 w-4 border rounded-sm flex items-center justify-center",
                        selectedStatuses.includes(status.value as ProjectStatus) 
                          ? "bg-primary border-primary" 
                          : "border-gray-400"
                      )}>
                        {selectedStatuses.includes(status.value as ProjectStatus) && (
                          <span className="text-white text-xs">✓</span>
                        )}
                      </div>
                      {status.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          <Button onClick={() => setAddDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add Project
          </Button>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead onClick={() => handleSort("id")} className="cursor-pointer w-16">
                    <div className="flex items-center">
                      ID
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead onClick={() => handleSort("name")} className="cursor-pointer">
                    <div className="flex items-center">
                      Name
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead onClick={() => handleSort("status")} className="cursor-pointer">
                    <div className="flex items-center">
                      Status
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead onClick={() => handleSort("startDate")} className="cursor-pointer">
                    <div className="flex items-center">
                      Start Date
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead onClick={() => handleSort("endDate")} className="cursor-pointer">
                    <div className="flex items-center">
                      End Date
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProjects.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center h-24 text-muted-foreground">
                      {searchText || selectedStatuses.length > 0 ? "No matching projects found" : "No projects available"}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProjects.map((project) => (
                    <TableRow key={project.id}>
                      <TableCell className="font-medium">{project.id}</TableCell>
                      <TableCell>{project.name}</TableCell>
                      <TableCell className="max-w-md truncate">{project.description || "N/A"}</TableCell>
                      <TableCell><ProjectBadge status={project.status} /></TableCell>
                      <TableCell>
                        {format(parseISO(project.startDate), "MMM d, yyyy")}
                      </TableCell>
                      <TableCell>
                        {format(parseISO(project.endDate), "MMM d, yyyy")}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" onClick={() => handleEdit(project)}>Edit</Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}

        {!isLoading && data && data.totalPages > 1 && (
          <Pagination className="mt-4">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => handlePageChange(Math.max(0, currentPage - 1))}
                  className={currentPage === 0 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
              
              {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                // Calculate page numbers to show
                let pageToShow;
                if (totalPages <= 5) {
                  // If there are 5 or fewer pages, show all pages
                  pageToShow = i;
                } else if (currentPage <= 2) {
                  // If we're near the beginning, show first 5 pages
                  pageToShow = i;
                } else if (currentPage >= totalPages - 3) {
                  // If we're near the end, show last 5 pages
                  pageToShow = totalPages - 5 + i;
                } else {
                  // Otherwise show current page and 2 on each side
                  pageToShow = currentPage - 2 + i;
                }
                
                return (
                  <PaginationItem key={pageToShow}>
                    <PaginationLink
                      onClick={() => handlePageChange(pageToShow)}
                      isActive={pageToShow === currentPage}
                    >
                      {pageToShow + 1}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}
              
              <PaginationItem>
                <PaginationNext
                  onClick={() => handlePageChange(Math.min(totalPages - 1, currentPage + 1))}
                  className={currentPage === totalPages - 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}

        <AddProjectDialog 
          open={addDialogOpen}
          onOpenChange={setAddDialogOpen}
          onSubmit={createProjectMutation.mutate}
          isSubmitting={createProjectMutation.isPending}
        />

        <EditProjectDialog 
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          project={selectedProject}
          onSubmit={(data) => 
            selectedProject && updateProjectMutation.mutate({ id: selectedProject.id, data })
          }
          isSubmitting={updateProjectMutation.isPending}
        />
      </div>
    </PageLayout>
  );
};

export default ProjectsManagement;
