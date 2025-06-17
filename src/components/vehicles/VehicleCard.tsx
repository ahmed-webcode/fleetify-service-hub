import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Car,
    Fuel,
    Calendar,
    User,
    Info,
    MapPin,
    MoreHorizontal,
    FileEdit,
    Trash2,
    ClipboardList,
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { HasPermission } from "../auth/HasPermission";

interface VehicleCardProps {
    id: string;
    model: string;
    licensePlate: string;
    fuelType: string;
    year: number;
    assignedStaff?: string;
    status: "active" | "maintenance" | "outOfService";
    lastLocation?: string;
    imgSrc?: string;
    onEdit?: (id: string) => void;
    onDelete?: (id: string) => void;
    onViewDetails?: (id: string) => void;
}

export function VehicleCard({
    id,
    model,
    licensePlate,
    fuelType,
    year,
    assignedStaff,
    status,
    lastLocation,
    imgSrc,
    onEdit,
    onDelete,
    onViewDetails,
}: VehicleCardProps) {
    const navigate = useNavigate();

    const getStatusColor = (status: string) => {
        switch (status) {
            case "active":
                return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
            case "maintenance":
                return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400";
            case "outOfService":
                return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
            default:
                return "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400";
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case "active":
                return "Active";
            case "maintenance":
                return "In Maintenance";
            case "outOfService":
                return "Out of Service";
            default:
                return status;
        }
    };

    const handleViewDetails = () => {
        if (onViewDetails) {
            onViewDetails(id);
        } else {
            navigate(`/vehicles/${id}`);
        }
    };

    return (
        <Card className="overflow-hidden transition-all duration-200 hover:shadow-md">
            <div className="relative">
                {imgSrc ? (
                    <img
                        src={imgSrc}
                        alt={model}
                        className="h-40 w-full object-cover bg-gray-200"
                        onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = "none";
                            const placeholder = document.createElement("div");
                            placeholder.className =
                                "bg-gradient-to-r from-slate-700 to-slate-800 h-40 flex items-center justify-center";
                            placeholder.innerHTML =
                                '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-12 w-12 text-white opacity-50"><path d="M14 16.5V13a2 2 0 0 0-2-2h- демократ2a2 2 0 0 0-2 2v3.5"></path><path d="M20 10h-5.5a2.5 2.5 0 0 0-5 0H4.5"></path><path d="M3 10V8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2"></path><line x1="12" x2="12" y1="2" y2="6"></line><line x1="7" x2="7" y1="2" y2="6"></line><line x1="17" x2="17" y1="2" y2="6"></line></svg>';
                            target.parentNode?.insertBefore(placeholder, target);
                        }}
                    />
                ) : (
                    <div className="bg-gradient-to-r from-slate-700 to-slate-800 h-40 flex items-center justify-center">
                        <Car className="h-12 w-12 text-white opacity-50" />
                    </div>
                )}
                <div className="absolute top-3 right-3">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="bg-white/90 hover:bg-white h-8 w-8"
                            >
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={handleViewDetails}>
                                <Info className="mr-2 h-4 w-4" /> View Details
                            </DropdownMenuItem>
                            <HasPermission permission="manage_vehicle" fallback={null}>
                                <DropdownMenuItem onClick={() => onEdit?.(id)}>
                                    <FileEdit className="mr-2 h-4 w-4" /> Edit Vehicle
                                </DropdownMenuItem>
                            </HasPermission>
                            {/* <DropdownMenuSeparator /> */}
                            {/* <DropdownMenuItem
                                className="text-red-600"
                                onClick={() => onDelete?.(id)}
                            >
                                <Trash2 className="mr-2 h-4 w-4" /> Delete Vehicle
                            </DropdownMenuItem> */}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                <div className="absolute -bottom-4 left-4">
                    <span className={`status-badge ${getStatusColor(status)}`}>
                        {getStatusText(status)}
                    </span>
                </div>
            </div>

            <CardContent className="pt-6">
                <div className="mt-2">
                    <h3 className="font-semibold text-lg">{model}</h3>
                    <p className="text-muted-foreground">{licensePlate}</p>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-4">
                    <div className="flex items-center text-sm">
                        <Fuel className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{fuelType}</span>
                    </div>
                    <div className="flex items-center text-sm">
                        <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{year}</span>
                    </div>
                    {assignedStaff && (
                        <div className="flex items-center text-sm col-span-2">
                            <User className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span>Owner: {assignedStaff}</span>
                        </div>
                    )}
                    {lastLocation && (
                        <div className="flex items-center text-sm col-span-2">
                            <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span>{lastLocation}</span>
                        </div>
                    )}
                </div>

                <div className="mt-5 flex gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={handleViewDetails}
                    >
                        Details
                    </Button>
                    {/* <Button variant="default" size="sm" className="flex-1">
                        <ClipboardList className="h-4 w-4 mr-2" />
                        Service Log
                    </Button> */}
                </div>
            </CardContent>
        </Card>
    );
}
