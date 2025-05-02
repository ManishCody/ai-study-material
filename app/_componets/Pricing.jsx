import { Zap, BookOpen, Settings, Users, Check, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const features = [
  {
    icon: Zap,
    title: "Lightning-Fast Generation",
    description: "Create comprehensive study materials in seconds with our advanced AI technology."
  },
  {
    icon: BookOpen,
    title: "Personalized Learning",
    description: "Tailored content that adapts to your learning style and pace."
  },
  {
    icon: Settings,
    title: "Customizable Difficulty",
    description: "Fine-tune the complexity of materials to match your knowledge level."
  },
  {
    icon: Users,
    title: "Collaborative Learning",
    description: "Share and study with peers to enhance understanding and retention."
  }
];

const steps = [
  {
    number: "01",
    title: "Enter Your Topic",
    description: "Simply input what you want to learn about and set your preferred difficulty level."
  },
  {
    number: "02",
    title: "Generate Materials",
    description: "Get instant access to AI-generated notes, quizzes, and flashcards."
  },
  {
    number: "03",
    title: "Start Learning",
    description: "Dive into your personalized study materials and track your progress."
  }
];

export function AboutAndGuide() {
  return (
    <section id="about" className="relative m-3 overflow-hidden bg-background py-24 sm:py-32">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-[-20%] top-[-10%] h-[500px] w-[500px] rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute right-[-20%] bottom-[-10%] h-[500px] w-[500px] rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div id="learn-more" className="container relative">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-4">
            Revolutionize Your Learning with Study Beam
          </h2>
          <p className="text-lg text-muted-foreground">
            An AI-powered platform that transforms how you study, making learning more efficient and enjoyable than ever before.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-24">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-lg border bg-background p-6 hover:shadow-lg transition-all duration-200"
            >
              <div className="mb-4">
                <feature.icon className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* How It Works */}
        <div className="relative" id="get-started">
          <div className="mx-auto max-w-2xl text-center mb-12">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl mb-4">
              How Study Beam Works
            </h2>
            <p className="text-muted-foreground">
              Get started in three simple steps and transform your study routine
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div
                key={index}
                className={cn(
                  "relative p-6 rounded-lg border bg-background",
                 
                )}
              >
                <div className="mb-4 flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary font-bold">
                  {step.number}
                </div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Benefits */}
        <div id="why" className="mt-24 rounded-2xl border bg-background/50 backdrop-blur-sm p-8">
          <div className="flex items-center gap-2 mb-8">
            <Sparkles className="h-6 w-6 text-primary" />
            <h3 className="text-2xl font-semibold">Why Students Love Study Beam</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              "Save up to 70% of your study preparation time",
              "Access materials tailored to your learning style",
              "Track progress with detailed analytics",
              "Study smarter, not harder with AI assistance",
              "Connect with a community of learners",
              "Available 24/7 for flexible learning",
            ].map((benefit, index) => (
              <div key={index} className="flex items-center gap-3">
                <Check className="h-5 w-5 text-primary shrink-0" />
                <span className="text-muted-foreground">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )}