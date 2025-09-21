'use client';

import { useState } from 'react';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/hooks/use-toast';
import { AppHeader } from '@/components/app/header';
import { PredictionForm } from '@/components/app/prediction-form';
import { PredictionResults } from '@/components/app/prediction-results';
import { getPredictionAndExplanation } from '@/lib/actions';
import type { PredictionFormState, PredictionResult } from '@/lib/schema';
import { Skeleton } from '@/components/ui/skeleton';

function ResultsSkeleton() {
  return (
    <div className="space-y-8">
      <Skeleton className="h-48 w-full rounded-lg" />
      <Skeleton className="h-64 w-full rounded-lg" />
      <Skeleton className="h-56 w-full rounded-lg" />
    </div>
  )
}

export default function Home() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [predictionResult, setPredictionResult] = useState<PredictionResult | null>(null);
  const [formState, setFormState] = useState<PredictionFormState | null>(null);
  const { toast } = useToast();

  const handleFormSubmit = async (data: PredictionFormState) => {
    setIsSubmitting(true);
    setPredictionResult(null);
    setFormState(data);

    const response = await getPredictionAndExplanation(data);
    
    if (response.success) {
      setPredictionResult(response.result);
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: response.error,
      });
    }
    
    setIsSubmitting(false);
  };

  return (
    <>
      <main className="container mx-auto px-4 py-8">
        <AppHeader />
        <div className="mt-12 max-w-4xl mx-auto">
            <PredictionForm onSubmit={handleFormSubmit} isSubmitting={isSubmitting} />
            {(isSubmitting || predictionResult) && (
                <div className="mt-12">
                  <h2 className="text-3xl font-bold text-center mb-8 font-headline">Prediction Results</h2>
                  {isSubmitting && <ResultsSkeleton />}
                  {predictionResult && formState && (
                      <PredictionResults results={predictionResult} homeTeam={formState.homeTeam} awayTeam={formState.awayTeam} />
                  )}
                </div>
            )}
        </div>
      </main>
      <Toaster />
    </>
  );
}
