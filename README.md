TEst1# DocuGenAI

Next.js app that connects to code repositories and generates documentation with AI. The UI is built with shadcn/ui and Tailwind, and Firebase is used for auth + data.

## Quick start

1) Install dependencies: `npm install`
2) Run the app: `npm run dev`
3) Open http://localhost:9002

## Firebase setup

Set the Firebase client config via env vars (e.g. in `.env.local`):

```
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your-measurement-id
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
```
