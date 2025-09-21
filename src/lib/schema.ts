import { z } from 'zod';

export const predictionFormSchema = z.object({
  homeTeam: z.string().min(1, 'Home team is required.'),
  awayTeam: z.string().min(1, 'Away team is required.'),
}).refine(data => data.homeTeam !== data.awayTeam, {
  message: 'Home and away teams must be different.',
  path: ['awayTeam'],
});

export type PredictionFormState = z.infer<typeof predictionFormSchema>;

export interface PredictionResult {
  probabilities: {
    homeWin: number;
    draw: number;
    awayWin: number;
  };
  prediction: 'Home Win' | 'Draw' | 'Away Win';
  confidence: number;
  explanation: string;
}
