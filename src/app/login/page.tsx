'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  initiateEmailSignIn,
  initiateEmailSignUp,
  initiateAnonymousSignIn,
  initiateGitHubSignIn,
} from '@/firebase/non-blocking-login';
import { useAuth, useUser } from '@/firebase';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Logo } from '@/components/logo';
import { useToast } from '@/hooks/use-toast';
import { Github } from 'lucide-react';
import { GitLabIcon } from '@/components/icons';
import { ThemeToggle } from '@/components/theme-toggle';

// Error code to user-friendly message mapping
const getErrorMessage = (errorCode: string): string => {
  const errorMessages: Record<string, string> = {
    'auth/wrong-password': 'Invalid email or password.',
    'auth/user-not-found': 'Invalid email or password.',
    'auth/invalid-credential': 'Invalid email or password.',
    'auth/email-already-in-use':
      'This email address is already in use. Please log in or use a different email.',
    'auth/weak-password': 'The password is too weak.',
    'auth/invalid-email': 'Please enter a valid email address.',
    'auth/account-exists-with-different-credential':
      'An account already exists with this email. Please sign in using the original method to link your account.',
  };

  return errorMessages[errorCode] || 'An unexpected error occurred. Please try again.';
};

// Reusable button styles
const BUTTON_GRADIENT_CLASSES =
  'w-full bg-gradient-to-r from-indigo-600 to-blue-600 dark:from-purple-600 dark:to-violet-600 hover:from-indigo-700 hover:to-blue-700 dark:hover:from-purple-700 dark:hover:to-violet-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]';

export default function LoginPage() {
  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const { toast } = useToast();

  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  // Redirect to dashboard if already logged in
  useEffect(() => {
    if (!isUserLoading && user) {
      router.push('/');
    }
  }, [user, isUserLoading, router]);

  // Handle authentication errors and show user-friendly messages
  const handleError = (error: any) => {
    console.error('Authentication error:', error);
    const errorMessage = getErrorMessage(error.code || '');
    toast({
      variant: 'destructive',
      title: 'Authentication Failed',
      description: errorMessage,
    });
  };

  // Form submission handlers
  const handleSignUp = () => {
    if (!name.trim()) {
      toast({
        variant: 'destructive',
        title: 'Sign Up Failed',
        description: 'Please enter your name.',
      });
      return;
    }
    initiateEmailSignUp(auth, email, password, name, handleError);
  };

  const handleLogin = () => {
    initiateEmailSignIn(auth, email, password, handleError);
  };

  const handleAnonymousLogin = () => {
    initiateAnonymousSignIn(auth, handleError);
  };

  const handleGitHubConnect = () => {
    initiateGitHubSignIn(auth, handleError);
  };

  // Loading state - show spinner while checking authentication
  if (isUserLoading || user) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-muted-foreground animate-pulse">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-400/10 dark:bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-400/10 dark:bg-violet-500/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: '1s' }}
        ></div>
      </div>

      {/* Header with logo and theme toggle */}
      <div className="mb-8 animate-scale-in relative z-10 flex flex-col items-center gap-4">
        <div className="flex items-center justify-between w-full max-w-sm">
          <div className="w-9"></div>
          <Logo className="text-4xl" />
          <ThemeToggle />
        </div>
      </div>

      {/* Login/Signup tabs */}
      <Tabs defaultValue="login" className="w-full max-w-sm relative z-10 animate-fade-in">
        <TabsList className="grid w-full grid-cols-2 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm">
          <TabsTrigger
            value="login"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-600 data-[state=active]:to-blue-600 dark:data-[state=active]:from-purple-600 dark:data-[state=active]:to-violet-600 data-[state=active]:text-white transition-all"
          >
            Login
          </TabsTrigger>
          <TabsTrigger
            value="signup"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-600 data-[state=active]:to-blue-600 dark:data-[state=active]:from-purple-600 dark:data-[state=active]:to-violet-600 data-[state=active]:text-white transition-all"
          >
            Sign Up
          </TabsTrigger>
        </TabsList>

        {/* Login form */}
        <TabsContent value="login" className="animate-slide-in-right">
          <Card className="glass border-2 shadow-2xl">
            <CardHeader>
              <CardTitle>Login</CardTitle>
              <CardDescription>Enter your credentials to access your account.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="login-email">Email</Label>
                <Input
                  id="login-email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="login-password">Password</Label>
                <Input
                  id="login-password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <Button onClick={handleLogin} className={BUTTON_GRADIENT_CLASSES}>
                Login
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sign up form */}
        <TabsContent value="signup" className="animate-slide-in-right">
          <Card className="glass border-2 shadow-2xl">
            <CardHeader>
              <CardTitle>Sign Up</CardTitle>
              <CardDescription>Create an account to get started.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signup-name">Name</Label>
                <Input
                  id="signup-name"
                  type="text"
                  placeholder="John Doe"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-email">Email</Label>
                <Input
                  id="signup-email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-password">Password</Label>
                <Input
                  id="signup-password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <Button onClick={handleSignUp} className={BUTTON_GRADIENT_CLASSES}>
                Sign Up
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Social login options */}
      <div className="mt-4 w-full max-w-sm text-center">
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Button
            variant="outline"
            className="w-full hover:bg-slate-50 dark:hover:bg-zinc-800 hover:border-primary/50 hover:shadow-md transition-all duration-300 group"
            onClick={handleGitHubConnect}
          >
            <Github className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
            GitHub
          </Button>
          <Button variant="outline" className="w-full opacity-50 cursor-not-allowed" disabled>
            <GitLabIcon className="mr-2 h-4 w-4" />
            GitLab
          </Button>
        </div>

        <Button
          variant="link"
          onClick={handleAnonymousLogin}
          className="mt-4 text-sm text-muted-foreground"
        >
          Continue as a Guest
        </Button>
      </div>
    </div>
  );
}
