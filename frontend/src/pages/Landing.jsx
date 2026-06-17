import { Link } from "react-router-dom";
import { ArrowRight, BarChart3, FileText, Leaf, Lightbulb, ShieldCheck, Target, TrendingDown } from "lucide-react";

const features = [
  {
    title: "Activity tracking",
    description: "Log transport, electricity, food, water, shopping, and waste activity in one focused workspace.",
    icon: Leaf
  },
  {
    title: "Carbon calculator",
    description: "Every entry is converted into kg CO2e using editable MongoDB-backed emission factors.",
    icon: BarChart3
  },
  {
    title: "Recommendations",
    description: "EcoBuddy AI turns high-emission patterns into targeted reduction actions.",
    icon: Lightbulb
  },
  {
    title: "Reports",
    description: "Weekly, monthly, and category reports summarize progress and export as PDF.",
    icon: FileText
  }
];

const benefits = [
  {
    title: "See what matters",
    description: "Category and trend charts reveal which habits shape your footprint most.",
    icon: ShieldCheck
  },
  {
    title: "Reduce with intent",
    description: "Set measurable reduction targets and track progress toward completion.",
    icon: Target
  },
  {
    title: "Build momentum",
    description: "Recent activities, goals, and score changes keep sustainable choices visible.",
    icon: TrendingDown
  }
];

const Landing = () => (
  <div>
    <section className="hero-image relative flex min-h-[calc(100vh-4.25rem)] items-center">
      <div className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="max-w-2xl text-white">
          <p className="text-sm font-semibold uppercase tracking-wide text-teal-200">Carbon Footprint Awareness Platform</p>
          <h1 className="mt-4 text-5xl font-bold leading-tight sm:text-6xl lg:text-7xl">EcoBuddy AI</h1>
          <p className="mt-5 text-xl font-medium text-slate-100">
            Understand your impact. Reduce your footprint. Save the planet.
          </p>
          <p className="mt-6 max-w-xl text-base leading-7 text-slate-200">
            A single-user full-stack dashboard for measuring emissions, finding high-impact habits, and turning awareness
            into practical climate action.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 rounded-lg bg-teal-500 px-5 py-3 text-sm font-bold text-white transition motion-reduce:transition-none motion-reduce:transform-none hover:bg-teal-400"
            >
              Go to Dashboard
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              to="/activities"
              className="inline-flex items-center gap-2 rounded-lg border border-white/40 bg-white/10 px-5 py-3 text-sm font-bold text-white backdrop-blur transition motion-reduce:transition-none motion-reduce:transform-none hover:bg-white/20"
            >
              Track Activity
            </Link>
          </div>
        </div>
      </div>
    </section>

    <section className="bg-white py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-teal-700">Project Overview</p>
          <h2 className="mt-2 text-3xl font-bold text-slate-950">A practical carbon awareness workspace</h2>
          <p className="mt-4 text-base leading-7 text-slate-600">
            EcoBuddy AI combines activity logging, emission calculation, goal tracking, recommendations, and downloadable
            reports in a clean MVC-backed application powered by React, Express, MongoDB, and Mongoose.
          </p>
        </div>
      </div>
    </section>

    <section className="bg-slate-50 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-2">
          <p className="text-sm font-semibold uppercase tracking-wide text-teal-700">Features</p>
          <h2 className="text-3xl font-bold text-slate-950">Everything needed to understand emissions</h2>
        </div>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <article key={feature.title} className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
              <div className="inline-flex rounded-lg bg-teal-50 p-2 text-teal-700">
                <feature.icon className="h-5 w-5" aria-hidden="true" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-slate-950">{feature.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{feature.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>

    <section className="bg-white py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-teal-700">Benefits</p>
            <h2 className="mt-2 text-3xl font-bold text-slate-950">Small decisions become measurable progress</h2>
            <Link
              to="/dashboard"
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-slate-950 px-5 py-3 text-sm font-bold text-white transition motion-reduce:transition-none motion-reduce:transform-none hover:bg-slate-800"
            >
              Open Dashboard
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
          <div className="grid gap-5 sm:grid-cols-3">
            {benefits.map((benefit) => (
              <article key={benefit.title} className="rounded-lg border border-slate-200 bg-slate-50 p-5">
                <benefit.icon className="h-6 w-6 text-amber-600" aria-hidden="true" />
                <h3 className="mt-4 text-base font-semibold text-slate-950">{benefit.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{benefit.description}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  </div>
);

export default Landing;
