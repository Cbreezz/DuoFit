"use client";

import { Button } from "@/components/ui/button";
import { auth } from "@/lib/firebase/config";
import { GoogleAuthProvider, signInWithPopup, type AuthError } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Routes } from "@/config/routes";
import { FaGoogle } from "react-icons/fa"; // Using react-icons for Google logo

interface GoogleSignInButtonProps {
  onError?: (error: AuthError) => void;
  onSuccess?: () => void;
}

export function GoogleSignInButton({ onError, onSuccess }: GoogleSignInButtonProps) {
  const router = useRouter();
  const { toast } = useToast();

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      toast({ title: "Signed in successfully!" });
      if (onSuccess) onSuccess();
      else router.push(Routes.home);
    } catch (error) {
      const authError = error as AuthError;
      console.error("Google Sign-In Error:", authError);
      toast({
        title: "Sign-in failed",
        description: authError.message || "Could not sign in with Google. Please try again.",
        variant: "destructive",
      });
      if (onError) onError(authError);
    }
  };

  return (
    <Button variant="outline" className="w-full" onClick={handleGoogleSignIn} type="button">
      <FaGoogle className="mr-2 h-4 w-4" />
      Sign in with Google
    </Button>
  );
}
