import { config } from 'dotenv';
config();

import '@/ai/flows/generate-skill-suggestions.ts';
import '@/ai/flows/generate-profile-summary.ts';
import '@/ai/flows/refine-experience-bullet-points.ts';