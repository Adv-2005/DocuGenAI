'use client';

import { Github, Plus } from 'lucide-react';
import { useState } from 'react';
import { GithubAuthProvider, linkWithPopup } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BitbucketIcon, GitLabIcon } from '@/components/icons';
import { useAuth, useFirestore, useUser } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { setRepositoryConnection } from '@/firebase/firestore/repositories';
import { RepositoryList } from '@/components/repository-list';

// Constants
const CONNECT_BUTTON_CLASSES =
  'bg-gradient-to-r from-indigo-600 to-blue-600 dark:from-purple-600 dark:to-violet-600 hover:from-indigo-700 hover:to-blue-700 dark:hover:from-purple-700 dark:hover:to-violet-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105';

export default function RepositoriesPage() {
  const auth = useAuth();
  const firestore = useFirestore();
  const { user } = useUser();
  const { toast } = useToast();
  const [showCredentialInUseAlert, setShowCredentialInUseAlert] = useState(false);

  // Check if GitHub is already connected
  const isGitHubConnected =
    user?.providerData.some(
      (p) => p.providerId === GithubAuthProvider.PROVIDER_ID
    ) || false;

  // Handle GitHub connection flow
  const handleGitHubConnect = async () => {
    // Validate user is authenticated
    if (!auth?.currentUser) {
      toast({
        variant: 'destructive',
        title: 'Authentication Error',
        description: 'You must be logged in to connect a repository.',
      });
      return;
    }

    // Check if already connected
    if (isGitHubConnected) {
      toast({
        title: 'GitHub Already Connected',
        description:
          'Your GitHub account is already linked. You can now select your repositories.',
      });
      return;
    }

    // Configure GitHub OAuth provider
    const provider = new GithubAuthProvider();
    provider.addScope('repo');

    try {
      // Link GitHub account via popup
      const result = await linkWithPopup(auth.currentUser, provider);
      const credential = GithubAuthProvider.credentialFromResult(result);
      const accessToken = credential?.accessToken;

      if (!accessToken || !auth.currentUser) {
        throw new Error('Could not retrieve access token from GitHub.');
      }

      // Save repository connection to Firestore
      await setRepositoryConnection(firestore, auth.currentUser.uid, {
        platform: 'github',
        accessToken: accessToken,
      });

      toast({
        title: 'GitHub Connected',
        description: 'Your GitHub account has been successfully linked.',
      });
    } catch (error: any) {
      console.error('GitHub link error:', error);

      // Handle specific error cases
      if (error.code === 'auth/credential-already-in-use') {
        setShowCredentialInUseAlert(true);
        return;
      }

      // Show appropriate error message
      const errorDescription =
        error.code === 'auth/account-exists-with-different-credential'
          ? 'An account with this email already exists. Please sign in with the original method to link your GitHub account.'
          : 'Could not connect to GitHub. Please try again.';

      toast({
        variant: 'destructive',
        title: 'Connection Failed',
        description: errorDescription,
      });
    }
  };

  // Handle sign out and redirect to login
  const handleSignOutAndLogin = async () => {
    if (!auth) return;

    try {
      await auth.signOut();
      setShowCredentialInUseAlert(false);
      toast({
        title: 'Signed Out',
        description: 'You have been signed out. Please log in again using GitHub.',
      });
      // User will be redirected to /login by the useUser hook
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:gap-8 md:p-8 animate-fade-in">
      {/* Page header with title and connect button */}
      <div className="flex items-center justify-between animate-slide-in-left">
        <div>
          <h1 className="font-headline text-4xl font-bold gradient-text mb-2">
            Repositories
          </h1>
          <p className="text-muted-foreground">Manage and connect your Git repositories</p>
        </div>

        {/* Connect repository dialog */}
        <Dialog>
          <DialogTrigger asChild>
            <Button className={CONNECT_BUTTON_CLASSES}>
              <Plus className="mr-2 h-4 w-4" />
              Connect Repository
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Connect a Git Repository</DialogTitle>
              <DialogDescription>
                Select a provider to connect and start generating documentation.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <Button
                variant="outline"
                className="justify-start hover:bg-slate-50 dark:hover:bg-zinc-800 hover:border-primary/50 hover:shadow-md transition-all duration-300 group"
                onClick={handleGitHubConnect}
                disabled={isGitHubConnected}
              >
                <Github className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                {isGitHubConnected ? 'GitHub Connected' : 'Connect with GitHub'}
              </Button>
              <Button
                variant="outline"
                className="justify-start opacity-50 cursor-not-allowed"
                disabled
              >
                <GitLabIcon className="mr-2 h-5 w-5" />
                Connect with GitLab
              </Button>
              <Button
                variant="outline"
                className="justify-start opacity-50 cursor-not-allowed"
                disabled
              >
                <BitbucketIcon className="mr-2 h-5 w-5" />
                Connect with Bitbucket
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Repository list card */}
      <Card className="border-2 shadow-xl hover:shadow-2xl transition-all duration-300 animate-scale-in">
        <CardHeader className="border-b">
          <CardTitle className="text-2xl">Connected Repositories</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <RepositoryList isGitHubConnected={isGitHubConnected} />
        </CardContent>
      </Card>

      {/* Alert dialog for credential conflict */}
      <AlertDialog open={showCredentialInUseAlert} onOpenChange={setShowCredentialInUseAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>GitHub Account Already In Use</AlertDialogTitle>
            <AlertDialogDescription>
              This GitHub account is already linked to another user. To connect it to this
              account, you should sign out and then log in using the &quot;Continue with
              GitHub&quot; option on the login page.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleSignOutAndLogin}>
              Sign Out & Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
