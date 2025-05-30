import type { WorkoutPlan } from "@/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { Routes } from "@/config/routes";
import { Badge } from "@/components/ui/badge";
import { Clock, Barbell, Zap } from "lucide-react"; // Zap for no equipment

interface WorkoutPlanCardProps {
  plan: WorkoutPlan;
}

export function WorkoutPlanCard({ plan }: WorkoutPlanCardProps) {
  return (
    <Card className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 h-full">
      {plan.imageUrl && (
        <div className="relative h-48 w-full">
          <Image
            // @ts-ignore
            src={plan.imageUrl || `https://placehold.co/400x250.png?text=${encodeURIComponent(plan.name)}`}
            alt={plan.name}
            layout="fill"
            objectFit="cover"
            // @ts-ignore
            data-ai-hint={plan['data-ai-hint'] || (plan.type === 'no_equipment' ? 'home workout' : 'gym workout')}
          />
        </div>
      )}
      <CardHeader className="pb-3">
        <CardTitle className="text-xl mb-1">{plan.name}</CardTitle>
        <CardDescription className="line-clamp-2 h-[2.5em]">{plan.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow pb-4">
        <div className="flex flex-wrap gap-2 mb-3">
            <Badge variant="secondary" className="capitalize">
                {plan.goal.replace('_', ' ')}
            </Badge>
            <Badge variant="outline" className="capitalize">
                {plan.type === 'no_equipment' ? 
                    <Zap className="mr-1 h-3 w-3" /> : 
                    <Barbell className="mr-1 h-3 w-3" /> }
                {plan.type.replace('_', ' ')}
            </Badge>
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <Clock className="mr-1.5 h-4 w-4" />
          <span>{plan.duration}</span>
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full" variant="default">
          <Link href={`${Routes.workouts}?planId=${plan.id}`}>View Plan</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
