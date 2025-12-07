'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Github } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useUser, useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { doc } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';

const providerIcons = {
  github: <Github className="h-5 w-5" />,
};

type Repository = {
  id: number;
  name: string;
  full_name: string;
  updated_at: string;
  [key: string]: any; // Allow other properties
};

export function RepositoryList({
  isGitHubConnected,
}: {
  isGitHubConnected: boolean;
}) {
  const { user } = useUser();
  const [repos, setRepos] = useState<Repository[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { toast } = useToast();

  const firestore = useFirestore();
  const repoConnectionRef = useMemoFirebase(
    () => (user ? doc(firestore, 'users', user.uid, 'repositoryConnections', 'github') : null),
    [firestore, user]
  );
  const { data: repoConnection, isLoading: isConnectionLoading } = useDoc(repoConnectionRef);

  useEffect(() => {
    const fetchRepos = async () => {
      if (isConnectionLoading) {
        return;
      }
      
      if (repoConnection && (repoConnection as any).accessToken) {
        setIsLoading(true);
        setErrorMessage(null);
        try {
          const response = await fetch('https://api.github.com/user/repos?sort=updated&direction=desc', {
            headers: {
              Authorization: `Bearer ${(repoConnection as any).accessToken}`,
              Accept: 'application/vnd.github+json',
              'User-Agent': 'docugenai-app',
            },
          });
          if (!response.ok) {
            const body = await response.text();
            const message = `GitHub returned ${response.status}: ${response.statusText}`;
            console.error('GitHub repo fetch error', { status: response.status, body });
            setErrorMessage(message);
            toast({
              variant: 'destructive',
              title: 'GitHub fetch failed',
              description: message,
            });
            setRepos([]);
            return;
          }
          const data = await response.json();
          setRepos(data);
        } catch (error) {
          console.error(error);
          setErrorMessage('Could not fetch repositories from GitHub.');
          setRepos([]);
        } finally {
          setIsLoading(false);
        }
      } else {
        setRepos([]);
        setIsLoading(false);
      }
    };

    fetchRepos();
  }, [repoConnection, isConnectionLoading, isGitHubConnected]);

  if (!isGitHubConnected) {
    return (
      <p className="text-muted-foreground">
        Please connect your GitHub account to see your repositories.
      </p>
    );
  }

  if (isLoading || isConnectionLoading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-2/3" />
      </div>
    );
  }

  if (repos.length === 0) {
    return (
      <p className="text-muted-foreground">
        {errorMessage ? errorMessage : 'No repositories found.'}
      </p>
    )
  }

  return (
    <div className="space-y-2">
    <Table>
      <TableHeader>
          <TableRow className="border-b-2 hover:bg-transparent">
            <TableHead className="font-semibold">Name</TableHead>
            <TableHead className="font-semibold">Provider</TableHead>
            <TableHead className="font-semibold">Last Updated</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
          {repos.map((repo, index) => (
            <TableRow 
              key={repo.id} 
              className="hover:bg-gradient-to-r hover:from-indigo-50/50 hover:to-blue-50/50 transition-all duration-300 cursor-pointer border-b hover:border-primary/20 animate-fade-in"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
            <TableCell className="font-medium">
              <Link
                  href={`/repositories/${encodeURIComponent(repo.full_name)}`}
                  className="hover:text-primary transition-colors duration-200 font-semibold group"
              >
                  <span className="group-hover:underline">{repo.full_name}</span>
              </Link>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-md bg-slate-100 group-hover:bg-indigo-100 transition-colors">
                {providerIcons['github']}
                  </div>
                  <span className="capitalize font-medium">github</span>
              </div>
            </TableCell>
              <TableCell className="text-muted-foreground">
              {new Date(repo.updated_at).toLocaleDateString()}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
    </div>
  );
}
