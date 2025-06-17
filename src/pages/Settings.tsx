import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import type { UserFull, UpdateUserDto, ChangePasswordDto } from "@/types/user";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { UserCircle, Bell, Languages, Monitor, Moon, Sun } from "lucide-react";
import { toast } from "sonner";
import ManageUsersPage from "./ManageUsers";

export default function Settings() {
    const { hasPermission } = useAuth();

    const { data: user, isLoading, error, refetch } = useQuery({
        queryKey: ["user", "me"],
        queryFn: () => apiClient.users.getMe(),
    });

    // Form state for Profile fields
    const [profileForm, setProfileForm] = useState<Partial<UserFull>>({});
    // Track initial loaded state to compare for changes
    const [initialProfile, setInitialProfile] = useState<Partial<UserFull>>({});

    useEffect(() => {
        if (user) {
            const userProfile = {
                firstName: user.firstName,
                lastName: user.lastName,
                username: user.username,
                email: user.email,
                phoneNumber: user.phoneNumber,
                universityId: user.universityId,
            };
            setProfileForm(userProfile);
            setInitialProfile(userProfile);
        }
    }, [user]);

    const updateMutation = useMutation({
        mutationFn: (data: UpdateUserDto) => apiClient.users.update(data),
        onSuccess: () => {
            toast.success("Settings saved successfully");
            refetch();
        },
        onError: (e) => {
            toast.error("Failed to update profile");
        }
    });

    const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setProfileForm((prev) => ({ ...prev, [id]: value }));
    };

    // Util to get changed fields only
    const getChangedFields = () => {
        const changed: Partial<UpdateUserDto> = {};
        Object.entries(profileForm).forEach(([key, value]) => {
            // compare with initialProfile, only add if changed and not undefined
            if (
                value !== undefined &&
                value !== (initialProfile as any)[key]
            ) {
                (changed as any)[key] = value;
            }
        });
        return changed;
    };

    const handleSaveProfile = () => {
        if (!user) return;
        const changes = getChangedFields();
        if (Object.keys(changes).length === 0) {
            toast.info("No changes to save.");
            return;
        }
        updateMutation.mutate({
            id: user.id,
            ...changes,
        });
    };

    // Change Password form state
    const [passwordForm, setPasswordForm] = useState<ChangePasswordDto>({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const [passwordLoading, setPasswordLoading] = useState(false);

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setPasswordForm((prev) => ({
            ...prev,
            [id]: value,
        }));
    };

    const handlePasswordSubmit = async () => {
        if (
            !passwordForm.oldPassword ||
            !passwordForm.newPassword ||
            !passwordForm.confirmPassword
        ) {
            toast.error("Please fill in all fields");
            return;
        }
        if (passwordForm.newPassword.length < 8 || passwordForm.newPassword.length > 64) {
            toast.error("New password must be between 8 and 64 characters");
            return;
        }
        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            toast.error("New password and confirmation do not match");
            return;
        }

        setPasswordLoading(true);
        try {
            await apiClient.users.changePassword(passwordForm);
            setPasswordForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
            toast.success("Password updated successfully");
        } catch (e: any) {
            // Error message shown by apiClient, but in case customize for known errors
            if (e?.response?.data?.message) {
                toast.error(e.response.data.message);
            }
            // else handled already by apiClient
        } finally {
            setPasswordLoading(false);
        }
    };

    const [notifications, setNotifications] = useState({
        email: true,
        browser: true,
        fuelApprovals: true,
        fleetApprovals: true,
        systemUpdates: false,
    });

    const handleSave = () => {
        toast.success("Settings saved successfully");
    };

    // Theme app settings state under Appearance
    const [theme, setTheme] = useState<"light" | "dark">(
        () =>
            (localStorage.getItem("theme") as "light" | "dark") ||
            (window.matchMedia &&
            window.matchMedia("(prefers-color-scheme: dark)").matches
                ? "dark"
                : "light")
    );

    useEffect(() => {
        document.documentElement.classList.remove("light", "dark");
        document.documentElement.classList.add(theme);
        localStorage.setItem("theme", theme);
    }, [theme]);

    const handleThemeToggle = () => {
        const newTheme = theme === "light" ? "dark" : "light";
        setTheme(newTheme);
        toast.success(`Theme set to ${newTheme === "dark" ? "Dark" : "Light"} mode`);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                <p className="text-muted-foreground">
                    Manage your account settings
                </p>
            </div>

            <Tabs defaultValue="profile">
                <TabsList className="grid w-full grid-cols-1">
                    <TabsTrigger value="profile" className="flex items-center gap-2">
                        <UserCircle className="h-4 w-4" />
                        <span>Profile</span>
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="profile" className="space-y-4 mt-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Profile Information</CardTitle>
                            <CardDescription>Update your personal information</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {isLoading ? (
                                <div>Loading...</div>
                            ) : error ? (
                                <div>Error loading profile.</div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="firstName">First Name</Label>
                                            <Input
                                                id="firstName"
                                                value={profileForm.firstName ?? ""}
                                                onChange={handleProfileChange}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="lastName">Last Name</Label>
                                            <Input
                                                id="lastName"
                                                value={profileForm.lastName ?? ""}
                                                onChange={handleProfileChange}
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="username">Username</Label>
                                            <Input
                                                id="username"
                                                value={profileForm.username ?? ""}
                                                disabled
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="universityId">University ID</Label>
                                            <Input
                                                id="universityId"
                                                value={profileForm.universityId ?? ""}
                                                onChange={handleProfileChange}
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email Address</Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                value={profileForm.email ?? ""}
                                                onChange={handleProfileChange}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="phoneNumber">Phone Number</Label>
                                            <Input
                                                id="phoneNumber"
                                                value={profileForm.phoneNumber ?? ""}
                                                onChange={handleProfileChange}
                                            />
                                        </div>
                                    </div>

                                    <div className="flex justify-end">
                                        <Button
                                            onClick={handleSaveProfile}
                                            disabled={updateMutation.isPending}
                                        >
                                            {updateMutation.isPending ? "Saving..." : "Save Changes"}
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Password</CardTitle>
                            <CardDescription>Change your password</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="oldPassword">Current Password</Label>
                                    <Input
                                        id="oldPassword"
                                        type="password"
                                        value={passwordForm.oldPassword}
                                        onChange={handlePasswordChange}
                                        autoComplete="current-password"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="newPassword">New Password</Label>
                                    <Input
                                        id="newPassword"
                                        type="password"
                                        value={passwordForm.newPassword}
                                        onChange={handlePasswordChange}
                                        autoComplete="new-password"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                                    <Input
                                        id="confirmPassword"
                                        type="password"
                                        value={passwordForm.confirmPassword}
                                        onChange={handlePasswordChange}
                                        autoComplete="new-password"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <Button
                                    onClick={handlePasswordSubmit}
                                    disabled={passwordLoading}
                                >
                                    {passwordLoading ? "Updating..." : "Update Password"}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
