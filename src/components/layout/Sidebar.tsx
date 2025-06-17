import { useState, useEffect, useCallback } from 'react';
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
    Fuel,
    School,
    Bell,
    HelpCircle,
    LogOut,
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
    exactMatch?: boolean;
    requiresTransportDirector?: boolean;
}

export function Sidebar({ isCollapsed, setIsCollapsed, isMobileOpen, setIsMobileOpen }: SidebarProps) {
    const { user, hasPermission, selectedRole } = useAuth();
    const location = useLocation();
    const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);

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
    }, [setIsCollapsed, isMobileView]);

    const handleDesktopToggle = () => {
        const newState = !isCollapsed;
        setIsCollapsed(newState);
        localStorage.setItem('sidebarCollapsedState', newState.toString());
    };

    const handleMobileToggle = () => {
        setIsMobileOpen?.(!isMobileOpen);
    };

    const isTransportDirector = selectedRole?.id === 1; // TRANSPORT_DIRECTOR role ID

    // Refactor sidebarItems to wrap nav link visibility in permission checks per new mapping
    const sidebarItems: SidebarItem[] = [
        { name: 'Dashboard', icon: <BarChart size={20} />, path: '/dashboard', permission: 'view_user', exactMatch: true },
        { name: 'Vehicles', icon: <Car size={20} />, path: '/vehicles', permission: 'view_vehicle' },
        { name: 'Trip Management', icon: <MapPin size={20} />, path: '/trip-management', permission: 'view_trip_request' },
        { name: 'Fuel Management', icon: <Fuel size={20} />, path: '/fuel-management', permission: 'view_fuel' },
        { name: 'Projects Management', icon: <School size={20} />, path: '/projects-management', permission: 'manage_project', requiresTransportDirector: true },
        { name: 'User Management', icon: <Users size={20} />, path: '/user-management', permission: 'manage_user', requiresTransportDirector: true },
        { name: 'Settings', icon: <Settings size={20} />, path: '/settings', permission: null },
    ];

    const renderSidebarItems = (items: SidebarItem[]): React.ReactNode[] => {
        return items
            .filter(item => {
                // Filter by permission
                if (item.permission && !hasPermission(item.permission as Permission)) {
                    return false;
                }
                // Transport Director specific filter
                if (item.requiresTransportDirector && selectedRole?.id !== 1) {
                    return false;
                }
                return true;
            })
            .map((item) => {
                return (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        end={item.exactMatch || item.path === '/'}
                        className={({ isActive }) =>
                            cn(
                                'flex items-center gap-3 text-sm rounded-md transition-colors duration-150 ease-in-out group',
                                'focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1',
                                'px-3 py-2.5 text-slate-700 hover:bg-slate-100 hover:text-slate-900',
                                isActive && 'bg-blue-600 text-white hover:bg-blue-600 hover:text-white font-medium',
                                isCollapsed && !isMobileView && 'justify-center p-2.5'
                            )
                        }
                        title={isCollapsed && !isMobileView ? item.name : undefined}
                        onClick={() => {
                            if (isMobileView && setIsMobileOpen) {
                                setIsMobileOpen(false);
                            }
                        }}
                    >
                        <span className={cn('text-slate-500 group-hover:text-slate-700', 'group-[.bg-blue-600]:text-white')}>
                            {item.icon}
                        </span>
                        {(!isCollapsed || isMobileView) && <span className="truncate">{item.name}</span>}
                    </NavLink>
                );
            });
    };

    const getUserDisplayName = () => user?.fullName || user?.username || 'User';
    const getUserRoleDisplay = () => selectedRole?.name || 'System Role';

    const sidebarContent = (
        <>
            <div className={cn('flex items-center h-16 px-4 border-b border-slate-200 shrink-0', isCollapsed && !isMobileView ? 'justify-center' : 'justify-between')}>
                <NavLink to="/dashboard" className="flex items-center gap-2" title="AAU Fleet Management System Dashboard">
                    <img src="aau-logo.png" alt="AAU Logo" className={isCollapsed && !isMobileView ? "h-9 w-9" : "h-8 w-8"} style={{ borderRadius: "50%", background: "white" }} />
                    {(!isCollapsed || isMobileView) && <span className="text-xl font-semibold text-slate-800 tracking-tight">AAU FMS</span>}
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
                        onClick={() => { if (isMobileView && setIsMobileOpen) setIsMobileOpen(false); }}
                    >
                        <Bell size={19} className="text-slate-500 group-hover:text-slate-700 group-[.bg-blue-600]:text-white" />
                        {(!isCollapsed || isMobileView) && <span className="flex-1 truncate">Notifications</span>}
                        {(!isCollapsed || isMobileView) && <span className="ml-auto bg-blue-500 text-white text-xs font-semibold px-1.5 py-0.5 rounded-full">3</span>}
                    </NavLink>
                </div>
                <div className={cn('p-3 border-t border-slate-200')}>
                    {(!isCollapsed || isMobileView) ? (
                        <div className="flex items-center justify-between">
                            <NavLink to="/settings" className="flex items-center gap-2.5 group min-w-0" onClick={() => { if (isMobileView && setIsMobileOpen) setIsMobileOpen(false); }}>
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
                        <NavLink to="/settings" className="p-2 flex justify-center items-center text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded-md transition-colors" title={getUserDisplayName()}>
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
                        'fixed left-0 top-0 z-40 h-screen w-64 bg-background border-r border-slate-200 shadow-lg flex flex-col transition-transform duration-300 ease-in-out md:hidden',
                        isMobileOpen ? 'translate-x-0' : '-translate-x-full'
                    )}
                >
                    {sidebarContent}
                </aside>
            </>
        );
    }

    return (
        <aside className={cn('relative h-screen bg-background border-r border-slate-200 shadow-sm flex flex-col transition-width duration-300 ease-in-out', isCollapsed ? 'w-[72px]' : 'w-64')}>
            {sidebarContent}
            {isCollapsed && !isMobileView && (
                <button
                    onClick={handleDesktopToggle}
                    className="absolute left-full top-3 -translate-x-1/2 z-10 p-1 bg-background border border-slate-300 rounded-full shadow-md hover:bg-slate-50 text-slate-600 transition-all hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                    title="Expand sidebar"
                >
                    <Menu size={16} />
                </button>
            )}
        </aside>
    );
}
