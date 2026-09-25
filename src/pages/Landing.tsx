import { motion } from "framer-motion";
import { useNavigate } from "react-router";
import { useState, useEffect } from "react";
import {
  Zap, TrendingUp, Brain, Shield, Activity, ArrowRight,
  BarChart3, Database, Workflow, Target, Package, AlertTriangle,
  Sparkles, CheckCircle, ChevronRight,
} from "lucide-react";
import { kpiData } from "@/lib/demo-data";

const pipelineSteps = [
  { label: "Raw Data", icon: Database, color: "bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300" },
  { label: "Processing", icon: Workflow, color: "bg-indigo-100 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300" },
  { label: "Feature Eng.", icon: Settings2, color: "bg-cyan-100 text-cyan-700 dark:bg-cyan-950/50 dark:text-cyan-300" },
  { label: "ML Models", icon: Brain, color: "bg-purple-100 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300" },
  { label: "Forecast", icon: TrendingUp, color: "bg-green-100 text-green-700 dark:bg-green-950/50 dark:text-green-300" },
  { label: "Monitor", icon: Activity, color: "bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300" },
  { label: "Retrain", icon: Zap, color: "bg-pink-100 text-pink-700 dark:bg-pink-950/50 dark:text-pink-300" },
];

function Settings2(props: { className?: string }) {
  return <Brain {...props} />;
}

const floatingCards = [
  { label: "Forecast Accuracy", value: "94.7%", icon: Target, bg: "bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300" },
  { label: "Active Models", value: "5", icon: Brain, bg: "bg-indigo-100 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300" },
  { label: "Products Tracked", value: "1,250", icon: Package, bg: "bg-green-100 text-green-700 dark:bg-green-950/50 dark:text-green-300" },
  { label: "Forecast Horizon", value: "30 Days", icon: BarChart3, bg: "bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300" },
  { label: "Model Health", value: "Healthy", icon: Shield, bg: "bg-cyan-100 text-cyan-700 dark:bg-cyan-950/50 dark:text-cyan-300" },
];

const features = [
  {
    title: "ML-Powered Forecasting",
    description: "8 state-of-the-art ML models including XGBoost, LSTM, Prophet, and more for accurate demand prediction.",
    icon: Brain,
    pastel: "bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300",
  },
  {
    title: "MLOps Pipeline",
    description: "End-to-end automated pipeline from data collection through deployment, monitoring, and retraining.",
    icon: Workflow,
    pastel: "bg-indigo-100 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300",
  },
  {
    title: "Real-Time Monitoring",
    description: "Track model performance, data drift, system metrics, and anomalies in real-time.",
    icon: Activity,
    pastel: "bg-cyan-100 text-cyan-700 dark:bg-cyan-950/40 dark:text-cyan-300",
  },
  {
    title: "Anomaly Detection",
    description: "Automated detection of demand spikes, drops, inventory issues, and data quality problems.",
    icon: AlertTriangle,
    pastel: "bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300",
  },
  {
    title: "Explainable AI",
    description: "Understand why models make predictions with feature importance and natural language explanations.",
    icon: Sparkles,
    pastel: "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300",
  },
  {
    title: "Automated Retraining",
    description: "Continuous model improvement through automated retraining triggered by drift or performance degradation.",
    icon: Zap,
    pastel: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300",
  },
];

const workflowSteps = [
  "Collect historical sales data",
  "Clean and validate data",
  "Perform exploratory data analysis",
  "Engineer useful features",
  "Train multiple forecasting models",
  "Evaluate and select best model",
  "Register and deploy the model",
  "Generate demand predictions",
  "Monitor model performance",
  "Detect data and model drift",
  "Automatically retrain when needed",
];

