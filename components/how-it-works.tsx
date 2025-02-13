import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";

const steps = [
  {
    number: "01",
    title: "Search a Word",
    description:
      "Enter any English word to get instant definitions and Thai translations.",
  },
  {
    number: "02",
    title: "Save and Study",
    description:
      "Add words to your personal vocabulary list for future review.",
  },
  {
    number: "03",
    title: "Practice",
    description: "Use example sentences and collocations to master word usage.",
  },
  {
    number: "04",
    title: "Review",
    description: "Track your progress and review words at optimal intervals.",
  },
];

export function HowItWorks() {
  return (
    <div className="py-24 sm:py-32 bg-muted">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-primary">
            Getting Started
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            How It Works
          </p>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Follow these simple steps to start improving your English vocabulary
            today.
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
            {steps.map((step) => (
              <Card key={step.number} className="relative">
                <CardContent className="pt-6">
                  <Badge variant="secondary" className="absolute -top-3 left-6">
                    {step.number}
                  </Badge>
                  <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
