import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

function FootballIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 2a5 5 0 1 0 5 5" />
      <path d="M12 2a5 5 0 1 1-5 5" />
      <path d="M12 22a5 5 0 1 0 5-5" />
      <path d="M12 22a5 5 0 1 1-5-5" />
      <path d="m7 7 10 10" />
      <path d="m7 17 10-10" />
      <path d="M2 12a5 5 0 1 0 10 0 5 5 0 1 0-10 0Z" />
      <path d="M22 12a5 5 0 1 0-10 0 5 5 0 1 0 10 0Z" />
    </svg>
  );
}


export function AppHeader() {
  const logoImage = PlaceHolderImages.find((img) => img.id === 'logo');

  return (
    <header className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-center gap-4 text-center">
        {logoImage ? (
          <Image
            src={logoImage.imageUrl}
            alt={logoImage.description}
            width={64}
            height={64}
            className="rounded-full"
            data-ai-hint={logoImage.imageHint}
          />
        ) : (
          <div className="p-4 bg-primary rounded-full">
            <FootballIcon className="h-8 w-8 text-primary-foreground" />
          </div>
        )}
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground font-headline">
          La Liga Forecaster
        </h1>
      </div>
      <p className="mt-4 text-center text-lg text-muted-foreground max-w-2xl mx-auto">
        Predict La Liga match outcomes using team statistics. Fill in the form below to get a prediction and an AI-powered analysis of the key factors.
      </p>
    </header>
  );
}
