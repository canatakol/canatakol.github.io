import { useQuery } from "@tanstack/react-query";
import backend from "~backend/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Users, Building2, TrendingUp, Activity, ArrowUpRight, ArrowDownRight, Zap } from "lucide-react";
import { MetricCard } from "../components/MetricCard";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function DashboardPage() {
  const { data: metrics, isLoading } = useQuery({
    queryKey: ["platform-metrics"],
    queryFn: () => backend.analytics.getPlatformMetrics({}),
  });

  const { data: health } = useQuery({
    queryKey: ["health-status"],
    queryFn: () => backend.health.getHealth(),
  });

  if (isLoading) {
    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="space-y-2">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="bg-card/50 backdrop-blur-sm">
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-32 mb-2" />
                <Skeleton className="h-4 w-20" />
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="h-64"><Skeleton className="h-full w-full" /></Card>
          <Card className="h-64"><Skeleton className="h-full w-full" /></Card>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground lg:text-5xl">
            Dashboard
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Real-time platform insights and operational overview.
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-primary/5 rounded-full border border-primary/10">
          <Zap className="h-4 w-4 text-primary animate-pulse" />
          <span className="text-sm font-medium text-primary">Live Updates Enabled</span>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Daily Active Users"
          value={metrics?.dau || 0}
          icon={Users}
          trend="+12.5%"
          className="hover:shadow-lg transition-all duration-300 border-primary/5"
        />
        <MetricCard
          title="Monthly Active Users"
          value={metrics?.mau || 0}
          icon={TrendingUp}
          trend="+8.2%"
          className="hover:shadow-lg transition-all duration-300 border-primary/5"
        />
        <MetricCard
          title="Active Tenants"
          value={metrics?.activeTenants || 0}
          icon={Building2}
          trend="+5.1%"
          className="hover:shadow-lg transition-all duration-300 border-primary/5"
        />
        <MetricCard
          title="Total Users"
          value={metrics?.totalUsers || 0}
          icon={Users}
          trend="+15.3%"
          className="hover:shadow-lg transition-all duration-300 border-primary/5"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-7">
        <Card className="lg:col-span-4 bg-card/50 backdrop-blur-md border-primary/5">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary" />
                  Platform Health
                </CardTitle>
                <CardDescription>Current operational status across services</CardDescription>
              </div>
              <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <HealthMetric
              label="API Request Volume"
              value={health?.metrics.apiRequests.toLocaleString() || "0"}
              unit="req/h"
              description="Total processed requests in the last hour"
            />
            <HealthMetric
              label="Average Latency"
              value={health?.metrics.avgResponseTime.toFixed(2) || "0"}
              unit="ms"
              description="Global average response time across all regions"
            />
            <HealthMetric
              label="System Error Rate"
              value={health?.metrics.errorRate.toFixed(2) || "0"}
              unit="%"
              description="Percentage of failed requests vs successful ones"
              variant={Number(health?.metrics.errorRate) > 1 ? "warning" : "success"}
            />
          </CardContent>
        </Card>

        <Card className="lg:col-span-3 bg-gradient-to-br from-primary/5 via-transparent to-transparent border-primary/5 overflow-hidden relative">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <TrendingUp className="h-24 w-24" />
          </div>
          <CardHeader>
            <CardTitle className="text-xl">User Retention</CardTitle>
            <CardDescription>Daily vs Monthly stickiness</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center pt-4 pb-8 h-[calc(100%-80px)]">
            <div className="relative flex items-center justify-center">
              <svg className="h-40 w-40 transform -rotate-90">
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  className="text-muted/20"
                />
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={440}
                  strokeDashoffset={440 - (440 * (metrics?.retention || 0)) / 100}
                  className="text-primary transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-4xl font-black tracking-tighter">
                  {metrics?.retention.toFixed(1) || 0}%
                </span>
                <span className="text-[10px] uppercase font-bold text-muted-foreground">Retention</span>
              </div>
            </div>
            <div className="mt-8 grid grid-cols-2 gap-4 w-full">
              <div className="flex flex-col items-center p-3 rounded-xl bg-background/50 border border-border/50">
                <span className="text-xs text-muted-foreground">DAU</span>
                <span className="font-bold">{metrics?.dau || 0}</span>
              </div>
              <div className="flex flex-col items-center p-3 rounded-xl bg-background/50 border border-border/50">
                <span className="text-xs text-muted-foreground">MAU</span>
                <span className="font-bold">{metrics?.mau || 0}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function HealthMetric({
  label,
  value,
  unit,
  description,
  variant = "success"
}: {
  label: string;
  value: string;
  unit: string;
  description: string;
  variant?: "success" | "warning" | "danger";
}) {
  return (
    <div className="group relative flex items-start justify-between p-4 rounded-xl hover:bg-muted/50 transition-colors border border-transparent hover:border-border">
      <div className="space-y-1">
        <span className="text-sm font-semibold">{label}</span>
        <p className="text-xs text-muted-foreground line-clamp-1 group-hover:line-clamp-none transition-all">
          {description}
        </p>
      </div>
      <div className="flex flex-col items-end gap-1">
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold tabular-nums tracking-tighter">{value}</span>
          <span className="text-xs font-medium text-muted-foreground uppercase">{unit}</span>
        </div>
        <div className={cn(
          "h-1.5 w-12 rounded-full bg-muted overflow-hidden"
        )}>
          <div className={cn(
            "h-full rounded-full transition-all duration-1000",
            variant === "success" ? "bg-emerald-500 w-full" :
              variant === "warning" ? "bg-amber-500 w-[60%]" : "bg-rose-500 w-[30%]"
          )} />
        </div>
      </div>
    </div>
  );
}

