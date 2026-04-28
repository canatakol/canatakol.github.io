import { useQuery } from "@tanstack/react-query";
import backend from "~backend/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function AnalyticsPage() {
  const { data: platformMetrics } = useQuery({
    queryKey: ["platform-metrics"],
    queryFn: () => backend.analytics.getPlatformMetrics({}),
  });

  const { data: tenantMetrics } = useQuery({
    queryKey: ["tenant-metrics"],
    queryFn: () => backend.analytics.getTenantMetrics({}),
  });

  const { data: eventMetrics } = useQuery({
    queryKey: ["event-metrics"],
    queryFn: () => backend.analytics.getEventMetrics({}),
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
        <p className="text-muted-foreground mt-1">
          Platform metrics and usage insights
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Daily Active Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{platformMetrics?.dau || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Monthly Active Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{platformMetrics?.mau || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Tenants
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {platformMetrics?.activeTenants || 0}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Retention Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {platformMetrics?.retention.toFixed(1) || 0}%
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Tenant Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tenant</TableHead>
                  <TableHead className="text-right">Events</TableHead>
                  <TableHead className="text-right">Active Users</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tenantMetrics?.metrics.slice(0, 10).map((metric) => (
                  <TableRow key={metric.tenantId}>
                    <TableCell className="font-medium">
                      {metric.tenantName}
                    </TableCell>
                    <TableCell className="text-right">
                      {metric.eventCount.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      {metric.activeUsers.toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Events</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Event Type</TableHead>
                  <TableHead className="text-right">Count</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {eventMetrics?.metrics.slice(0, 10).map((metric) => (
                  <TableRow key={metric.eventType}>
                    <TableCell className="font-medium">
                      {metric.eventType}
                    </TableCell>
                    <TableCell className="text-right">
                      {metric.count.toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
