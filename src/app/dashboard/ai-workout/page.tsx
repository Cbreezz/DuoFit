
import { WorkoutGeneratorForm } from "@/components/ai/workout-generator-form";

export default function AiWorkoutPage() {
  return (
    <div className="container mx-auto"> {/* Removed responsive padding here, handled by layout */}
      <WorkoutGeneratorForm />
    </div>
  );
}
