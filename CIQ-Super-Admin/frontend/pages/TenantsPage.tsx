import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import backend from "~backend/client";
import type { Tenant } from "~backend/tenant/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { TenantDialog } from "../components/TenantDialog";
import { Link } from "react-router-dom";

export function TenantsPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["tenants"],
    queryFn: () => backend.tenant.list(),
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => backend.tenant.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tenants"] });
      setDialogOpen(false);
      toast({ title: "Tenant created successfully" });
    },
    onError: (error) => {
      console.error("Failed to create tenant:", error);
      toast({
        title: "Failed to create tenant",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-[color:color-mix(in_srgb,var(--primary)_14%,white)] text-[color:var(--primary)] border-[color:color-mix(in_srgb,var(--primary)_35%,transparent)]";
      case "trial":
        return "bg-[color:color-mix(in_srgb,var(--chart-2)_14%,white)] text-[color:var(--chart-2)] border-[color:color-mix(in_srgb,var(--chart-2)_35%,transparent)]";
      case "suspended":
        return "bg-[color:color-mix(in_srgb,var(--chart-3)_16%,white)] text-[color:var(--chart-3)] border-[color:color-mix(in_srgb,var(--chart-3)_35%,transparent)]";
      case "churned":
        return "bg-[color:color-mix(in_srgb,var(--destructive)_12%,white)] text-[color:var(--destructive)] border-[color:color-mix(in_srgb,var(--destructive)_30%,transparent)]";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Tenants</h1>
          <p className="text-muted-foreground mt-1">
            Manage tenant organizations and subscriptions
          </p>
        </div>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Tenant
        </Button>
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-5 w-32 bg-muted rounded" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-4 w-24 bg-muted rounded" />
                  <div className="h-4 w-20 bg-muted rounded" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {data?.tenants.map((tenant: Tenant) => (
            <Link key={tenant.id} to={`/tenants/${tenant.id}`}>
              <Card className="hover:border-primary hover:shadow-md transition-all cursor-pointer shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{tenant.name}</span>
                    <Badge variant="outline" className={getStatusColor(tenant.status)}>
                      {tenant.status}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Slug:</span>
                      <span className="font-mono">{tenant.slug}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Created:</span>
                      <span>
                        {new Date(tenant.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    {tenant.trialEndsAt && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Trial Ends:</span>
                        <span>
                          {new Date(tenant.trialEndsAt).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}

      <TenantDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={(data) => createMutation.mutate(data)}
      />
    </div>
  );
}
