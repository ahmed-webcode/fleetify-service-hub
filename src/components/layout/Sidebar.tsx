import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth, Permission } from '@/contexts/AuthContext';
import {
    BarChart,
    Car,
    ChevronLeft,
    MapPin,
    Settings,
    User,
    Users,
    Wrench,
    FileText,
    Shield,
    Building,
    Fuel,
    Landmark,
    GraduationCap,
    BookOpen,
    PlaneTakeoff,
    Bell,
    HelpCircle,
    LogOut,
    UserCog,
} from 'lucide-react';

interface SidebarProps {
    isCollapsed: boolean;
    setIsCollapsed: (collapsed: boolean) => void;
}

interface SidebarItem {
    name: string;
    icon: React.ReactNode;
    path: string;
    permission: string | null;
    children?: SidebarItem[];
}

export function Sidebar({ isCollapsed, setIsCollapsed }: SidebarProps) {
    const { user, hasPermission } = useAuth();
    const location = useLocation();
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const savedState = localStorage.getItem('sidebarState');
        if (savedState) {
            setIsCollapsed(savedState === 'closed');
        }
        const savedOpenGroups = localStorage.getItem('sidebarOpenGroups');
        if (savedOpenGroups) {
            setOpenGroups(JSON.parse(savedOpenGroups));
        }
    }, [setIsCollapsed]);

    const handleToggle = () => {
        const newCollapsedState = !isCollapsed;
        setIsCollapsed(newCollapsedState);
        localStorage.setItem('sidebarState', newCollapsedState ? 'closed' : 'open');
    };

    const toggleGroup = (groupName: string) => {
        const newOpenGroups = {
            ...openGroups,
            [groupName]: !openGroups[groupName],
        };
        setOpenGroups(newOpenGroups);
        localStorage.setItem('sidebarOpenGroups', JSON.stringify(newOpenGroups));
    };

    // Reorganized sidebar items
    const sidebarItems: SidebarItem[] = [
        {
            name: 'Dashboard',
            icon: <BarChart size={20} />,
            path: '/dashboard',
            permission: null,
        },
        {
            name: 'Fleet Operations',
            icon: <Car size={20} />,
            path: '#',
            permission: null,
            children: [
                {
                    name: 'Vehicles',
                    icon: <Car size={20} />,
                    path: '/vehicles',
                    permission: null,
                },
                {
                    name: 'GPS Tracking',
                    icon: <MapPin size={20} />,
                    path: '/gps-tracking',
                    permission: 'track_vehicles',
                },
                {
                    name: 'Trip Requests',
                    icon: <PlaneTakeoff size={20} />,
                    path: '/trip-requests',
                    permission: 'request_fleet',
                },
                {
                    name: 'Fuel Management',
                    icon: <Fuel size={20} />,
                    path: '/fuel-management',
                    permission: null,
                },
            ],
        },
        {
            name: 'Service Requests',
            icon: <FileText size={20} />,
            path: '/service-requests',
            permission: null,
        },
        {
            name: 'Services & Incidents',
            icon: <Wrench size={20} />,
            path: '#',
            permission: null,
            children: [
                {
                    name: 'Maintenance Records',
                    icon: <Wrench size={20} />,
                    path: '/maintenance-requests',
                    permission: 'approve_maintenance',
                },
                {
                    name: 'Request Maintenance',
                    icon: <FileText size={20} />,
                    path: '/request-maintenance',
                    permission: 'request_maintenance',
                },
                {
                    name: 'Report Incident',
                    icon: <Shield size={20} />,
                    path: '/report-incident',
                    permission: 'report_incidents',
                },
                {
                    name: 'Insurance Management',
                    icon: <Shield size={20} />,
                    path: '/insurance-management',
                    permission: null,
                },
            ],
        },
        {
            name: 'Reports',
            icon: <BarChart size={20} />,
            path: '/reports',
            permission: 'view_reports',
        },
        {
            name: 'Administration',
            icon: <UserCog size={20} />, // Icon similar to the reference image
            path: '#',
            permission: null, // Overall admin section visibility (can be more specific)
            children: [
                {
                    name: 'User Management', // Formerly "Users"
                    icon: <Users size={20} />,
                    path: '#',
                    permission: 'add_users', // Permission for the "Users" sub-section
                    children: [
                        {
                            name: 'Staff',
                            icon: <Users size={20} />,
                            path: '/manage-staff',
                            permission: 'add_users',
                        },
                        {
                            name: 'Drivers',
                            icon: <User size={20} />,
                            path: '/driver-management',
                            permission: 'manage_drivers',
                        },
                    ],
                },
                {
                    name: 'Organizational Units', // Formerly "Organization"
                    icon: <Building size={20} />,
                    path: '#',
                    permission: null, // Permission for the "Organization" sub-section
                    children: [
                        {
                            name: 'Colleges',
                            icon: <GraduationCap size={20} />,
                            path: '/colleges',
                            permission: null,
                        },
                        {
                            name: 'Institutes',
                            icon: <BookOpen size={20} />,
                            path: '/institutes',
                            permission: null,
                        },
                        {
                            name: 'Central Offices',
                            icon: <Landmark size={20} />,
                            path: '/central-offices',
                            permission: null,
                        },
                    ],
                },
            ],
        },
        {
            name: 'Settings',
            icon: <Settings size={20} />,
            path: '/settings',
            permission: null,
        },
    ];

    const filteredSidebarItems = sidebarItems.filter((item) => {
        // If item has no specific permission, it's visible by default (children will be checked later)
        if (!item.permission) return true;
        // Otherwise, check if user has the permission for this top-level item
        return hasPermission(item.permission as Permission);
    });

    const renderSidebarItems = (items: SidebarItem[], isChild: boolean = false) => {
        return items.map((item) => {
            const visibleChildren = item.children
                ? item.children.filter(
                      (child) => !child.permission || hasPermission(child.permission as Permission)
                  )
                : [];

            if (item.children && visibleChildren.length === 0 && item.path === '#') {
                // If this parent item itself requires a permission and the user doesn't have it,
                // it would have been filtered by `filteredSidebarItems` if it's top-level.
                // If it's a sub-parent (like User Management), its own permission is checked below.
                // This primarily hides parent groups if NO children are accessible.
                if (item.permission && !hasPermission(item.permission as Permission)) return null; // Hide if parent itself is not permitted
                if (!item.permission) return null; // Hide if parent has no permission and no visible children
            }

            // For sub-parents that have their own permission (e.g., User Management under Administration)
            if (item.permission && !hasPermission(item.permission as Permission)) {
                return null;
            }

            if (item.children && visibleChildren.length > 0) {
                const isOpen = openGroups[item.name] || false;
                const isParentActive = visibleChildren.some(
                    (child) => location.pathname.startsWith(child.path) && child.path !== '/'
                );

                return (
                    <div key={item.name} className="w-full">
                        <button
                            className={cn(
                                'flex items-center gap-3 w-full px-3 py-2.5 rounded-md text-slate-600 hover:bg-slate-100 hover:text-slate-800 transition-colors',
                                (isOpen || isParentActive) &&
                                    !isCollapsed &&
                                    'bg-slate-50 text-slate-800 font-medium',
                                isCollapsed && 'justify-center px-0 py-2.5'
                            )}
                            onClick={() => !isCollapsed && toggleGroup(item.name)}
                            title={isCollapsed ? item.name : undefined}
                        >
                            <span
                                className={cn(
                                    isParentActive && !isCollapsed
                                        ? 'text-blue-600'
                                        : 'text-slate-500'
                                )}
                            >
                                {item.icon}
                            </span>
                            {!isCollapsed && (
                                <>
                                    <span className="flex-1 text-left">{item.name}</span>
                                    <ChevronLeft
                                        size={16}
                                        className={cn(
                                            'transition-transform text-slate-500',
                                            isOpen ? '-rotate-90' : 'rotate-0'
                                        )}
                                    />
                                </>
                            )}
                        </button>

                        {!isCollapsed && isOpen && (
                            <div className="mt-1 space-y-1 pl-5">
                                {renderSidebarItems(visibleChildren, true)}
                            </div>
                        )}
                    </div>
                );
            }

            // Leaf node NavLink (or parent that acts as a direct link but has no visible children handled above)
            return (
                <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                        cn(
                            'flex items-center gap-3 px-3 py-2.5 rounded-md text-slate-600 hover:bg-slate-100 hover:text-slate-800 transition-colors group',
                            isActive &&
                                item.path !== '#' &&
                                'bg-blue-600 text-white hover:bg-blue-600 hover:text-white font-medium',
                            isCollapsed && 'justify-center px-0 py-2.5',
                            isChild && 'py-2'
                        )
                    }
                    title={isCollapsed ? item.name : undefined}
                >
                    <span
                        className={cn(
                            'text-slate-500 group-hover:text-slate-700',
                            'group-[.bg-blue-600]:text-white'
                        )}
                    >
                        {item.icon}
                    </span>
                    {!isCollapsed && <span>{item.name}</span>}
                </NavLink>
            );
        });
    };

    const commonSidebarClasses =
        'flex flex-col h-screen bg-white border-r border-slate-200 shadow-sm transition-all duration-300';

    // ... (rest of the component remains the same: mobile view, desktop main structure, bottom section)
    if (isMobile && !isCollapsed) {
        return (
            <div className="fixed inset-0 z-40 bg-black/50" onClick={handleToggle}>
                <aside
                    className={cn(commonSidebarClasses, 'fixed left-0 top-0 w-64 z-50')}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="flex items-center justify-between h-16 px-4 border-b border-slate-200">
                        <NavLink to="/dashboard" className="flex items-center gap-2">
                            <Car size={28} className="text-blue-600" />
                            <span className="text-xl font-bold text-slate-800">FleetHub</span>
                        </NavLink>
                        <button
                            onClick={handleToggle}
                            className="p-2 rounded-md hover:bg-slate-100 text-slate-600"
                        >
                            <ChevronLeft size={20} />
                        </button>
                    </div>

                    <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-1">
                        {renderSidebarItems(filteredSidebarItems)}
                    </nav>

                    <div className="px-2 py-2 border-t border-slate-200 space-y-1">
                        <NavLink
                            to="/notifications"
                            className={({ isActive }) =>
                                cn(
                                    'flex items-center gap-3 px-3 py-2.5 rounded-md text-slate-600 hover:bg-slate-100 hover:text-slate-800 transition-colors group',
                                    isActive &&
                                        'bg-blue-600 text-white hover:bg-blue-600 hover:text-white font-medium'
                                )
                            }
                        >
                            <Bell
                                size={20}
                                className="text-slate-500 group-hover:text-slate-700 group-[.bg-blue-600]:text-white"
                            />
                            <span className="flex-1">Notifications</span>
                            <span className="bg-blue-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                                3
                            </span>
                        </NavLink>
                        <NavLink
                            to="/help-support"
                            className={({ isActive }) =>
                                cn(
                                    'flex items-center gap-3 px-3 py-2.5 rounded-md text-slate-600 hover:bg-slate-100 hover:text-slate-800 transition-colors group',
                                    isActive &&
                                        'bg-blue-600 text-white hover:bg-blue-600 hover:text-white font-medium'
                                )
                            }
                        >
                            <HelpCircle
                                size={20}
                                className="text-slate-500 group-hover:text-slate-700 group-[.bg-blue-600]:text-white"
                            />
                            <span>Help & Support</span>
                        </NavLink>
                    </div>

                    <div className="p-3 border-t border-slate-200">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                                <User
                                    size={36}
                                    className="rounded-full text-slate-600 bg-slate-100 p-1.5"
                                />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-slate-800 truncate">
                                        {user?.fullName || 'Transport Director'}
                                    </p>
                                    <p className="text-xs text-slate-500 truncate">
                                        {user?.role?.replace(/_/g, ' ') || 'System User'}
                                    </p>
                                </div>
                            </div>
                            <button
                                className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-md"
                                title="Logout"
                            >
                                <LogOut size={18} />
                            </button>
                        </div>
                    </div>
                </aside>
            </div>
        );
    }

    return (
        <aside className={cn(commonSidebarClasses, 'relative', isCollapsed ? 'w-[72px]' : 'w-64')}>
            <div
                className={cn(
                    'flex items-center h-16 px-4 border-b border-slate-200',
                    isCollapsed ? 'justify-center' : 'justify-between'
                )}
            >
                <NavLink
                    to="/dashboard"
                    className="flex items-center gap-2"
                    title="FleetHub Dashboard"
                >
                    <Car size={isCollapsed ? 32 : 28} className="text-blue-600" />
                    {!isCollapsed && (
                        <span className="text-xl font-bold text-slate-800">FleetHub</span>
                    )}
                </NavLink>
                {!isMobile && !isCollapsed && (
                    <button
                        onClick={handleToggle}
                        className="p-2 rounded-md hover:bg-slate-100 text-slate-600"
                        title="Collapse sidebar"
                    >
                        <ChevronLeft size={20} />
                    </button>
                )}
            </div>

            {!isMobile && isCollapsed && (
                <button
                    onClick={handleToggle}
                    className="absolute left-full top-4 -ml-[16px] z-10 p-1 bg-white border border-slate-300 rounded-full shadow-md hover:bg-slate-50 text-slate-600 transition-all hover:shadow-lg"
                    title="Expand sidebar"
                >
                    <ChevronLeft size={18} className="rotate-180" />
                </button>
            )}

            <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-1">
                {renderSidebarItems(filteredSidebarItems)}
            </nav>

            <div
                className={cn(
                    'border-t border-slate-200',
                    isCollapsed && 'flex flex-col items-center'
                )}
            >
                <div
                    className={cn(
                        'px-2 py-2 space-y-1',
                        isCollapsed && 'w-full flex flex-col items-center'
                    )}
                >
                    <NavLink
                        to="/notifications"
                        className={({ isActive }) =>
                            cn(
                                'flex items-center gap-3 px-3 py-2.5 rounded-md text-slate-600 hover:bg-slate-100 hover:text-slate-800 transition-colors group',
                                isActive &&
                                    'bg-blue-600 text-white hover:bg-blue-600 hover:text-white font-medium',
                                isCollapsed && 'p-2.5 justify-center'
                            )
                        }
                        title={isCollapsed ? 'Notifications' : undefined}
                    >
                        <Bell
                            size={20}
                            className="text-slate-500 group-hover:text-slate-700 group-[.bg-blue-600]:text-white"
                        />
                        {!isCollapsed && <span className="flex-1">Notifications</span>}
                        {!isCollapsed && (
                            <span className="bg-blue-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                                3
                            </span>
                        )}
                    </NavLink>
                    <NavLink
                        to="/help-support"
                        className={({ isActive }) =>
                            cn(
                                'flex items-center gap-3 px-3 py-2.5 rounded-md text-slate-600 hover:bg-slate-100 hover:text-slate-800 transition-colors group',
                                isActive &&
                                    'bg-blue-600 text-white hover:bg-blue-600 hover:text-white font-medium',
                                isCollapsed && 'p-2.5 justify-center'
                            )
                        }
                        title={isCollapsed ? 'Help & Support' : undefined}
                    >
                        <HelpCircle
                            size={20}
                            className="text-slate-500 group-hover:text-slate-700 group-[.bg-blue-600]:text-white"
                        />
                        {!isCollapsed && <span>Help & Support</span>}
                    </NavLink>
                </div>

                <div
                    className={cn(
                        'p-3',
                        isCollapsed
                            ? 'border-t border-slate-200 w-full flex justify-center py-2.5'
                            : 'border-t border-slate-200'
                    )}
                >
                    {!isCollapsed ? (
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                                <User
                                    size={36}
                                    className="rounded-full text-slate-600 bg-slate-100 p-1.5"
                                />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-slate-800 truncate">
                                        {user?.fullName || 'Transport Director'}
                                    </p>
                                    <p className="text-xs text-slate-500 truncate">
                                        {user?.role?.replace(/_/g, ' ') || 'System User'}
                                    </p>
                                </div>
                            </div>
                            <button
                                className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-md"
                                title="Logout"
                            >
                                <LogOut size={18} />
                            </button>
                        </div>
                    ) : (
                        <button
                            className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-md"
                            title="Logout"
                        >
                            <LogOut size={20} />
                        </button>
                    )}
                </div>
            </div>
        </aside>
    );
}
