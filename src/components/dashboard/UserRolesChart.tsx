

import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { ALL_ROLE_NAMES } from "@/hooks/useDashboardStats";
import { UserDto } from "@/types/user";

type RoleChartItem = {
  role: string;
  count: number;
};

interface UserRolesChartProps {
  users: UserDto[];
}

/**
 * For each of the 11 roles, count how many users possess each role
 */
function buildRoleChartData(users: UserDto[]): RoleChartItem[] {
  const result: RoleChartItem[] = ALL_ROLE_NAMES.map(roleName => ({
    role: roleName,
    count: users.filter((user) =>
      user.roles && user.roles.some(role => role.name === roleName)
    ).length,
  }));
  return result;
}

export function UserRolesChart({ users }: UserRolesChartProps) {
  const data = buildRoleChartData(users);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">User Roles Distribution</CardTitle>
        <CardDescription>Count of users per role</CardDescription>
      </CardHeader>
      <CardContent className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ left: 0, right: 16 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="role" angle={-30} textAnchor="end" interval={0} fontSize={12} height={60}/>
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="count" name="User Count" fill="#10b981" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
