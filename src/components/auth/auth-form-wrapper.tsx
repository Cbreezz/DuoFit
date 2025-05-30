
import type { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Dumbbell } from 'lucide-react';

interface AuthFormWrapperProps {
  title: string;
  description: string;
  children: ReactNode;
  showLogo?: boolean;
}

export function AuthFormWrapper({ title, description, children, showLogo = true }: AuthFormWrapperProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-background to-secondary p-4">
      <Card className="w-full max-w-md shadow-2xl">
        {showLogo && (
          <CardHeader className="items-center text-center">
            <div className="mb-4 flex items-center justify-center space-x-2 text-primary">
              <Dumbbell className="h-10 w-10" />
              <h1 className="text-3xl md:text-4xl font-bold">DuoFit</h1>
            </div>
            <CardTitle className="text-xl md:text-2xl">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </CardHeader>
        )}
        {!showLogo && (
             <CardHeader>
                <CardTitle className="text-xl md:text-2xl">{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
        )}
        <CardContent>
          {children}
        </CardContent>
      </Card>
    </div>
  );
}
