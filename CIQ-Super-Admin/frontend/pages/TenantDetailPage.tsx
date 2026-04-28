import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import backend from "~backend/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export function TenantDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: tenant, isLoading } = useQuery({
    queryKey: ["tenant", id],
    queryFn: () => backend.tenant.get({ id: Number(id) }),
  });

  const { data: subscriptions } = useQuery({
    queryKey: ["subscriptions", id],
    queryFn: () => backend.tenant.listSubscriptions({ tenantId: Number(id) }),
  });

  const updateMutation = useMutation({
    mutationFn: (status: string) =>
      backend.tenant.update({ id: Number(id), status: status as any }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tenant", id] });
      toast({ title: "Tenant status updated" });
    },
    onError: (error) => {
      console.error("Failed to update tenant:", error);
      toast({
        title: "Failed to update tenant",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-muted rounded animate-pulse" />
        <div className="grid gap-4">
          <Card className="animate-pulse">
            <CardHeader>
              <div className="h-6 w-32 bg-muted rounded" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-4 w-full bg-muted rounded" />
                <div className="h-4 w-3/4 bg-muted rounded" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!tenant) {
    return <div>Tenant not found</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/tenants">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-foreground">{tenant.name}</h1>
          <p className="text-muted-foreground mt-1">Tenant details and management</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Tenant Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Status</span>
              <div className="flex items-center gap-2">
                <Badge variant="outline">{tenant.status}</Badge>
                <Select
                  value={tenant.status}
                  onValueChange={(value) => updateMutation.mutate(value)}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="trial">Trial</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                    <SelectItem value="churned">Churned</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Slug</span>
              <span className="font-mono text-sm">{tenant.slug}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Created</span>
              <span className="text-sm">
                {new Date(tenant.createdAt).toLocaleString()}
              </span>
            </div>
            {tenant.trialEndsAt && (
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Trial Ends</span>
                <span className="text-sm">
                  {new Date(tenant.trialEndsAt).toLocaleString()}
                </span>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Subscriptions</CardTitle>
          </CardHeader>
          <CardContent>
            {subscriptions?.subscriptions.length === 0 ? (
              <p className="text-sm text-muted-foreground">No subscriptions</p>
            ) : (
              <div className="space-y-4">
                {subscriptions?.subscriptions.map((sub) => (
                  <div key={sub.id} className="border border-border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-semibold">{sub.plan}</span>
                      <Badge variant="outline">{sub.status}</Badge>
                    </div>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Amount</span>
                        <span>
                          {sub.currency} {sub.amount}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Billing</span>
                        <span>{sub.billingCycle}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
