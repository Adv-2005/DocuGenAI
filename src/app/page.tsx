"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { BookCheck, GitBranch, Timer } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Progress } from "@/components/ui/progress";
import { useUser } from "@/firebase";

const chartData = [
  { month: "January", desktop: 186 },
  { month: "February", desktop: 305 },
  { month: "March", desktop: 237 },
  { month: "April", desktop: 73 },
  { month: "May", desktop: 209 },
  { month: "June", desktop: 214 },
];

const chartConfig = {
  desktop: {
    label: "Usage",
    color: "hsl(var(--primary))",
  },
};

export default function DashboardPage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push("/login");
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading || !user) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-muted-foreground animate-pulse">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:gap-8 md:p-8 animate-fade-in">
      <div className="space-y-2 animate-slide-in-left">
        <h1 className="text-4xl font-bold gradient-text">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's what's happening with your documentation.</p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="hover-lift border-2 transition-all duration-300 hover:border-primary/50 hover:shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Documentation Coverage
            </CardTitle>
            <div className="rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 p-2 shadow-lg">
              <BookCheck className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold gradient-text">78%</div>
            <p className="text-xs text-muted-foreground mt-1">
              +15% from last month
            </p>
            <Progress value={78} className="mt-4 h-2.5 bg-slate-200" />
          </CardContent>
        </Card>
        
        <Card className="hover-lift border-2 transition-all duration-300 hover:border-cyan-500/50 hover:shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Estimated Time Saved
            </CardTitle>
            <div className="rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 p-2 shadow-lg">
              <Timer className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">120 hours</div>
            <p className="text-xs text-muted-foreground mt-1">
              in the last 30 days
            </p>
          </CardContent>
        </Card>
        
        <Card className="hover-lift border-2 transition-all duration-300 hover:border-emerald-500/50 hover:shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Repositories Connected
            </CardTitle>
            <div className="rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 p-2 shadow-lg">
              <GitBranch className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">5</div>
            <p className="text-xs text-muted-foreground mt-1">
              2 new repositories added this week
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="animate-scale-in">
        <Card className="border-2 shadow-xl hover:shadow-2xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="text-2xl">Usage Overview</CardTitle>
            <CardDescription>
              Number of documents generated per month.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} accessibilityLayer>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" className="opacity-30" />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    className="text-xs"
                  />
                  <YAxis className="text-xs" />
                  <ChartTooltip
                    content={<ChartTooltipContent />}
                    cursor={false}
                  />
                  <Bar
                    dataKey="desktop"
                    fill="url(#gradient)"
                    radius={[8, 8, 0, 0]}
                    className="hover:opacity-80 transition-opacity"
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6366f1" />
                      <stop offset="100%" stopColor="#3b82f6" />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
