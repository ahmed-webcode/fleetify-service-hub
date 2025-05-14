
import { useEffect, useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Search, Plus } from "lucide-react";
import DataTable from "react-data-table-component";
import { format, parseISO } from "date-fns";

import PageLayout from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { apiClient, Project, ProjectStatus, ProjectQueryParams } from "@/lib/apiClient";
import { AddProjectDialog } from "@/components/projects/AddProjectDialog";
import { EditProjectDialog } from "@/components/projects/EditProjectDialog";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

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

  const handleSort = (column: any, sortDirection: string) => {
    setPagination({
      ...pagination,
      sortBy: column.sortField || column.name,
      direction: sortDirection.toUpperCase() as "ASC" | "DESC"
    });
  };

  const handlePageChange = (page: number) => {
    setPagination({
      ...pagination,
      page: page - 1 // DataTable pages are 1-indexed, our API is 0-indexed
    });
  };

  const handlePerRowsChange = (newPerPage: number) => {
    setPagination({
      ...pagination,
      size: newPerPage
    });
  };

  const filteredProjects = useMemo(() => {
    if (!data?.content) return [];
    
    return searchText
      ? data.content.filter(project => 
          project.name.toLowerCase().includes(searchText.toLowerCase()) || 
          (project.description && project.description.toLowerCase().includes(searchText.toLowerCase()))
        )
      : data.content;
  }, [data?.content, searchText]);

  const handleEdit = (project: Project) => {
    setSelectedProject(project);
    setEditDialogOpen(true);
  };

  const columns = [
    {
      name: 'ID',
      selector: (row: Project) => row.id,
      sortable: true,
      sortField: 'id',
      width: '80px',
    },
    {
      name: 'Name',
      selector: (row: Project) => row.name,
      sortable: true,
      sortField: 'name',
      grow: 2,
    },
    {
      name: 'Description',
      selector: (row: Project) => row.description || 'N/A',
      sortable: false,
      wrap: true,
      grow: 2,
    },
    {
      name: 'Status',
      sortable: true,
      sortField: 'status',
      cell: (row: Project) => <ProjectBadge status={row.status} />,
    },
    {
      name: 'Start Date',
      selector: (row: Project) => {
        try {
          return format(parseISO(row.startDate), "MMM d, yyyy");
        } catch (e) {
          return row.startDate;
        }
      },
      sortable: true,
      sortField: 'startDate',
    },
    {
      name: 'End Date',
      selector: (row: Project) => {
        try {
          return format(parseISO(row.endDate), "MMM d, yyyy");
        } catch (e) {
          return row.endDate;
        }
      },
      sortable: true,
      sortField: 'endDate',
    },
    {
      name: 'Actions',
      cell: (row: Project) => (
        <Button variant="ghost" onClick={() => handleEdit(row)}>Edit</Button>
      ),
      button: true,
      width: '100px',
    },
  ];

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
        <div className="flex justify-between items-center mb-6">
          <div className="relative w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search projects..."
              className="pl-9"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
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
          <div className="border rounded-md">
            <DataTable
              columns={columns}
              data={filteredProjects}
              pagination
              paginationServer
              paginationTotalRows={data?.totalElements || 0}
              onChangePage={handlePageChange}
              onChangeRowsPerPage={handlePerRowsChange}
              onSort={handleSort}
              sortServer
              defaultSortFieldId={1}
              defaultSortAsc={false}
              responsive
              striped
              highlightOnHover
              pointerOnHover
              noDataComponent={
                <div className="p-6 text-center text-gray-500">
                  {searchText ? "No matching projects found" : "No projects available"}
                </div>
              }
              customStyles={{
                headRow: {
                  style: {
                    backgroundColor: '#f3f4f6',
                    color: '#374151',
                  },
                },
              }}
            />
          </div>
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
