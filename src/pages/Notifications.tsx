
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, Check, Clock, Fuel, Car, Wrench, AlertTriangle, CheckCircle } from "lucide-react";
import { toast } from "sonner";

// Mock notification data
const mockNotifications = [
  {
    id: "1",
    title: "Fuel Request Approved",
    message: "Your fuel request for vehicle ABC-123 has been approved.",
    date: "2023-05-15T10:30:00",
    type: "approval",
    read: false,
    category: "fuel"
  },
  {
    id: "2",
    title: "Maintenance Scheduled",
    message: "Maintenance for vehicle XYZ-789 scheduled for tomorrow.",
    date: "2023-05-14T08:45:00",
    type: "info",
    read: true,
    category: "maintenance"
  },
  {
    id: "3",
    title: "Trip Request Pending",
    message: "New trip request awaiting your approval.",
    date: "2023-05-13T16:20:00",
    type: "pending",
    read: false,
    category: "trip"
  },
  {
    id: "4",
    title: "Vehicle Assignment",
    message: "You have been assigned as driver for vehicle DEF-456.",
    date: "2023-05-12T09:15:00",
    type: "assignment",
    read: false,
    category: "fleet"
  },
  {
    id: "5",
    title: "Low Fuel Alert",
    message: "Vehicle HIJ-789 is running low on fuel (15%).",
    date: "2023-05-11T14:30:00",
    type: "alert",
    read: true,
    category: "fuel"
  },
  {
    id: "6",
    title: "Maintenance Completed",
    message: "Regular maintenance for vehicle KLM-012 has been completed.",
    date: "2023-05-10T11:45:00",
    type: "info",
    read: true,
    category: "maintenance"
  }
];

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

// Get icon based on notification category
const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'fuel':
      return <Fuel className="h-5 w-5" />;
    case 'maintenance':
      return <Wrench className="h-5 w-5" />;
    case 'trip':
      return <Clock className="h-5 w-5" />;
    case 'fleet':
      return <Car className="h-5 w-5" />;
    default:
      return <Bell className="h-5 w-5" />;
  }
};

// Get badge for notification type
const getTypeBadge = (type: string) => {
  switch (type) {
    case 'approval':
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Approved</Badge>;
    case 'pending':
      return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">Pending</Badge>;
    case 'alert':
      return <Badge className="bg-red-100 text-red-800 hover:bg-red-200">Alert</Badge>;
    default:
      return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">Info</Badge>;
  }
};

export default function Notifications() {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [activeTab, setActiveTab] = useState("all");

  const unreadCount = notifications.filter(n => !n.read).length;
  
  const filteredNotifications = activeTab === "all" 
    ? notifications 
    : activeTab === "unread"
      ? notifications.filter(n => !n.read)
      : notifications.filter(n => n.category === activeTab);

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
    toast.success("Notification marked as read");
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
    toast.success("All notifications marked as read");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
          {unreadCount > 0 && (
            <Button variant="outline" size="sm" onClick={markAllAsRead}>
              <Check className="mr-2 h-4 w-4" />
              Mark all as read
            </Button>
          )}
        </div>
        <p className="text-muted-foreground">
          You have {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
        </p>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-5 md:w-[600px]">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="unread">Unread</TabsTrigger>
          <TabsTrigger value="fuel">Fuel</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
          <TabsTrigger value="fleet">Fleet</TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab} className="mt-4">
          <div className="space-y-4">
            {filteredNotifications.length === 0 ? (
              <Card className="border-dashed">
                <CardContent className="pt-6 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <Bell className="h-8 w-8 text-muted-foreground/50" />
                    <p className="text-muted-foreground">No notifications found</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              filteredNotifications.map((notification) => (
                <Card key={notification.id} className={notification.read ? "opacity-70" : ""}>
                  <CardHeader className="pb-2 flex flex-row items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`p-2 rounded-full ${notification.read ? 'bg-slate-100' : 'bg-primary/10'}`}>
                        {getCategoryIcon(notification.category)}
                      </div>
                      <div>
                        <CardTitle className="text-lg flex items-center gap-2">
                          {notification.title}
                          {!notification.read && (
                            <span className="w-2 h-2 bg-blue-500 rounded-full inline-block"></span>
                          )}
                        </CardTitle>
                        <CardDescription>{formatRelativeTime(notification.date)}</CardDescription>
                      </div>
                    </div>
                    {getTypeBadge(notification.type)}
                  </CardHeader>
                  <CardContent>
                    <p>{notification.message}</p>
                  </CardContent>
                  <CardFooter className="flex justify-end pt-0">
                    {!notification.read && (
                      <Button variant="ghost" size="sm" onClick={() => markAsRead(notification.id)}>
                        <Check className="mr-2 h-4 w-4" />
                        Mark as read
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
