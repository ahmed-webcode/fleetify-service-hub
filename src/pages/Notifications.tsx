
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  Bell, 
  CheckCircle, 
  Info, 
  AlertTriangle, 
  Clock, 
  Car, 
  Fuel, 
  Wrench,
  CheckCheck,
  Calendar,
  X
} from "lucide-react";
import { toast } from "sonner";

export default function Notifications() {
  const notificationGroups = {
    unread: [
      {
        id: "1",
        title: "Fuel Request Approved",
        description: "Your fuel request #FR-2304 has been approved by the FOTL.",
        type: "success",
        time: "10 minutes ago",
        category: "fuel"
      },
      {
        id: "2",
        title: "Vehicle Maintenance Alert",
        description: "Vehicle ET-3405 is due for scheduled maintenance.",
        type: "warning",
        time: "2 hours ago",
        category: "maintenance"
      },
      {
        id: "3",
        title: "Fleet Request Pending",
        description: "New fleet request #FL-1098 is awaiting your approval.",
        type: "info",
        time: "Yesterday",
        category: "fleet"
      },
    ],
    read: [
      {
        id: "4",
        title: "Vehicle Assignment Complete",
        description: "Driver has been assigned to request #FL-1092.",
        type: "success",
        time: "2 days ago",
        category: "fleet"
      },
      {
        id: "5",
        title: "Maintenance Complete",
        description: "Vehicle ET-4502 maintenance has been completed.",
        type: "info",
        time: "3 days ago",
        category: "maintenance"
      },
      {
        id: "6",
        title: "Fuel Request Denied",
        description: "Fuel request #FR-2298 was denied due to insufficient information.",
        type: "error",
        time: "1 week ago",
        category: "fuel"
      },
    ]
  };

  const handleMarkAllAsRead = () => {
    toast.success("All notifications marked as read");
  };

  const handleClearAll = () => {
    toast.info("All notifications cleared");
  };

  const getIcon = (type: string, category: string) => {
    // First determine icon based on notification category
    let CategoryIcon = Info;
    if (category === "fuel") CategoryIcon = Fuel;
    else if (category === "fleet") CategoryIcon = Car;
    else if (category === "maintenance") CategoryIcon = Wrench;
    
    // Then decide on color/style based on type
    switch (type) {
      case "success":
        return <CategoryIcon className="h-5 w-5 text-green-500" />;
      case "warning":
        return <CategoryIcon className="h-5 w-5 text-amber-500" />;
      case "error":
        return <CategoryIcon className="h-5 w-5 text-red-500" />;
      case "info":
      default:
        return <CategoryIcon className="h-5 w-5 text-blue-500" />;
    }
  };

  const getBadge = (type: string) => {
    switch (type) {
      case "success":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          <CheckCircle className="mr-1 h-3 w-3" /> Success
        </Badge>;
      case "warning":
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
          <AlertTriangle className="mr-1 h-3 w-3" /> Warning
        </Badge>;
      case "error":
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
          <AlertTriangle className="mr-1 h-3 w-3" /> Alert
        </Badge>;
      case "info":
      default:
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
          <Info className="mr-1 h-3 w-3" /> Info
        </Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
        <p className="text-muted-foreground">View and manage your notifications</p>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <Tabs defaultValue="all" className="w-[400px]">
          <TabsList>
            <TabsTrigger value="all" className="flex items-center gap-1">
              <Bell className="h-4 w-4" />
              <span>All</span>
              <Badge variant="secondary" className="ml-1">{notificationGroups.unread.length + notificationGroups.read.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="unread" className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>Unread</span>
              <Badge variant="secondary" className="ml-1">{notificationGroups.unread.length}</Badge>
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleMarkAllAsRead} className="flex items-center gap-1">
            <CheckCheck className="h-4 w-4" />
            Mark all as read
          </Button>
          <Button variant="outline" size="sm" onClick={handleClearAll} className="flex items-center gap-1">
            <X className="h-4 w-4" />
            Clear all
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsContent value="all" className="mt-0">
          <div className="space-y-4">
            {notificationGroups.unread.length > 0 && (
              <div className="space-y-2">
                <h2 className="text-lg font-medium flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  Unread Notifications
                </h2>
                <div className="space-y-3">
                  {notificationGroups.unread.map((notification) => (
                    <NotificationCard key={notification.id} notification={notification} />
                  ))}
                </div>
              </div>
            )}

            {notificationGroups.unread.length > 0 && notificationGroups.read.length > 0 && (
              <Separator className="my-6" />
            )}

            {notificationGroups.read.length > 0 && (
              <div className="space-y-2">
                <h2 className="text-lg font-medium flex items-center gap-2">
                  <CheckCheck className="h-4 w-4 text-muted-foreground" />
                  Previously Read
                </h2>
                <div className="space-y-3">
                  {notificationGroups.read.map((notification) => (
                    <NotificationCard key={notification.id} notification={notification} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </TabsContent>
        <TabsContent value="unread" className="mt-0">
          <div className="space-y-2">
            {notificationGroups.unread.length > 0 ? (
              <div className="space-y-3">
                {notificationGroups.unread.map((notification) => (
                  <NotificationCard key={notification.id} notification={notification} />
                ))}
              </div>
            ) : (
              <div className="text-center p-8">
                <CheckCircle className="mx-auto h-12 w-12 text-muted-foreground/50" />
                <h3 className="mt-2 text-lg font-medium">All caught up!</h3>
                <p className="text-muted-foreground">You have no unread notifications.</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface NotificationProps {
  notification: {
    id: string;
    title: string;
    description: string;
    type: string;
    time: string;
    category: string;
  };
}

function NotificationCard({ notification }: NotificationProps) {
  const handleMarkAsRead = () => {
    toast.success(`Notification marked as read`);
  };

  const getIcon = (type: string, category: string) => {
    // First determine icon based on notification category
    let CategoryIcon = Info;
    if (category === "fuel") CategoryIcon = Fuel;
    else if (category === "fleet") CategoryIcon = Car;
    else if (category === "maintenance") CategoryIcon = Wrench;
    
    // Then decide on color/style based on type
    switch (type) {
      case "success":
        return <CategoryIcon className="h-5 w-5 text-green-500" />;
      case "warning":
        return <CategoryIcon className="h-5 w-5 text-amber-500" />;
      case "error":
        return <CategoryIcon className="h-5 w-5 text-red-500" />;
      case "info":
      default:
        return <CategoryIcon className="h-5 w-5 text-blue-500" />;
    }
  };

  const getBadge = (type: string) => {
    switch (type) {
      case "success":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          <CheckCircle className="mr-1 h-3 w-3" /> Success
        </Badge>;
      case "warning":
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
          <AlertTriangle className="mr-1 h-3 w-3" /> Warning
        </Badge>;
      case "error":
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
          <AlertTriangle className="mr-1 h-3 w-3" /> Alert
        </Badge>;
      case "info":
      default:
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
          <Info className="mr-1 h-3 w-3" /> Info
        </Badge>;
    }
  };

  return (
    <Card className="hover:shadow-sm transition-shadow">
      <CardHeader className="flex flex-row items-start justify-between p-4">
        <div className="flex gap-3">
          <div className="mt-0.5">
            {getIcon(notification.type, notification.category)}
          </div>
          <div>
            <CardTitle className="text-base font-medium">{notification.title}</CardTitle>
            <CardDescription className="mt-1">{notification.description}</CardDescription>
          </div>
        </div>
        <div>
          {getBadge(notification.type)}
        </div>
      </CardHeader>
      <CardFooter className="p-4 pt-0 flex items-center justify-between">
        <div className="flex items-center text-sm text-muted-foreground">
          <Calendar className="mr-1 h-3.5 w-3.5" />
          {notification.time}
        </div>
        <Button variant="ghost" size="sm" onClick={handleMarkAsRead}>
          Mark as read
        </Button>
      </CardFooter>
    </Card>
  );
}
