
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { format, parseISO } from "date-fns";
import { CalendarIcon } from "lucide-react";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { apiClient } from "@/lib/apiClient";
import { Project, ProjectStatus, UpdateProjectDto } from "@/types/project";

const formSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters").max(255),
    description: z.string().optional(),
    status: z.nativeEnum(ProjectStatus),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().min(1, "End date is required"),
});

interface EditProjectDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    project: Project | null;
    onSubmit: (data: UpdateProjectDto) => void;
    isSubmitting: boolean;
}

export function EditProjectDialog({
    open,
    onOpenChange,
    project,
    onSubmit,
    isSubmitting,
}: EditProjectDialogProps) {
    const [startDate, setStartDate] = useState<Date | undefined>();
    const [endDate, setEndDate] = useState<Date | undefined>();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            description: "",
            status: ProjectStatus.PENDING,
            startDate: "",
            endDate: "",
        },
    });

    useEffect(() => {
        if (project) {
            try {
                const formattedStartDate = project.startDate.includes("T")
                    ? format(parseISO(project.startDate), "yyyy-MM-dd")
                    : project.startDate;

                const formattedEndDate = project.endDate.includes("T")
                    ? format(parseISO(project.endDate), "yyyy-MM-dd")
                    : project.endDate;

                form.reset({
                    name: project.name,
                    description: project.description || "",
                    status: project.status,
                    startDate: formattedStartDate,
                    endDate: formattedEndDate,
                });

                // Set local date picker values
                setStartDate(formattedStartDate ? parseISO(formattedStartDate) : undefined);
                setEndDate(formattedEndDate ? parseISO(formattedEndDate) : undefined);
            } catch (error) {
                console.error("Error parsing dates:", error);
                form.reset({
                    name: project.name,
                    description: project.description || "",
                    status: project.status,
                    startDate: project.startDate,
                    endDate: project.endDate,
                });

                setStartDate(undefined);
                setEndDate(undefined);
            }
        }
    }, [form, project]);

    const handleSubmit = (data: z.infer<typeof formSchema>) => {
        // Convert Date to string before submit
        const submitData: UpdateProjectDto = {
            ...data,
            startDate: startDate ? format(startDate, "yyyy-MM-dd") : "",
            endDate: endDate ? format(endDate, "yyyy-MM-dd") : "",
        };
        onSubmit(submitData);
    };

    if (!project) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                    <DialogTitle>Edit Project</DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Project Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter project name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Enter project description"
                                            {...field}
                                            value={field.value || ""}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            {/* Start Date */}
                            <FormItem>
                                <FormLabel>Start Date</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant={"outline"}
                                                className={cn(
                                                    "w-full justify-start text-left font-normal",
                                                    !startDate && "text-muted-foreground"
                                                )}
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {startDate
                                                    ? format(startDate, "PPP")
                                                    : <span>Pick a date</span>}
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={startDate}
                                            onSelect={d => {
                                                setStartDate(d);
                                                form.setValue("startDate", d ? format(d, "yyyy-MM-dd") : "");
                                            }}
                                            initialFocus
                                            className={cn("p-3 pointer-events-auto")}
                                        />
                                    </PopoverContent>
                                </Popover>
                                <FormMessage>
                                    {form.formState.errors.startDate?.message}
                                </FormMessage>
                            </FormItem>
                            {/* End Date */}
                            <FormItem>
                                <FormLabel>End Date</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant={"outline"}
                                                className={cn(
                                                    "w-full justify-start text-left font-normal",
                                                    !endDate && "text-muted-foreground"
                                                )}
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {endDate
                                                    ? format(endDate, "PPP")
                                                    : <span>Pick a date</span>}
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={endDate}
                                            onSelect={d => {
                                                setEndDate(d);
                                                form.setValue("endDate", d ? format(d, "yyyy-MM-dd") : "");
                                            }}
                                            initialFocus
                                            className={cn("p-3 pointer-events-auto")}
                                        />
                                    </PopoverContent>
                                </Popover>
                                <FormMessage>
                                    {form.formState.errors.endDate?.message}
                                </FormMessage>
                            </FormItem>
                        </div>

                        <FormField
                            control={form.control}
                            name="status"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Status</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                        value={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select status" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value={ProjectStatus.PENDING}>
                                                Pending
                                            </SelectItem>
                                            <SelectItem value={ProjectStatus.ON_GOING}>
                                                On Going
                                            </SelectItem>
                                            <SelectItem value={ProjectStatus.ON_HOLD}>
                                                On Hold
                                            </SelectItem>
                                            <SelectItem value={ProjectStatus.EXPIRED}>
                                                Expired
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                                disabled={isSubmitting}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? "Updating..." : "Update Project"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
