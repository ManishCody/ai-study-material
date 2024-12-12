import { Check } from "lucide-react";

const plans = [
  {
    name: "Free",
    price: "₹0",
    description: "Perfect for getting started",
    features: [
      "5 AI-generated study guides per month",
      "Basic practice questions",
      "Ads included",
    ],
    button: "Get Started",
    buttonStyle: "bg-secondary text-secondary-foreground",
  },
  {
    name: "Pro",
    price: "₹20",
    description: "Ideal for learners seeking more control",
    features: [
      "20 AI-generated study guides",
      "Ad-free experience",
      "Priority support",
    ],
    button: "Upgrade to Pro",
    buttonStyle: "bg-primary text-primary-foreground hover:bg-primary/90",
  },
  {
    name: "Premium",
    price: "₹30",
    description: "For serious learners",
    features: [
      "Unlimited AI-generated guides",
      "Ad-free experience",
      "Custom templates",
      "Priority 24/7 support",
    ],
    button: "Go Premium",
    buttonStyle: "bg-gradient-to-r from-teal-500 to-blue-600 text-white hover:opacity-90",
  },
];

export default function page() {
  return (
    <section id="upgrade-plans" className="">
      <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-16">
        Upgrade Your Learning Experience
      </h2>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3 max-w-6xl mx-auto">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`flex flex-col p-8 border rounded-lg shadow-sm ${
              plan.name === "Premium" ? "border-primary" : "border-muted"
            }`}
          >
            <h3 className="text-2xl font-bold">{plan.name}</h3>
            <div className="mt-4 flex items-baseline">
              <span className="text-4xl font-bold">{plan.price}</span>
              <span className="ml-1 text-muted-foreground">
                {plan.price === "₹0" ? "" : "/month"}
              </span>
            </div>
            <p className="mt-2 text-muted-foreground">{plan.description}</p>
            <ul className="mt-8 space-y-4">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center">
                  <Check className="h-5 w-5 text-primary shrink-0" />
                  <span className="ml-3">{feature}</span>
                </li>
              ))}
            </ul>
            <button
              className={`mt-8 inline-flex h-10 items-center justify-center rounded-md px-8 text-sm font-medium ring-offset-background transition-colors ${plan.buttonStyle}`}
            >
              {plan.button}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
