import { useState, useEffect, useCallback } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth, Permission } from '@/contexts/AuthContext';
import {
    BarChart,
    Car,
    ChevronLeft,
    ChevronDown,
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
    Menu,
} from 'lucide-react';

interface SidebarProps {
    isCollapsed: boolean;
    setIsCollapsed: (collapsed: boolean) => void;
    isMobileOpen?: boolean;
    setIsMobileOpen?: (open: boolean) => void;
}

interface SidebarItem {
    name: string;
    icon: React.ReactNode;
    path: string;
    permission: string | null;
    children?: SidebarItem[];
    exactMatch?: boolean;
}

export function Sidebar({ isCollapsed, setIsCollapsed, isMobileOpen, setIsMobileOpen }: SidebarProps) {
    const { user, hasPermission, selectedRole } = useAuth();
    const location = useLocation();
    const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);
    const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});

    const handleResize = useCallback(() => {
        const mobile = window.innerWidth < 768;
        setIsMobileView(mobile);
        if (!mobile && setIsMobileOpen) {
            setIsMobileOpen(false); 
        }
    }, [setIsMobileOpen]);

    useEffect(() => {
        window.addEventListener('resize', handleResize);
        handleResize(); 
        return () => window.removeEventListener('resize', handleResize);
    }, [handleResize]);

    useEffect(() => {
        if (!isMobileView) {
            const savedState = localStorage.getItem('sidebarCollapsedState');
            if (savedState) {
                setIsCollapsed(savedState === 'true');
            }
        }
        const savedOpenGroups = localStorage.getItem('sidebarOpenGroups');
        if (savedOpenGroups) {
            setOpenGroups(JSON.parse(savedOpenGroups));
        }
    }, [setIsCollapsed, isMobileView]);

    const handleDesktopToggle = () => {
        const newState = !isCollapsed;
        setIsCollapsed(newState);
        localStorage.setItem('sidebarCollapsedState', newState.toString());
    };
    
    const handleMobileToggle = () => {
        setIsMobileOpen?.(!isMobileOpen);
    };

    const toggleGroup = (groupName: string) => {
        const newOpenGroups = {
            ...openGroups,
            [groupName]: !openGroups[groupName],
        };
        setOpenGroups(newOpenGroups);
        localStorage.setItem('sidebarOpenGroups', JSON.stringify(newOpenGroups));
    };

    const sidebarItems: SidebarItem[] = [
        { name: 'Dashboard', icon: <BarChart size={20} />, path: '/dashboard', permission: null, exactMatch: true },
        {
            name: 'Fleet Operations', icon: <Car size={20} />, path: '#fleet-ops', permission: null,
            children: [
                { name: 'Vehicles', icon: <Car size={18} />, path: '/vehicles', permission: null },
                { name: 'GPS Tracking', icon: <MapPin size={18} />, path: '/gps-tracking', permission: 'track_vehicles' },
                { name: 'Trip Requests', icon: <PlaneTakeoff size={18} />, path: '/trip-requests', permission: 'request_fleet' },
                { name: 'Fuel Management', icon: <Fuel size={18} />, path: '/fuel-management', permission: null },
            ],
        },
        { name: 'Service Requests', icon: <FileText size={20} />, path: '/service-requests', permission: null },
        {
            name: 'Services & Incidents', icon: <Wrench size={20} />, path: '#services', permission: null,
            children: [
                { name: 'Maintenance Records', icon: <Wrench size={18} />, path: '/maintenance-requests', permission: 'approve_maintenance' },
                { name: 'Request Maintenance', icon: <FileText size={18} />, path: '/request-maintenance', permission: 'request_maintenance' },
                { name: 'Report Incident', icon: <Shield size={18} />, path: '/report-incident', permission: 'report_incidents' },
                { name: 'Insurance Management', icon: <Shield size={18} />, path: '/insurance-management', permission: null },
            ],
        },
        { name: 'Reports', icon: <BarChart size={20} />, path: '/reports', permission: 'view_reports' },
        {
            name: 'Administration', icon: <UserCog size={20} />, path: '#admin', permission: 'view_admin_section', // Example permission for whole section
            children: [
                {
                    name: 'User Management', icon: <Users size={18} />, path: '#user-mgmt', permission: 'manage_users_section', // Example permission for sub-section
                    children: [
                        { name: 'Staff', icon: <Users size={16} />, path: '/manage-staff', permission: 'add_users' },
                        { name: 'Drivers', icon: <User size={16} />, path: '/driver-management', permission: 'manage_drivers' },
                    ],
                },
                {
                    name: 'Organizational Units', icon: <Building size={18} />, path: '#org-units', permission: 'manage_org_units_section',
                    children: [
                        { name: 'Colleges', icon: <GraduationCap size={16} />, path: '/colleges', permission: null },
                        { name: 'Institutes', icon: <BookOpen size={16} />, path: '/institutes', permission: null },
                        { name: 'Central Offices', icon: <Landmark size={16} />, path: '/central-offices', permission: null },
                    ],
                },
            ],
        },
        { name: 'Settings', icon: <Settings size={20} />, path: '/settings', permission: null },
    ];

    const renderSidebarItems = (items: SidebarItem[], level: number = 0): React.ReactNode[] => {
        return items
            .filter(item => !item.permission || hasPermission(item.permission as Permission))
            .map((item) => {
                const effectiveChildren = item.children?.filter(child => !child.permission || hasPermission(child.permission as Permission)) || [];
                const isGroup = item.path.startsWith('#');

                if (isGroup) {
                    if (effectiveChildren.length === 0) return null; 
                    const isOpen = openGroups[item.name] || false;
                    const isParentActive = effectiveChildren.some(child => location.pathname.startsWith(child.path) && child.path !== '/');

                    return (
                        <div key={item.name} className="w-full">
                            <button
                                type="button"
                                className={cn(
                                    'flex items-center gap-3 w-full text-sm rounded-md transition-colors duration-150 ease-in-out',
                                    'focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1',
                                    level === 0 ? 'px-3 py-2.5 text-slate-700 hover:bg-slate-100 hover:text-slate-900' : 'px-3 py-2 text-slate-600 hover:bg-slate-50 hover:text-slate-800',
                                    (isOpen || (isParentActive && !isCollapsed)) && !isCollapsed && (level === 0 ? 'bg-slate-100 text-slate-900 font-medium' : 'text-slate-800 font-medium'),
                                    isCollapsed && level === 0 && 'justify-center p-2.5',
                                    isCollapsed && level > 0 && 'hidden' 
                                )}
                                onClick={() => !isCollapsed && toggleGroup(item.name)}
                                title={isCollapsed ? item.name : undefined}
                                aria-expanded={isOpen}
                            >
                                <span className={cn('text-slate-500', (isOpen || isParentActive) && !isCollapsed && 'text-blue-600', isCollapsed && isParentActive && 'text-blue-600')}>
                                    {item.icon}
                                </span>
                                {!isCollapsed && <span className="flex-1 text-left truncate">{item.name}</span>}
                                {!isCollapsed && <ChevronDown size={16} className={cn('text-slate-400 transition-transform duration-200', isOpen ? 'rotate-180' : 'rotate-0')} />}
                            </button>
                            {!isCollapsed && isOpen && (
                                <div className="mt-1 space-y-0.5 pl-5">
                                    {renderSidebarItems(effectiveChildren, level + 1)}
                                </div>
                            )}
                        </div>
                    );
                }

                return (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        end={item.exactMatch || item.path === '/'}
                        className={({ isActive }) =>
                            cn(
                                'flex items-center gap-3 text-sm rounded-md transition-colors duration-150 ease-in-out group',
                                'focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1',
                                level === 0 ? 'px-3 py-2.5 text-slate-700 hover:bg-slate-100 hover:text-slate-900' : 'px-3 py-2 text-slate-600 hover:bg-slate-50 hover:text-slate-800',
                                isActive && (level === 0 ? 'bg-blue-600 text-white hover:bg-blue-600 hover:text-white font-medium' : 'bg-blue-50 text-blue-700 font-medium hover:bg-blue-100'),
                                isCollapsed && level === 0 && 'justify-center p-2.5',
                                isCollapsed && level > 0 && 'hidden' 
                            )
                        }
                        title={isCollapsed ? item.name : undefined}
                    >
                        <span className={cn('text-slate-500 group-hover:text-slate-700', 'group-[.bg-blue-600]:text-white', 'group-[.bg-blue-50]:text-blue-600')}>
                            {item.icon}
                        </span>
                        {!isCollapsed && <span className="truncate">{item.name}</span>}
                    </NavLink>
                );
            });
    };

    const getUserDisplayName = () => user?.fullName || user?.username || 'User';
    const getUserRoleDisplay = () => selectedRole?.name || 'System Role';

    const sidebarContent = (
        <>
            <div className={cn('flex items-center h-16 px-4 border-b border-slate-200 shrink-0', isCollapsed && !isMobileView ? 'justify-center' : 'justify-between')}>
                <NavLink to="/dashboard" className="flex items-center gap-2" title="FleetHub Dashboard">
                    <Car size={(isCollapsed && !isMobileView) ? 30 : 26} className="text-blue-600" />
                    {(!isCollapsed || isMobileView) && <span className="text-xl font-semibold text-slate-800 tracking-tight">FleetHub</span>}
                </NavLink>
                {isMobileView ? (
                     <button onClick={handleMobileToggle} className="p-1.5 rounded-md hover:bg-slate-100 text-slate-500 hover:text-slate-700 md:hidden" title="Close menu">
                        <ChevronLeft size={18} />
                    </button>
                ) : !isCollapsed && (
                    <button onClick={handleDesktopToggle} className="p-1.5 rounded-md hover:bg-slate-100 text-slate-500 hover:text-slate-700" title="Collapse sidebar">
                        <ChevronLeft size={18} />
                    </button>
                )}
            </div>

            <nav className="flex-1 overflow-y-auto overflow-x-hidden py-3 px-2 space-y-0.5">
                {renderSidebarItems(sidebarItems)}
            </nav>

            <div className="mt-auto shrink-0 border-t border-slate-200">
                <div className={cn('px-2 py-2 space-y-0.5')}>
                    <NavLink
                        to="/notifications"
                        className={({ isActive }) => cn(
                            'flex items-center gap-3 px-3 py-2 rounded-md text-sm text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors group',
                            isActive && 'bg-blue-600 text-white hover:bg-blue-700 hover:text-white font-medium',
                            isCollapsed && !isMobileView && 'p-2.5 justify-center'
                        )}
                        title={isCollapsed && !isMobileView ? 'Notifications' : undefined}
                    >
                        <Bell size={19} className="text-slate-500 group-hover:text-slate-700 group-[.bg-blue-600]:text-white" />
                        {(!isCollapsed || isMobileView) && <span className="flex-1 truncate">Notifications</span>}
                        {(!isCollapsed || isMobileView) && <span className="ml-auto bg-blue-500 text-white text-xs font-semibold px-1.5 py-0.5 rounded-full">3</span>}
                    </NavLink>
                    <NavLink
                        to="/help-support"
                        className={({ isActive }) => cn(
                            'flex items-center gap-3 px-3 py-2 rounded-md text-sm text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors group',
                            isActive && 'bg-blue-600 text-white hover:bg-blue-700 hover:text-white font-medium',
                            isCollapsed && !isMobileView && 'p-2.5 justify-center'
                        )}
                        title={isCollapsed && !isMobileView ? 'Help & Support' : undefined}
                    >
                        <HelpCircle size={19} className="text-slate-500 group-hover:text-slate-700 group-[.bg-blue-600]:text-white" />
                        {(!isCollapsed || isMobileView) && <span className="truncate">Help & Support</span>}
                    </NavLink>
                </div>
                <div className={cn('p-3 border-t border-slate-200')}>
                    {(!isCollapsed || isMobileView) ? (
                        <div className="flex items-center justify-between">
                            <NavLink to="/profile" className="flex items-center gap-2.5 group min-w-0">
                                <User size={36} className="rounded-full text-slate-500 bg-slate-100 p-1.5 group-hover:bg-slate-200 transition-colors shrink-0" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-slate-800 truncate group-hover:text-blue-600 transition-colors">{getUserDisplayName()}</p>
                                    <p className="text-xs text-slate-500 truncate">{getUserRoleDisplay()}</p>
                                </div>
                            </NavLink>
                            <button className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors shrink-0" title="Logout">
                                <LogOut size={18} />
                            </button>
                        </div>
                    ) : (
                        <NavLink to="/profile" className="p-2 flex justify-center items-center text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded-md transition-colors" title={getUserDisplayName()}>
                            <User size={20} />
                        </NavLink>
                    )}
                </div>
            </div>
        </>
    );

    if (isMobileView) {
        return (
            <>
                {isMobileOpen && <div className="fixed inset-0 z-30 bg-black/30 backdrop-blur-sm md:hidden" onClick={handleMobileToggle} aria-hidden="true" />}
                <aside
                    className={cn(
                        'fixed left-0 top-0 z-40 h-screen w-64 bg-white border-r border-slate-200 shadow-lg flex flex-col transition-transform duration-300 ease-in-out md:hidden',
                        isMobileOpen ? 'translate-x-0' : '-translate-x-full'
                    )}
                >
                    {sidebarContent}
                </aside>
            </>
        );
    }

    return (
        <aside className={cn('relative h-screen bg-white border-r border-slate-200 shadow-sm flex flex-col transition-width duration-300 ease-in-out', isCollapsed ? 'w-[72px]' : 'w-64')}>
            {sidebarContent}
            {isCollapsed && (
                <button
                    onClick={handleDesktopToggle}
                    className="absolute left-full top-3 -translate-x-1/2 z-10 p-1 bg-white border border-slate-300 rounded-full shadow-md hover:bg-slate-50 text-slate-600 transition-all hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                    title="Expand sidebar"
                >
                    <Menu size={16} />
                </button>
            )}
        </aside>
    );
}
