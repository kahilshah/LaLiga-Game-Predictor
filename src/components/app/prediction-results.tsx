import { BarChart, Bot, Trophy, Handshake, ShieldX } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import type { PredictionResult } from '@/lib/schema';

interface PredictionResultsProps {
  results: PredictionResult;
  homeTeam: string;
  awayTeam: string;
}

function getOutcomeIcon(prediction: string) {
    if (prediction.includes('Win')) return <Trophy className="h-6 w-6" />;
    if (prediction.includes('Draw')) return <Handshake className="h-6 w-6" />;
    return <ShieldX className="h-6 w-6" />;
}

export function PredictionResults({ results, homeTeam, awayTeam }: PredictionResultsProps) {
  const outcomeText = results.prediction === 'Home Win' ? `${homeTeam} to Win` : results.prediction === 'Away Win' ? `${awayTeam} to Win` : 'Draw';

  const probabilities = [
    { label: `${homeTeam} Win`, value: results.probabilities.homeWin },
    { label: 'Draw', value: results.probabilities.draw },
    { label: `${awayTeam} Win`, value: results.probabilities.awayWin },
  ];

  return (
    <div className="space-y-8">
      <Card className="bg-gradient-to-br from-primary/90 to-primary text-primary-foreground shadow-xl">
        <CardHeader className="flex-row items-center gap-4 space-y-0">
          <div className="bg-primary-foreground/20 p-3 rounded-full">
            {getOutcomeIcon(results.prediction)}
          </div>
          <div>
            <CardDescription className="text-primary-foreground/80">Predicted Outcome</CardDescription>
            <CardTitle className="text-3xl font-bold">{outcomeText}</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
            <div className="text-center">
                <p className="text-sm text-primary-foreground/80 mb-1">Confidence</p>
                <p className="text-5xl font-bold">{results.confidence}%</p>
                <Progress value={results.confidence} className="mt-2 h-2 bg-primary-foreground/20 [&>div]:bg-primary-foreground" />
            </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart className="h-5 w-5 text-muted-foreground" />
            Outcome Probabilities
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {probabilities.map(prob => (
            <div key={prob.label} className="space-y-1">
              <div className="flex justify-between text-sm font-medium">
                <span className="text-muted-foreground">{prob.label}</span>
                <span className="text-foreground font-semibold">{prob.value}%</span>
              </div>
              <Progress value={prob.value} className="h-2" />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-muted-foreground" />
            AI-Powered Analysis
          </CardTitle>
          <CardDescription>
            How team statistics could influence this prediction.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">{results.explanation}</p>
        </CardContent>
      </Card>
    </div>
  );
}
