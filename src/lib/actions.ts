'use server';

import { explainFeatureImportance, type ExplainFeatureImportanceInput } from '@/ai/flows/explain-feature-importance';
import { predictionFormSchema, type PredictionFormState, type PredictionResult } from '@/lib/schema';


// Simulate a model prediction
function simulatePrediction(data: PredictionFormState): Omit<PredictionResult, 'explanation'> {
  // Simple prediction logic based on team names and home advantage
  const homeAdvantage = 0.1;
  let homeScore = 1.0 + homeAdvantage + Math.random() * 0.5;
  let awayScore = 1.0 + Math.random() * 0.5;
  
  const totalScore = homeScore + awayScore;
  let homeWinProb = homeScore / totalScore;
  let awayWinProb = awayScore / totalScore;

  const diff = Math.abs(homeScore - awayScore);
  const drawProb = Math.max(0.1, 0.4 - diff * 0.2);

  const remainingProb = 1 - drawProb;
  homeWinProb = homeWinProb * remainingProb;
  awayWinProb = awayWinProb * remainingProb;

  const probSum = homeWinProb + awayWinProb + drawProb;
  homeWinProb /= probSum;
  awayWinProb /= probSum;
  const finalDrawProb = 1 - homeWinProb - awayWinProb;


  const probabilities = {
    homeWin: Math.round(homeWinProb * 100),
    draw: Math.round(finalDrawProb * 100),
    awayWin: Math.round(awayWinProb * 100),
  };
  
  const roundedSum = probabilities.homeWin + probabilities.draw + probabilities.awayWin;
  const diffFrom100 = 100 - roundedSum;
  probabilities.homeWin += diffFrom100;

  const maxProb = Math.max(probabilities.homeWin, probabilities.draw, probabilities.awayWin);
  let prediction: 'Home Win' | 'Draw' | 'Away Win';

  if (probabilities.homeWin === maxProb) {
    prediction = 'Home Win';
  } else if (probabilities.awayWin === maxProb) {
    prediction = 'Away Win';
  } else {
    prediction = 'Draw';
  }
  
  const confidence = (maxProb + (maxProb - (100 - maxProb)/2)) / 2;

  return {
    probabilities,
    prediction,
    confidence: Math.min(99, Math.max(40, Math.round(confidence))),
  };
}


export async function getPredictionAndExplanation(data: PredictionFormState): Promise<{ success: true, result: PredictionResult } | { success: false, error: string }> {
  const validation = predictionFormSchema.safeParse(data);
  if (!validation.success) {
    console.log(validation.error.flatten());
    return { success: false, error: 'Invalid input data. Please check the fields.' };
  }

  try {
    const { prediction, probabilities, confidence } = simulatePrediction(validation.data);
    
    const aiInput: ExplainFeatureImportanceInput = {
      homeTeam: validation.data.homeTeam,
      awayTeam: validation.data.awayTeam,
      predictionResult: prediction,
      confidenceScore: confidence / 100,
    };

    const { explanation } = await explainFeatureImportance(aiInput);

    return {
      success: true,
      result: {
        prediction,
        probabilities,
        confidence,
        explanation,
      },
    };
  } catch (e) {
    console.error(e);
    return { success: false, error: 'An unexpected error occurred while generating the prediction.' };
  }
}
