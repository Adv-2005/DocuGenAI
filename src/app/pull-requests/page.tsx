import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { ChevronsUpDown, MessageSquareQuote } from "lucide-react";
import { pullRequests } from "@/lib/data";

export default function PullRequestsPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <h1 className="font-headline text-3xl font-semibold">Pull Requests</h1>
      <div className="space-y-4">
        {pullRequests.map((pr) => (
          <Collapsible key={pr.id} className="space-y-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>{pr.title}</CardTitle>
                  <CardDescription>
                    #{pr.id} opened by {pr.author} in {pr.repo} {pr.time}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-4">
                  <Badge
                    variant={
                      pr.status === "Open"
                        ? "default"
                        : pr.status === "Merged"
                        ? "secondary"
                        : "destructive"
                    }
                    className={
                      pr.status === "Open"
                        ? "bg-green-600 text-white"
                        : ""
                    }
                  >
                    {pr.status}
                  </Badge>
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <ChevronsUpDown className="h-4 w-4" />
                      <span className="sr-only">Toggle</span>
                    </Button>
                  </CollapsibleTrigger>
                </div>
              </CardHeader>
              <CollapsibleContent>
                <CardContent className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <h3 className="font-semibold">Code Changes</h3>
                    <div className="rounded-md bg-muted p-4 font-code text-sm">
                      <pre>{pr.codeChanges}</pre>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-semibold flex items-center gap-2">
                      <MessageSquareQuote className="h-4 w-4 text-primary" />
                      AI-Suggested Documentation
                    </h3>
                    <div className="rounded-md border border-primary/20 bg-primary/5 p-4 text-sm">
                      <p>{pr.docSuggestion}</p>
                    </div>
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>
        ))}
      </div>
    </div>
  );
}
