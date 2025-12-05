import { config } from 'dotenv';
config();

import '@/ai/flows/generate-architecture-overview.ts';
import '@/ai/flows/enable-semantic-search.ts';
import '@/ai/flows/auto-generate-module-level-readmes.ts';
import '@/ai/flows/generate-documentation-delta-for-prs.ts';