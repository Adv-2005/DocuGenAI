'use client';

import Link from 'next/link';
import { getAuth } from 'firebase/auth';
import { useUser } from '@/firebase';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

export function UserProfile() {
  const { user, isUserLoading } = useUser();
  const auth = getAuth();

  if (isUserLoading) {
    return null;
  }

  if (!user) {
    return (
      <Button asChild>
        <Link href="/login">Login</Link>
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium">
      <Avatar className="h-8 w-8">
        {user.photoURL && (
          <AvatarImage
            src={user.photoURL}
            alt={user.displayName || 'User Avatar'}
            width={32}
            height={32}
          />
        )}
        <AvatarFallback>
          {user.email ? user.email.charAt(0).toUpperCase() : 'U'}
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col">
        <span className="text-sm font-semibold">
          {user.displayName || user.email}
        </span>
        <Button
          variant="link"
          className="h-auto p-0 text-xs text-muted-foreground"
          onClick={() => auth.signOut()}
        >
          Sign Out
        </Button>
      </div>
    </div>
  );
}
