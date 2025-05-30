
"use client";

import type { WeightLog } from "@/types";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { CartesianGrid, Line, LineChart as RechartsLineChart, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { format } from 'date-fns';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Scale, Info } from "lucide-react";

interface WeightBmiChartProps {
  data: WeightLog[];
  isLoading: boolean;
}

const chartConfig = {
  weight: {
    label: "Weight (kg)",
    color: "hsl(var(--chart-1))",
  },
  bmi: {
    label: "BMI",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export function WeightBmiChart({ data, isLoading }: WeightBmiChartProps) {
  const formattedData = data.map(log => ({
    ...log,
    dateFormatted: format(new Date(log.date + 'T00:00:00'), "MMM d"), // Format date for X-axis
    weight: log.weightKg, // Ensure 'weight' key for chart
  }));

  if (isLoading) {
    return (
        <Card className="shadow-lg">
            <CardHeader>
                <div className="h-6 bg-muted rounded w-1/2 animate-pulse mb-1"></div>
                <div className="h-4 bg-muted rounded w-3/4 animate-pulse"></div>
            </CardHeader>
            <CardContent>
                <div className="h-64 bg-muted/50 rounded animate-pulse"></div>
            </CardContent>
        </Card>
    );
  }

  if (data.length < 2 && !isLoading) {
     return (
        <Card className="shadow-lg animate-in fade-in-50 duration-500">
            <CardHeader>
                <CardTitle>Weight & BMI Trend</CardTitle>
                <CardDescription>Log at least two entries to see your progress chart.</CardDescription>
            </CardHeader>
            <CardContent className="text-center py-10">
                <Info className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Not enough data to display chart.</p>
            </CardContent>
        </Card>
    );
  }

  return (
    <Card className="shadow-lg animate-in fade-in-50 duration-500">
        <CardHeader>
            <CardTitle className="flex items-center"><Scale className="mr-2 h-6 w-6 text-primary"/>Weight & BMI Trend</CardTitle>
            <CardDescription>Track your weight and BMI changes over time.</CardDescription>
        </CardHeader>
        <CardContent>
            <ChartContainer config={chartConfig} className="aspect-video h-[300px] w-full">
                <RechartsLineChart data={formattedData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <CartesianGrid vertical={false} strokeDasharray="3 3" />
                    <XAxis
                        dataKey="dateFormatted"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                    />
                    <YAxis 
                        yAxisId="left" 
                        dataKey="weight" 
                        tickLine={false} 
                        axisLine={false} 
                        tickMargin={8}
                        tickFormatter={(value) => `${value} kg`}
                        domain={['dataMin - 2', 'dataMax + 2']}
                    />
                    {formattedData.some(d => d.bmi) && (
                        <YAxis 
                            yAxisId="right" 
                            orientation="right" 
                            dataKey="bmi" 
                            tickLine={false} 
                            axisLine={false} 
                            tickMargin={8}
                            tickFormatter={(value) => `${value}`}
                            domain={['dataMin - 1', 'dataMax + 1']}
                        />
                    )}
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line
                        yAxisId="left"
                        dataKey="weight"
                        type="monotone"
                        stroke="var(--color-weight)"
                        strokeWidth={2}
                        dot={{ fill: "var(--color-weight)", r: 4 }}
                        activeDot={{ r: 6 }}
                    />
                    {formattedData.some(d => d.bmi) && (
                        <Line
                            yAxisId="right"
                            dataKey="bmi"
                            type="monotone"
                            stroke="var(--color-bmi)"
                            strokeWidth={2}
                            dot={{ fill: "var(--color-bmi)", r: 4 }}
                            activeDot={{ r: 6 }}
                            strokeDasharray="5 5"
                        />
                    )}
                    <ChartLegend content={<ChartLegendContent />} />
                </RechartsLineChart>
            </ChartContainer>
        </CardContent>
    </Card>
  );
}

