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
  { label: "Raw Data", icon: Database, color: "#2563EB" },
  { label: "Processing", icon: Workflow, color: "#4F46E5" },
  { label: "Feature Eng.", icon: Settings2, color: "#06B6D4" },
  { label: "ML Models", icon: Brain, color: "#8B5CF6" },
  { label: "Forecast", icon: TrendingUp, color: "#22C55E" },
  { label: "Monitor", icon: Activity, color: "#F59E0B" },
  { label: "Retrain", icon: Zap, color: "#EF4444" },
];

function Settings2(props: { className?: string }) {
  return <Brain {...props} />;
}

const floatingCards = [
  { label: "Forecast Accuracy", value: "94.7%", icon: Target, color: "bg-blue-100 border-blue-600" },
  { label: "Active Models", value: "5", icon: Brain, color: "bg-indigo-100 border-indigo-600" },
  { label: "Products Tracked", value: "1,250", icon: Package, color: "bg-green-100 border-green-600" },
  { label: "Forecast Horizon", value: "30 Days", icon: BarChart3, color: "bg-amber-100 border-amber-600" },
  { label: "Model Health", value: "Healthy", icon: Shield, color: "bg-cyan-100 border-cyan-600" },
];

const features = [
  {
    title: "ML-Powered Forecasting",
    description: "8 state-of-the-art ML models including XGBoost, LSTM, Prophet, and more for accurate demand prediction.",
    icon: Brain,
  },
  {
    title: "MLOps Pipeline",
    description: "End-to-end automated pipeline from data collection through deployment, monitoring, and retraining.",
    icon: Workflow,
  },
  {
    title: "Real-Time Monitoring",
    description: "Track model performance, data drift, system metrics, and anomalies in real-time.",
    icon: Activity,
  },
  {
    title: "Anomaly Detection",
    description: "Automated detection of demand spikes, drops, inventory issues, and data quality problems.",
    icon: AlertTriangle,
  },
  {
    title: "Explainable AI",
    description: "Understand why models make predictions with feature importance and natural language explanations.",
    icon: Sparkles,
  },
  {
    title: "Automated Retraining",
    description: "Continuous model improvement through automated retraining triggered by drift or performance degradation.",
    icon: Zap,
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
    <div className="min-h-screen bg-background text-foreground">
      {/* Navbar */}
      <nav className="border-b-2 border-border bg-card sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 border-2 border-border bg-primary text-primary-foreground">
              <Zap className="size-4" />
            </div>
            <span className="font-bold text-sm">MLOps Forecast</span>
          </div>
          <div className="flex gap-2">
            <button onClick={() => navigate("/auth")} className="nb-btn bg-card px-4 py-1.5 text-sm">
              Sign In
            </button>
            <button onClick={() => navigate("/auth")} className="nb-btn bg-primary text-primary-foreground px-4 py-1.5 text-sm">
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 py-16 md:py-24">
        <div className="nb-card-static bg-primary text-primary-foreground p-8 md:p-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="nb-badge bg-primary-foreground/20 text-primary-foreground mb-4">
              MLOps-Driven Predictive Analytics Framework
            </div>
            <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-4">
              Intelligent Product Demand Forecasting Powered by MLOps
            </h1>
            <p className="text-primary-foreground/80 text-base md:text-lg max-w-3xl mb-8 leading-relaxed">
              An end-to-end predictive analytics framework that transforms historical sales data into accurate
              demand forecasts using machine learning, automated model deployment, monitoring, and continuous retraining.
            </p>
            <div className="flex flex-wrap gap-3">
              <button onClick={() => navigate("/auth")} className="nb-btn bg-card text-foreground px-6 py-2.5 text-sm font-bold flex items-center gap-2">
                <BarChart3 className="size-4" /> Explore Dashboard <ArrowRight className="size-4" />
              </button>
              <button onClick={() => navigate("/auth")} className="nb-btn bg-primary-foreground/20 text-primary-foreground px-6 py-2.5 text-sm flex items-center gap-2">
                <TrendingUp className="size-4" /> View Forecasts
              </button>
              <button onClick={() => document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" })} className="nb-btn bg-primary-foreground/20 text-primary-foreground px-6 py-2.5 text-sm flex items-center gap-2">
                <Workflow className="size-4" /> How It Works
              </button>
            </div>
          </motion.div>
        </div>

        {/* Floating KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-8">
          {floatingCards.map((card, i) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 * i }}
                className={`nb-card-static bg-card p-3 ${card.color.split(" ")[1]}`}
              >
                <div className={`p-1.5 border-2 border-border ${card.color.split(" ")[0]} inline-block mb-2`}>
                  <Icon className="size-3.5" />
                </div>
                <div className="text-xl font-bold">{card.value}</div>
                <div className="text-[10px] text-muted-foreground">{card.label}</div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Animated Pipeline */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-2 text-center">End-to-End MLOps Pipeline</h2>
        <p className="text-muted-foreground text-center text-sm mb-8">DATA → ML → FORECAST → DEPLOY → MONITOR → DRIFT → RETRAIN</p>
        <div className="nb-card-static bg-card p-6 overflow-x-auto">
          <div className="flex items-center gap-2 min-w-max justify-center">
            {pipelineSteps.map((step, i) => {
              const Icon = step.icon;
              const isActive = i === activeStep;
              const isPast = i < activeStep;
              return (
                <div key={step.label} className="flex items-center">
                  <div
                    className={`nb-card-static p-3 text-center transition-all duration-300 min-w-[100px] ${
                      isActive ? "bg-primary text-primary-foreground ring-4 ring-primary/30 scale-110" :
                      isPast ? "bg-green-100 text-green-800" : "bg-muted"
                    }`}
                  >
                    <Icon className="size-5 mx-auto mb-1" />
                    <div className="text-[10px] font-bold">{step.label}</div>
                  </div>
                  {i < pipelineSteps.length - 1 && (
                    <div className={`w-6 h-0.5 mx-1 ${isPast ? "bg-green-500" : "bg-border"}`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-2 text-center">Platform Features</h2>
        <p className="text-muted-foreground text-center text-sm mb-8">A complete MLOps-driven predictive analytics solution</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 * i }}
                viewport={{ once: true }}
                className="nb-card-static bg-card p-5"
              >
                <div className="p-2 border-2 border-border bg-primary/10 inline-block mb-3">
                  <Icon className="size-5 text-primary" />
                </div>
                <h3 className="font-bold text-sm mb-1">{f.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{f.description}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-2 text-center">How It Works</h2>
        <p className="text-muted-foreground text-center text-sm mb-8">Our 11-step MLOps workflow for intelligent demand forecasting</p>
        <div className="nb-card-static bg-card p-6">
          <div className="space-y-2">
            {workflowSteps.map((step, i) => (
              <div key={i} className="flex items-center gap-3 text-sm border-b border-border pb-2 last:border-0">
                <span className="nb-badge bg-primary text-primary-foreground text-[10px] px-2 py-0.5 shrink-0">
                  Step {i + 1}
                </span>
                <span>{step}</span>
                <CheckCircle className="size-3.5 text-green-600 ml-auto shrink-0" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About / Problem Statement */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="nb-card-static bg-card p-6">
            <h3 className="font-bold text-lg mb-3">Problem Statement</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Traditional demand forecasting approaches often struggle with changing market conditions,
              seasonal variations, demand fluctuations, and continuously evolving datasets. Manual processes
              cannot keep up with the velocity and volume of modern retail data, leading to stockouts,
              overstocking, and lost revenue.
            </p>
          </div>
          <div className="nb-card-static bg-card p-6">
            <h3 className="font-bold text-lg mb-3">Our Solution</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              An MLOps-driven predictive analytics framework that integrates machine learning forecasting
              with automated deployment, monitoring, model versioning, drift detection, and retraining.
              This end-to-end system ensures models remain accurate and relevant as data patterns evolve.
            </p>
          </div>
        </div>
      </section>

      {/* Objectives */}
      <section className="max-w-6xl mx-auto px-4 py-8">
        <div className="nb-card-static bg-card p-6">
          <h3 className="font-bold text-lg mb-4">Project Objectives</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
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
              <div key={obj} className="flex items-center gap-2 text-sm">
                <CheckCircle className="size-4 text-green-600 shrink-0" />
                <span>{obj}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="nb-card-static bg-primary text-primary-foreground p-8 text-center">
          <h2 className="text-2xl font-bold mb-3">Ready to Explore?</h2>
          <p className="text-primary-foreground/80 text-sm mb-6 max-w-lg mx-auto">
            Experience the full MLOps-driven demand forecasting platform with realistic demo data.
          </p>
          <button onClick={() => navigate("/auth")} className="nb-btn bg-card text-foreground px-8 py-3 text-sm font-bold flex items-center gap-2 mx-auto">
            <Zap className="size-4" /> Launch Platform <ArrowRight className="size-4" />
          </button>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="max-w-6xl mx-auto px-4 py-8 pb-12">
        <div className="nb-card-static bg-card p-6">
          <h3 className="font-bold text-lg mb-4">Technical Architecture</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
            {[
              "React", "TypeScript", "Tailwind CSS", "Recharts",
              "Python", "FastAPI", "PostgreSQL", "Pandas",
              "Scikit-learn", "XGBoost", "LightGBM", "TensorFlow",
              "MLflow", "Docker", "GitHub Actions", "Prometheus",
            ].map((tech) => (
              <div key={tech} className="nb-badge bg-muted px-3 py-2 text-xs text-center font-mono">
                {tech}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t-2 border-border bg-card">
        <div className="max-w-6xl mx-auto px-4 py-6 flex items-center justify-between text-xs text-muted-foreground">
          <span>© 2025 MLOps Predictive Analytics Framework</span>
          <span>Built with ❤️ for intelligent demand forecasting</span>
        </div>
      </footer>
    </div>
  );
}
