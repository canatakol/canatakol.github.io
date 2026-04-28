import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import backend from "~backend/client";
import type { FeatureFlag } from "~backend/feature_flag/types";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { FeatureFlagDialog } from "../components/FeatureFlagDialog";

export function FeatureFlagsPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["feature-flags"],
    queryFn: () => backend.feature_flag.list(),
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => backend.feature_flag.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feature-flags"] });
      setDialogOpen(false);
      toast({ title: "Feature flag created successfully" });
    },
    onError: (error) => {
      console.error("Failed to create feature flag:", error);
      toast({
        title: "Failed to create feature flag",
        variant: "destructive",
      });
    },
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, enabled }: { id: number; enabled: boolean }) =>
      backend.feature_flag.update({ id, enabled }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feature-flags"] });
      toast({ title: "Feature flag updated" });
    },
    onError: (error) => {
      console.error("Failed to update feature flag:", error);
      toast({
        title: "Failed to update feature flag",
        variant: "destructive",
      });
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Feature Flags</h1>
          <p className="text-muted-foreground mt-1">
            Feature toggle management and A/B testing
          </p>
        </div>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Feature Flag
        </Button>
      </div>

      <div className="border border-border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Key</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Rollout %</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              [...Array(5)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell><div className="h-4 w-32 bg-muted rounded animate-pulse" /></TableCell>
                  <TableCell><div className="h-4 w-24 bg-muted rounded animate-pulse" /></TableCell>
                  <TableCell><div className="h-4 w-16 bg-muted rounded animate-pulse" /></TableCell>
                  <TableCell><div className="h-4 w-12 bg-muted rounded animate-pulse" /></TableCell>
                  <TableCell><div className="h-4 w-20 bg-muted rounded animate-pulse" /></TableCell>
                  <TableCell><div className="h-4 w-16 bg-muted rounded animate-pulse" /></TableCell>
                </TableRow>
              ))
            ) : data?.flags.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground">
                  No feature flags found
                </TableCell>
              </TableRow>
            ) : (
              data?.flags.map((flag: FeatureFlag) => (
                <TableRow key={flag.id}>
                  <TableCell className="font-medium">{flag.name}</TableCell>
                  <TableCell>
                    <code className="text-xs bg-muted px-2 py-1 rounded">
                      {flag.key}
                    </code>
                  </TableCell>
                  <TableCell>
                    {flag.enabled ? (
                      <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                        Enabled
                      </Badge>
                    ) : (
                      <Badge variant="outline">Disabled</Badge>
                    )}
                  </TableCell>
                  <TableCell>{flag.rolloutPercentage}%</TableCell>
                  <TableCell className="text-sm text-foreground">
                    {new Date(flag.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <Switch
                      checked={flag.enabled}
                      onCheckedChange={(checked) =>
                        toggleMutation.mutate({ id: flag.id, enabled: checked })
                      }
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <FeatureFlagDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={(data) => createMutation.mutate(data)}
      />
    </div>
  );
}
