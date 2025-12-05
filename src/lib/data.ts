export type Repository = {
  id: string;
  name: string;
  provider: "github" | "gitlab" | "bitbucket";
  lastUpdated: string;
  url: string;
};

export const repositories: Repository[] = [
  {
    id: "frontend-app",
    name: "webapp/frontend",
    provider: "github",
    lastUpdated: "2 hours ago",
    url: "#",
  },
  {
    id: "backend-service",
    name: "services/user-api",
    provider: "gitlab",
    lastUpdated: "1 day ago",
    url: "#",
  },
  {
    id: "data-pipeline",
    name: "infra/data-pipeline",
    provider: "bitbucket",
    lastUpdated: "3 days ago",
    url: "#",
  },
  {
    id: "mobile-app",
    name: "mobile/ios-app",
    provider: "github",
    lastUpdated: "5 days ago",
    url: "#",
  },
  {
    id: "design-system",
    name: "libs/design-system",
    provider: "github",
    lastUpdated: "1 week ago",
    url: "#",
  },
];

export type PullRequest = {
  id: number;
  title: string;
  author: string;
  repo: string;
  status: "Open" | "Merged" | "Closed";
  time: string;
  codeChanges: string;
  docSuggestion: string;
};

export const pullRequests: PullRequest[] = [
  {
    id: 1,
    title: "feat: Add user profile page",
    author: "Jane Doe",
    repo: "webapp/frontend",
    status: "Open",
    time: "3 hours ago",
    codeChanges: `+ const UserProfile = () => {
+   return <div>New Profile Page</div>;
+ };`,
    docSuggestion:
      "A new component `UserProfile` was added. Consider adding a section to the `Components.md` file explaining its purpose and usage.",
  },
  {
    id: 2,
    title: "fix: Correct authentication flow",
    author: "John Smith",
    repo: "services/user-api",
    status: "Merged",
    time: "1 day ago",
    codeChanges: `- function authenticate() { /* old logic */ }
+ function authenticate() { /* new logic with fix */ }`,
    docSuggestion:
      "The authentication logic has been updated. The `Authentication.md` guide should be reviewed to ensure it reflects the new JWT validation steps.",
  },
  {
    id: 3,
    title: "refactor: Optimize database queries",
    author: "Emily White",
    repo: "services/user-api",
    status: "Open",
    time: "2 days ago",
    codeChanges: `  const users = await db.query('SELECT * FROM users');
- const user_details = await db.query('SELECT * FROM user_details WHERE user_id = ?', [users[0].id]);
+ const user_details = await db.query('SELECT * FROM user_details WHERE user_id IN (?)', [users.map(u => u.id)]);`,
    docSuggestion:
      "Database query performance was improved by reducing N+1 queries. The 'Data Flow' section in the architecture overview could be updated to mention this optimization.",
  },
];

export const architectureOverview = `
# Architecture Overview for DocuGenAI

This document provides a high-level overview of the DocuGenAI application architecture.

## Core Components

The system is composed of three main parts:

1.  **Frontend**: A Next.js single-page application that provides the user interface for connecting repositories, viewing documentation, and interacting with the AI generation features.
2.  **AI Services**: A set of serverless functions (Genkit flows) that handle the core logic of code analysis, documentation generation, and semantic search. These are powered by Google's Gemini models.
3.  **Backend & Data Store**: A Firestore database is used to store user data, repository metadata, generated documentation versions, and application metrics.

## Data Flow

-   **Repo Connection**: Users connect their Git repositories via OAuth. An access token is securely stored to allow the system to clone and analyze the code.
-   **Code Analysis**: When a repository is analyzed, the code is passed to the 'Semantic Code Analysis' Genkit flow. This flow uses Abstract Syntax Trees (ASTs) and embeddings to understand the code's structure.
-   **Documentation Generation**: The output from the analysis flow is fed into various generation flows (e.g., 'Architecture Overview', 'Module READMEs') to produce Markdown documentation.
-   **Saving & PRs**: Users can edit the generated documentation. When saved, the changes are either pushed directly to a \`.docs\` folder in the repository or a new pull request is created with the documentation changes.
`;

export type Module = {
  name: string;
  path: string;
  code: string;
  readme: string;
};

export const modules: Module[] = [
  {
    name: "Button Component",
    path: "src/components/ui/button.tsx",
    code: "export const Button = () => <button>Click me</button>;",
    readme: `### Button Component\n\nThe Button component is a standard, reusable button that can be used throughout the application. It supports different variants like 'primary', 'secondary', and 'destructive'.`,
  },
  {
    name: "Authentication Hook",
    path: "src/hooks/use-auth.ts",
    code: "export function useAuth() { /* ... */ }",
    readme: `### useAuth Hook\n\nThis hook provides access to the current user's authentication state and methods to log in and log out.`,
  },
  {
    name: "API Client",
    path: "src/lib/api.ts",
    code: "export const apiClient = { get: (url) => fetch(url) };",
    readme: `### API Client\n\nA simple wrapper around the \`fetch\` API for making requests to the backend. It automatically includes authorization headers.`,
  },
];
