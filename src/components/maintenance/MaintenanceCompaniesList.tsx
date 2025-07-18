import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
} from "@/components/ui/table";
import { CompanyFull } from "@/types/maintenance";
import { format } from "date-fns";

interface MaintenanceCompaniesListProps {
    companies: CompanyFull[];
}

export function MaintenanceCompaniesList({ companies }: MaintenanceCompaniesListProps) {
    const formatDate = (dateString?: string) => {
        if (!dateString) return "-";
        try {
            return format(new Date(dateString), "MMM dd, yyyy");
        } catch (e) {
            return dateString;
        }
    };

    if (!companies || companies.length === 0) {
        return (
            <div className="text-center py-8 text-muted-foreground">
                No maintenance companies found.
            </div>
        );
    }

    return (
        <div className="rounded-lg border border-border overflow-hidden">
            <Table>
                <TableHeader className="bg-muted/50">
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Address</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Internal</TableHead>
                        <TableHead>Created At</TableHead>
                        <TableHead>Updated At</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody className="divide-y divide-border">
                    {companies.map((company) => (
                        <TableRow key={company.id} className="hover:bg-muted/30">
                            <TableCell>{company.name}</TableCell>
                            <TableCell>{company.address}</TableCell>
                            <TableCell>{company.phoneNumber}</TableCell>
                            <TableCell>{company.email}</TableCell>
                            <TableCell>{company.internal ? "Yes" : "No"}</TableCell>
                            <TableCell>{formatDate(company.createdAt)}</TableCell>
                            <TableCell>{formatDate(company.updatedAt)}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