export default function Landing() {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % pipelineSteps.length);
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-indigo-100 selection:text-indigo-900">
      {/* Navbar */}
      <nav className="border-b border-border/60 bg-card/75 backdrop-blur-md sticky top-0 z-40 transition-colors">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="size-9 rounded-xl flex items-center justify-center bg-gradient-to-tr from-indigo-100 via-purple-100 to-pink-100 dark:from-indigo-950 dark:via-purple-950 dark:to-pink-950 border border-indigo-200/60 dark:border-indigo-800/40 text-indigo-600 dark:text-indigo-400 shadow-sm">
              <Zap className="size-4 fill-indigo-500/20 text-indigo-600 dark:text-indigo-400" />
            </div>
            <span className="font-bold text-base tracking-tight">MLOps Forecast</span>
          </div>
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => navigate("/auth")}
              className="px-4 py-2 text-xs font-semibold rounded-xl text-muted-foreground hover:text-foreground hover:bg-slate-100/80 dark:hover:bg-slate-800/50 transition-all"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate("/auth")}
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm hover:shadow-indigo-500/25 transition-all"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12 md:py-20">
        <div className="relative rounded-3xl border border-indigo-100/80 dark:border-indigo-950/60 bg-gradient-to-br from-indigo-50/70 via-purple-50/40 to-pink-50/30 dark:from-slate-900/80 dark:via-indigo-950/20 dark:to-slate-900 p-8 md:p-14 shadow-sm overflow-hidden">
          {/* Subtle pastel decorative background glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-purple-200/30 via-indigo-200/20 to-transparent dark:from-indigo-900/20 dark:via-purple-900/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-gradient-to-tr from-pink-200/20 via-sky-200/20 to-transparent dark:from-slate-800/30 dark:via-pink-900/10 rounded-full blur-2xl pointer-events-none -ml-16 -mb-16" />

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative z-10"
          >
            <div className="inline-flex items-center gap-2 rounded-full px-3.5 py-1 text-xs font-semibold bg-white/80 dark:bg-slate-800/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/40 mb-5 shadow-xs backdrop-blur-xs">
              <Sparkles className="size-3 text-indigo-500" />
              MLOps-Driven Predictive Analytics Framework
            </div>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight md:leading-tight mb-5 text-slate-900 dark:text-white">
              Intelligent Demand Forecasting <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent dark:from-indigo-400 dark:via-purple-300 dark:to-pink-400">
                Powered by MLOps
              </span>
            </h1>
            <p className="text-slate-600 dark:text-slate-300 text-sm md:text-base max-w-2xl mb-8 leading-relaxed font-normal">
              An end-to-end predictive analytics framework that transforms historical sales data into accurate
              demand forecasts using machine learning, automated model deployment, monitoring, and continuous retraining.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => navigate("/auth")}
                className="px-5 py-2.5 text-xs sm:text-sm font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm hover:shadow-indigo-500/25 transition-all flex items-center gap-2 cursor-pointer"
              >
                <BarChart3 className="size-4" /> Explore Dashboard <ArrowRight className="size-4" />
              </button>
              <button
                onClick={() => navigate("/auth")}
                className="px-5 py-2.5 text-xs sm:text-sm font-semibold rounded-xl bg-white/80 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700 transition-all flex items-center gap-2 cursor-pointer shadow-xs"
              >
                <TrendingUp className="size-4 text-indigo-500" /> View Forecasts
              </button>
              <button
                onClick={() => document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" })}
                className="px-5 py-2.5 text-xs sm:text-sm font-semibold rounded-xl hover:bg-white/60 dark:hover:bg-slate-800/40 text-slate-600 dark:text-slate-300 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Workflow className="size-4 text-purple-500" /> How It Works
              </button>
            </div>
          </motion.div>
        </div>

        {/* Floating KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 mt-6">
          {floatingCards.map((card, i) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.label}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.08 * i }}
                className="rounded-2xl border border-border/70 bg-card p-4 shadow-xs hover:shadow-sm hover:-translate-y-0.5 transition-all duration-150"
              >
                <div className={`size-8 rounded-xl flex items-center justify-center ${card.bg} mb-3 shadow-xs`}>
                  <Icon className="size-4" />
                </div>
                <div className="text-xl font-bold tracking-tight text-foreground">{card.value}</div>
                <div className="text-xs text-muted-foreground mt-0.5 font-medium">{card.label}</div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Animated Pipeline */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="text-center mb-8">
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-900/40">
            Lifecycle Automation
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mt-2 text-foreground">
            End-to-End MLOps Pipeline
          </h2>
          <p className="text-muted-foreground text-xs sm:text-sm mt-1">
            DATA → ML → FORECAST → DEPLOY → MONITOR → DRIFT → RETRAIN
          </p>
        </div>
        <div className="rounded-2xl border border-border/70 bg-card p-6 overflow-x-auto shadow-xs">
          <div className="flex items-center gap-2 min-w-max justify-center py-2">
            {pipelineSteps.map((step, i) => {
              const Icon = step.icon;
              const isActive = i === activeStep;
              const isPast = i < activeStep;
              return (
                <div key={step.label} className="flex items-center">
                  <div
                    className={`rounded-2xl p-3.5 text-center transition-all duration-300 min-w-[110px] border ${
                      isActive
                        ? "bg-indigo-50 dark:bg-indigo-950/60 border-indigo-300 dark:border-indigo-700 shadow-md ring-2 ring-indigo-200/50 dark:ring-indigo-800/50 scale-105"
                        : isPast
                        ? "bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-200/60 dark:border-emerald-800/30 text-emerald-800 dark:text-emerald-300"
                        : "bg-slate-50/60 dark:bg-slate-800/30 border-border/50 text-muted-foreground"
                    }`}
                  >
                    <div className={`size-8 rounded-xl mx-auto mb-2 flex items-center justify-center ${step.color} shadow-xs`}>
                      <Icon className="size-4" />
                    </div>
                    <div className="text-xs font-semibold tracking-tight">{step.label}</div>
                  </div>
                  {i < pipelineSteps.length - 1 && (
                    <div
                      className={`w-6 h-0.5 mx-1.5 rounded-full transition-colors ${
                        isPast ? "bg-emerald-400 dark:bg-emerald-600" : "bg-border/70"
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="text-center mb-8">
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-300 border border-purple-100 dark:border-purple-900/40">
            Core Capabilities
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mt-2 text-foreground">
            Platform Features
          </h2>
          <p className="text-muted-foreground text-xs sm:text-sm mt-1">
            A complete MLOps-driven predictive analytics solution designed for scale
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.06 * i }}
                viewport={{ once: true }}
                className="rounded-2xl border border-border/70 bg-card p-5 hover:border-indigo-200 dark:hover:border-indigo-800/50 hover:shadow-sm transition-all"
              >
                <div className={`size-9 rounded-xl flex items-center justify-center ${f.pastel} mb-3.5 shadow-xs`}>
                  <Icon className="size-4.5" />
                </div>
                <h3 className="font-semibold text-sm mb-1.5 text-foreground">{f.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{f.description}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="text-center mb-8">
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-300 border border-sky-100 dark:border-sky-900/40">
            Workflow Architecture
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mt-2 text-foreground">
            How It Works
          </h2>
          <p className="text-muted-foreground text-xs sm:text-sm mt-1">
            Our 11-step MLOps workflow for continuous, self-improving demand forecasting
          </p>
        </div>
        <div className="rounded-2xl border border-border/70 bg-card p-6 shadow-xs">
          <div className="space-y-2.5">
            {workflowSteps.map((step, i) => (
              <div
                key={i}
                className="flex items-center gap-3 text-xs sm:text-sm border-b border-border/50 pb-2.5 last:border-0"
              >
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 font-semibold text-[11px] shrink-0 border border-indigo-100 dark:border-indigo-900/40">
                  Step {i + 1}
                </span>
                <span className="text-foreground font-medium">{step}</span>
                <CheckCircle className="size-4 text-emerald-500 ml-auto shrink-0" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Problem & Solution */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-border/70 bg-card p-6 shadow-xs">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 text-xs font-semibold mb-3 border border-rose-100 dark:border-rose-900/40">
              <AlertTriangle className="size-3" /> Problem Statement
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Traditional demand forecasting approaches often struggle with changing market conditions,
              seasonal variations, demand fluctuations, and continuously evolving datasets. Manual processes
              cannot keep up with the velocity and volume of modern retail data, leading to stockouts,
              overstocking, and lost revenue.
            </p>
          </div>
          <div className="rounded-2xl border border-border/70 bg-card p-6 shadow-xs">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs font-semibold mb-3 border border-emerald-100 dark:border-emerald-900/40">
              <Sparkles className="size-3" /> Our Solution
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              An MLOps-driven predictive analytics framework that integrates machine learning forecasting
              with automated deployment, monitoring, model versioning, drift detection, and retraining.
              This end-to-end system ensures models remain accurate and relevant as data patterns evolve.
            </p>
          </div>
        </div>
      </section>

      {/* Objectives */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="rounded-2xl border border-border/70 bg-card p-6 shadow-xs">
          <h3 className="font-bold text-base sm:text-lg mb-4 text-foreground">Project Objectives</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {[
              "Improve demand forecasting accuracy",
              "Reduce inventory costs",
              "Reduce stockout risk",
              "Automate ML lifecycle management",
              "Detect model degradation",
              "Enable continuous model improvement",
              "Provide actionable business insights",
              "Deploy scalable MLOps infrastructure",
            ].map((obj) => (
              <div key={obj} className="flex items-center gap-2.5 text-xs sm:text-sm text-muted-foreground">
                <CheckCircle className="size-4 text-emerald-500 shrink-0" />
                <span className="text-foreground">{obj}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="rounded-3xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white p-8 sm:p-12 text-center shadow-lg shadow-indigo-500/10">
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-2 tracking-tight">Ready to Explore?</h2>
          <p className="text-white/90 text-xs sm:text-sm mb-6 max-w-lg mx-auto">
            Experience the full MLOps-driven demand forecasting platform with realistic demo data.
          </p>
          <button
            onClick={() => navigate("/auth")}
            className="px-6 py-2.5 text-xs sm:text-sm font-semibold rounded-xl bg-white text-indigo-600 hover:bg-slate-50 transition-all shadow-md flex items-center gap-2 mx-auto cursor-pointer"
          >
            <Zap className="size-4 fill-indigo-600" /> Launch Platform <ArrowRight className="size-4" />
          </button>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-8 pb-12">
        <div className="rounded-2xl border border-border/70 bg-card p-6 shadow-xs">
          <h3 className="font-bold text-base sm:text-lg mb-4 text-foreground">Technical Architecture</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
            {[
              "React", "TypeScript", "Tailwind CSS", "Recharts",
              "Python", "FastAPI", "PostgreSQL", "Pandas",
              "Scikit-learn", "XGBoost", "LightGBM", "TensorFlow",
              "MLflow", "Docker", "GitHub Actions", "Prometheus",
            ].map((tech) => (
              <div
                key={tech}
                className="rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-border/50 px-2.5 py-1.5 text-[11px] text-center font-mono text-muted-foreground"
              >
                {tech}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/60 bg-card/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <span>© 2025 MLOps Predictive Analytics Framework</span>
          <span className="flex items-center gap-1">
            Built with <span className="text-rose-500">❤️</span> for intelligent demand forecasting
          </span>
        </div>
      </footer>
    </div>
  );
}
