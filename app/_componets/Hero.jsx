"use client";

import { SignInButton, useUser } from "@clerk/nextjs";
import Link from "next/link";

export function Hero() {

  const { user } = useUser();

  return (
    <section className="flex flex-col items-center justify-center gap-4 py-24 md:py-32 text-center">
      <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
        Transform Your Learning with{" "}
        <span className="text-primary">AI-Powered Study Materials</span>
      </h1>
      <p className="max-w-[700px] text-muted-foreground md:text-xl">
        Generate personalized study materials, practice questions, and learning
        resources tailored to your needs using advanced AI technology.
      </p>
      <div className="flex flex-col gap-4 min-[400px]:flex-row">
       {!user && <SignInButton mode="modal">
          <button className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90">
            Get Started
          </button>
        </SignInButton>}
        <Link
          href="#learn-more"
          className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground"
        >
          Learn More
        </Link>
      </div>
    </section>
  );
}