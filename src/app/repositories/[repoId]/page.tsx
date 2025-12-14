"use client";

import { use, useEffect, useMemo, useState } from "react";
import { Bot, Save, GitPullRequest, FileText, FileCode } from "lucide-react";
import { doc } from "firebase/firestore";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { modules, repositories } from "@/lib/data";
import { useDoc, useFirestore, useMemoFirebase, useUser } from "@/firebase";

export default function RepositoryPage({
  params,
}: {
  params: Promise<{ repoId: string }>;
}) {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [docContent, setDocContent] = useState("");
  const { repoId } = use(params);
  const decodedFullName = decodeURIComponent(repoId);

  const { user } = useUser();
  const firestore = useFirestore();
  const repoConnectionRef = useMemoFirebase(
    () =>
      user
        ? doc(
            firestore,
            "users",
            user.uid,
            "repositoryConnections",
            "github"
          )
        : null,
    [firestore, user]
  );
  const { data: repoConnection } = useDoc(repoConnectionRef);
  const accessToken = (repoConnection as any)?.accessToken as string | undefined;

  const repo = useMemo(() => {
    return (
      repositories.find(
        (r) => r.id === decodedFullName || r.name === decodedFullName
      ) || {
        id: decodedFullName,
        name: decodedFullName,
        provider: "github",
        lastUpdated: "",
        url: `https://github.com/${decodedFullName}`,
      }
    );
  }, [decodedFullName]);

  const handleGenerate = () => {
    if (!accessToken) {
      toast({
        variant: "destructive",
        title: "Missing GitHub token",
        description: "Reconnect GitHub to store a token, then try again.",
      });
      return;
    }

    setIsGenerating(true);
    setDocContent("");

    fetch("/api/generate-docs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        repoFullName: decodedFullName,
        accessToken,
      }),
    })
      .then(async (res) => {
        if (!res.ok) {
          const text = await res.text();
          throw new Error(
            `Generate failed (${res.status} ${res.statusText}): ${text}`
          );
        }
        const data = await res.json();
        setDocContent(data.content || "No content returned.");
      })
      .catch((error) => {
        console.error(error);
        toast({
          variant: "destructive",
          title: "Generation failed",
          description:
            "Could not generate documentation for this repository. Check the console for details.",
        });
        setDocContent("Generation failed. Please try again.");
      })
      .finally(() => {
        setIsGenerating(false);
      });
  };

  const handleCreatePR = () => {
    toast({
      title: "Pull Request Created",
      description: "Successfully created a PR with your documentation changes.",
    });
  };

    return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:gap-8 md:p-8 animate-fade-in">
      <div className="animate-slide-in-left">
        <h1 className="font-headline text-4xl font-bold gradient-text mb-2">{repo.name}</h1>
        <p className="text-muted-foreground">Generate and manage documentation for this repository</p>
      </div>
      
      <Tabs defaultValue="overview" className="animate-scale-in">
        <TabsList className="bg-white/80 backdrop-blur-sm border-2">
          <TabsTrigger value="overview" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-600 data-[state=active]:to-blue-600 data-[state=active]:text-white transition-all">
            <FileText className="mr-2 h-4 w-4" />
            Architecture Overview
          </TabsTrigger>
          <TabsTrigger value="modules" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-600 data-[state=active]:to-blue-600 data-[state=active]:text-white transition-all">
            <FileCode className="mr-2 h-4 w-4" />
            Module READMEs
          </TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="mt-6">
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <h2 className="text-2xl font-bold">In-App Editor</h2>
              <div className="flex gap-3 flex-wrap">
                <Button 
                  onClick={handleGenerate} 
                  disabled={isGenerating}
                  className="bg-gradient-to-r from-indigo-600 to-blue-600 dark:from-purple-600 dark:to-violet-600 hover:from-indigo-700 hover:to-blue-700 dark:hover:from-purple-700 dark:hover:to-violet-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Bot className={`mr-2 h-4 w-4 ${isGenerating ? 'animate-spin' : ''}`} />
                  {isGenerating ? "Generating..." : "Auto-Generate"}
                </Button>
                <Button 
                  variant="secondary"
                  className="hover:bg-slate-100 hover:shadow-md transition-all duration-300"
                >
                  <Save className="mr-2 h-4 w-4" />
                  Save
                </Button>
                <Button
                  variant="outline"
                  className="bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-fuchsia-600 dark:to-purple-600 hover:from-cyan-700 hover:to-blue-700 dark:hover:from-fuchsia-700 dark:hover:to-purple-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                  onClick={handleCreatePR}
                >
                  <GitPullRequest className="mr-2 h-4 w-4" />
                  Create Pull Request
                </Button>
              </div>
            </div>
            <div className="relative">
            <Textarea
              value={docContent}
              onChange={(e) => setDocContent(e.target.value)}
              placeholder="Click 'Auto-Generate' to create an architecture overview..."
                className="min-h-[500px] rounded-xl border-2 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm p-6 font-code text-sm shadow-xl focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-300"
              />
              {isGenerating && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm rounded-xl">
                  <div className="flex flex-col items-center gap-3">
                    <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                    <p className="text-sm text-muted-foreground font-medium">Generating documentation...</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </TabsContent>
        <TabsContent value="modules" className="mt-6">
          <h2 className="text-2xl font-bold mb-6">Module-level READMEs</h2>
          <Accordion type="single" collapsible className="w-full space-y-3">
            {modules.map((mod, index) => (
              <AccordionItem 
                value={mod.path} 
                key={mod.path}
                className="border-2 rounded-xl px-4 hover:border-primary/50 transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <AccordionTrigger className="font-semibold hover:text-primary transition-colors">
                  {mod.name}
                </AccordionTrigger>
                <AccordionContent className="pt-4">
                  <div className="space-y-4 rounded-lg border-2 bg-gradient-to-br from-slate-50 to-blue-50/30 p-6 shadow-md">
                    <h4 className="font-semibold text-lg flex items-center gap-2">
                      <FileText className="h-4 w-4 text-primary" />
                      Generated README:
                    </h4>
                    <div className="prose prose-sm max-w-none rounded-lg bg-white p-4 border shadow-sm">
                      <pre className="font-code text-sm whitespace-pre-wrap">{mod.readme}</pre>
                    </div>
                    <h4 className="font-semibold text-lg flex items-center gap-2">
                      <FileCode className="h-4 w-4 text-primary" />
                      Source Code:
                    </h4>
                    <div className="prose prose-sm max-w-none rounded-lg bg-slate-900 p-4 border shadow-sm">
                      <pre className="font-code text-sm text-slate-100">{mod.code}</pre>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </TabsContent>
      </Tabs>
    </div>
  );
}
