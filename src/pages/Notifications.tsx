
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bell, Check, Clock, Fuel, Car, Wrench, AlertTriangle, CheckCircle, User, Building, FileText } from "lucide-react";
import { toast } from "sonner";
import { apiClient } from "@/lib/apiClient";
import { NotificationType } from "@/types/notification";

// Define which tabs to show - easily configurable
const shownTabs: (NotificationType | "ALL")[] = ["ALL", "TRIP", "FUEL", "USER"];

// Format date to relative time (e.g., "2 days ago")
const formatRelativeTime = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) {
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    if (diffHours === 0) {
      const diffMinutes = Math.floor(diffTime / (1000 * 60));
      return `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''} ago`;
    }
    return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
  } else if (diffDays === 1) {
    return 'Yesterday';
  }
  return `${diffDays} days ago`;
};

// Get icon based on notification type
const getTypeIcon = (type: NotificationType) => {
  switch (type) {
    case 'FUEL':
      return <Fuel className="h-5 w-5" />;
    case 'MAINTENANCE':
      return <Wrench className="h-5 w-5" />;
    case 'TRIP':
      return <Clock className="h-5 w-5" />;
    case 'VEHICLE':
      return <Car className="h-5 w-5" />;
    case 'INCIDENT':
      return <AlertTriangle className="h-5 w-5" />;
    case 'USER':
      return <User className="h-5 w-5" />;
    case 'PROJECT':
      return <Building className="h-5 w-5" />;
    case 'POSITION':
    case 'ITEM':
    case 'INSURANCE':
      return <FileText className="h-5 w-5" />;
    default:
      return <Bell className="h-5 w-5" />;
  }
};

export default function Notifications() {
  const [activeTab, setActiveTab] = useState<NotificationType | "ALL">("ALL");
  const [readFilter, setReadFilter] = useState<"all" | "read" | "unread">("all");
  const [currentPage, setCurrentPage] = useState(0);
  const queryClient = useQueryClient();

  const { data: notificationsData, isLoading, error } = useQuery({
    queryKey: ["notifications", activeTab, readFilter, currentPage],
    queryFn: () => apiClient.notifications.getAll({
      page: currentPage,
      size: 20,
      sortBy: "createdAt",
      direction: "DESC",
      type: activeTab === "ALL" ? undefined : activeTab,
      isRead: readFilter === "all" ? undefined : readFilter === "read"
    }),
  });

  const markAsReadMutation = useMutation({
    mutationFn: (id: number) => apiClient.notifications.markAsRead(id, { isRead: true }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      toast.success("Notification marked as read");
    },
    onError: () => {
      toast.error("Failed to mark notification as read");
    },
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      const unreadNotifications = notificationsData?.content.filter(n => !n.isRead) || [];
      await Promise.all(
        unreadNotifications.map(notification => 
          apiClient.notifications.markAsRead(notification.id, { isRead: true })
        )
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      toast.success("All notifications marked as read");
    },
    onError: () => {
      toast.error("Failed to mark all notifications as read");
    },
  });

  const notifications = notificationsData?.content || [];
  const unreadCount = notifications.filter(n => !n.isRead).length;
  const totalPages = notificationsData?.totalPages || 0;

  const handleMarkAsRead = (id: number) => {
    markAsReadMutation.mutate(id);
  };

  const handleMarkAllAsRead = () => {
    markAllAsReadMutation.mutate();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
          {unreadCount > 0 && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleMarkAllAsRead}
              disabled={markAllAsReadMutation.isPending}
              title="Mark selected tab notifications as read"
            >
              <Check className="mr-2 h-4 w-4" />
              Mark all as read
            </Button>
          )}
        </div>
        <p className="text-muted-foreground">
          You have {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
        </p>
      </div>

      <Tabs defaultValue="ALL" value={activeTab} onValueChange={(value) => {
        setActiveTab(value as NotificationType | "ALL");
        setCurrentPage(0);
      }}>
        <TabsList className={`grid grid-cols-${shownTabs.length}`}>
          {shownTabs.map((tab) => (
            <TabsTrigger key={tab} value={tab}>
              {tab === "ALL" ? "All" : tab.charAt(0) + tab.slice(1).toLowerCase()}
            </TabsTrigger>
          ))}
        </TabsList>
        
        <TabsContent value={activeTab} className="mt-4">
          <div className="flex justify-between items-center mb-4">
            <Select 
              value={readFilter} 
              onValueChange={(value: "all" | "read" | "unread") => {
                setReadFilter(value);
                setCurrentPage(0);
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All notifications</SelectItem>
                <SelectItem value="unread">Unread only</SelectItem>
                <SelectItem value="read">Read only</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {isLoading ? (
              <div className="text-center py-8">Loading notifications...</div>
            ) : error ? (
              <div className="text-center py-8 text-red-500">Failed to load notifications</div>
            ) : notifications.length === 0 ? (
              <Card className="border-dashed">
                <CardContent className="pt-6 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <Bell className="h-8 w-8 text-muted-foreground/50" />
                    <p className="text-muted-foreground">No notifications found</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              notifications.map((notification) => (
                <Card key={notification.id} className={notification.isRead ? "opacity-70" : ""}>
                  <CardHeader className="pb-2 flex flex-row items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`p-2 rounded-full ${notification.isRead ? 'bg-slate-100' : 'bg-primary/10'}`}>
                        {getTypeIcon(notification.type)}
                      </div>
                      <div>
                        <CardTitle className="text-lg flex items-center gap-2">
                          {notification.type.charAt(0) + notification.type.slice(1).toLowerCase()} Notification
                          {!notification.isRead && (
                            <span className="w-2 h-2 bg-blue-500 rounded-full inline-block"></span>
                          )}
                        </CardTitle>
                        <CardDescription title={new Date(notification.createdAt).toLocaleString()}>{formatRelativeTime(notification.createdAt)}</CardDescription>
                      </div>
                    </div>
                    <Badge variant={notification.isRead ? "secondary" : "default"}>
                      {notification.isRead ? "Read" : "Unread"}
                    </Badge>
                  </CardHeader>
                  <CardContent>
                    <p>{notification.message}</p>
                  </CardContent>
                  <CardFooter className="flex justify-end pt-0">
                    {!notification.isRead && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleMarkAsRead(notification.id)}
                        disabled={markAsReadMutation.isPending}
                      >
                        <Check className="mr-2 h-4 w-4" />
                        Mark as read
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              ))
            )}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-6">
              <Button 
                variant="outline" 
                size="sm" 
                disabled={currentPage === 0}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {currentPage + 1} of {totalPages}
              </span>
              <Button 
                variant="outline" 
                size="sm" 
                disabled={currentPage >= totalPages - 1}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
