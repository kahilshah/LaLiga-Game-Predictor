'use server';

/**
 * @fileOverview Explains the feature importance for a La Liga match prediction.
 *
 * - explainFeatureImportance - A function that explains the feature importance for a La Liga match prediction.
 * - ExplainFeatureImportanceInput - The input type for the explainFeatureImportance function.
 * - ExplainFeatureImportanceOutput - The return type for the explainFeatureImportance function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExplainFeatureImportanceInputSchema = z.object({
  homeTeam: z.string().describe('The name of the home team.'),
  awayTeam: z.string().describe('The name of the away team.'),
  predictionResult: z.string().describe('The predicted outcome of the match (win, draw, or loss for the home team).'),
  confidenceScore: z.number().describe('The confidence score of the prediction (0-1).'),
});
export type ExplainFeatureImportanceInput = z.infer<
  typeof ExplainFeatureImportanceInputSchema
>;

const ExplainFeatureImportanceOutputSchema = z.object({
  explanation: z.string().describe('A user-friendly explanation of what could influence the prediction.'),
});
export type ExplainFeatureImportanceOutput = z.infer<
  typeof ExplainFeatureImportanceOutputSchema
>;

export async function explainFeatureImportance(
  input: ExplainFeatureImportanceInput
): Promise<ExplainFeatureImportanceOutput> {
  return explainFeatureImportanceFlow(input);
}

const explainFeatureImportancePrompt = ai.definePrompt({
  name: 'explainFeatureImportancePrompt',
  input: {schema: ExplainFeatureImportanceInputSchema},
  output: {schema: ExplainFeatureImportanceOutputSchema},
  prompt: `You are an expert football (soccer) analyst specializing in La Liga matches.

You will be provided with the names of the home and away teams, the predicted outcome of the match, and a confidence score for the prediction.

Your task is to generate a user-friendly analysis for the match. Talk about what factors generally influence a match's outcome between these two teams. Consider factors like historical rivalry, general team strength, and home-field advantage. Do not mention specific stats as they are not provided.

Home Team: {{{homeTeam}}}
Away Team: {{{awayTeam}}}
Prediction Result: {{{predictionResult}}}
Confidence Score: {{{confidenceScore}}}

Explanation:`,
});

const explainFeatureImportanceFlow = ai.defineFlow(
  {
    name: 'explainFeatureImportanceFlow',
    inputSchema: ExplainFeatureImportanceInputSchema,
    outputSchema: ExplainFeatureImportanceOutputSchema,
  },
  async input => {
    const {output} = await explainFeatureImportancePrompt(input);
    return output!;
  }
);
