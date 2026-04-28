import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import backend from "~backend/client";
import type { User } from "~backend/user/types";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { UserDialog } from "../components/UserDialog";

export function UsersPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: () => backend.user.list({}),
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => backend.user.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setDialogOpen(false);
      toast({ title: "User created successfully" });
    },
    onError: (error) => {
      console.error("Failed to create user:", error);
      toast({
        title: "Failed to create user",
        variant: "destructive",
      });
    },
  });

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "super_admin":
        return (
          <Badge variant="outline" className="bg-[color:color-mix(in_srgb,var(--primary)_14%,white)] text-[color:var(--primary)] border-[color:color-mix(in_srgb,var(--primary)_35%,transparent)]">
            Super Admin
          </Badge>
        );
      case "admin":
        return (
          <Badge variant="secondary" className="bg-secondary text-secondary-foreground">
            Admin
          </Badge>
        );
      default:
        return <Badge variant="secondary">User</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge variant="outline" className="bg-[color:color-mix(in_srgb,var(--primary)_14%,white)] text-[color:var(--primary)] border-[color:color-mix(in_srgb,var(--primary)_35%,transparent)]">
            Active
          </Badge>
        );
      case "suspended":
        return (
          <Badge variant="outline" className="bg-[color:color-mix(in_srgb,var(--chart-3)_16%,white)] text-[color:var(--chart-3)] border-[color:color-mix(in_srgb,var(--chart-3)_35%,transparent)]">
            Suspended
          </Badge>
        );
      default:
        return <Badge variant="outline">Deleted</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Users</h1>
          <p className="text-muted-foreground mt-1">
            Centralized user directory and role management
          </p>
        </div>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add User
        </Button>
      </div>

      <div className="border border-border rounded-lg bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Login</TableHead>
              <TableHead>Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              [...Array(5)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell><div className="h-4 w-24 bg-muted rounded animate-pulse" /></TableCell>
                  <TableCell><div className="h-4 w-32 bg-muted rounded animate-pulse" /></TableCell>
                  <TableCell><div className="h-4 w-16 bg-muted rounded animate-pulse" /></TableCell>
                  <TableCell><div className="h-4 w-16 bg-muted rounded animate-pulse" /></TableCell>
                  <TableCell><div className="h-4 w-20 bg-muted rounded animate-pulse" /></TableCell>
                  <TableCell><div className="h-4 w-20 bg-muted rounded animate-pulse" /></TableCell>
                </TableRow>
              ))
            ) : data?.users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground">
                  No users found
                </TableCell>
              </TableRow>
            ) : (
              data?.users.map((user: User) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{getRoleBadge(user.role)}</TableCell>
                  <TableCell>{getStatusBadge(user.status)}</TableCell>
                  <TableCell className="text-sm text-foreground">
                    {user.lastLoginAt
                      ? new Date(user.lastLoginAt).toLocaleDateString()
                      : "Never"}
                  </TableCell>
                  <TableCell className="text-sm text-foreground">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <UserDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={(data) => createMutation.mutate(data)}
      />
    </div>
  );
}
