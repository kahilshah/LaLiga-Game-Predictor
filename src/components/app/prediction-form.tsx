'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';
import { Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { laLigaTeams } from '@/lib/teams';
import { predictionFormSchema } from '@/lib/schema';

type PredictionFormValues = z.infer<typeof predictionFormSchema>;

interface PredictionFormProps {
    onSubmit: (data: PredictionFormValues) => void;
    isSubmitting: boolean;
}

export function PredictionForm({ onSubmit, isSubmitting }: PredictionFormProps) {
  const form = useForm<PredictionFormValues>({
    resolver: zodResolver(predictionFormSchema),
    defaultValues: {
      homeTeam: 'Real Madrid',
      awayTeam: 'Barcelona',
    },
  });

  const availableAwayTeams = laLigaTeams.filter(team => team !== form.watch('homeTeam'));
  const availableHomeTeams = laLigaTeams.filter(team => team !== form.watch('awayTeam'));

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Match Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                control={form.control}
                name="homeTeam"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Home Team</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Select home team" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                        {availableHomeTeams.map((team) => (
                            <SelectItem key={team} value={team}>
                            {team}
                            </SelectItem>
                        ))}
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="awayTeam"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Away Team</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Select away team" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                        {availableAwayTeams.map((team) => (
                            <SelectItem key={team} value={team}>
                            {team}
                            </SelectItem>
                        ))}
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-center">
            <Button type="submit" size="lg" disabled={isSubmitting} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Predict Match Outcome
            </Button>
        </div>
      </form>
    </Form>
  );
}
