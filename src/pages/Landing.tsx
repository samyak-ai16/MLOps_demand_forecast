import { motion } from "framer-motion";
import { useNavigate } from "react-router";
import { useState, useEffect } from "react";
import {
  Zap, TrendingUp, Brain, Shield, Activity, ArrowRight,
  BarChart3, Database, Workflow, Target, Package, AlertTriangle,
  Sparkles, CheckCircle, ChevronRight, Building2, Network,
  Layers, Boxes, Eye
} from "lucide-react";
import { Hero3DCanvas } from "@/components/3d/Hero3DCanvas";
import { Warehouse3DScene } from "@/components/3d/Warehouse3DScene";
import { SupplyChain3DScene } from "@/components/3d/SupplyChain3DScene";

const pipelineSteps = [
  { label: "1. Data Ingestion", icon: Database, color: "bg-[#00adb5]/20 text-[#00adb5]" },
  { label: "2. Data Validation", icon: Shield, color: "bg-emerald-500/20 text-emerald-400" },
  { label: "3. Feature Eng.", icon: Workflow, color: "bg-indigo-500/20 text-indigo-400" },
  { label: "4. Multi-Model ML", icon: Brain, color: "bg-purple-500/20 text-purple-400" },
  { label: "5. Probabilistic Forecast", icon: TrendingUp, color: "bg-[#00adb5]/20 text-[#00adb5]" },
  { label: "6. Inventory Optimization", icon: Boxes, color: "bg-amber-500/20 text-amber-400" },
  { label: "7. Drift & Retraining", icon: Activity, color: "bg-rose-500/20 text-rose-400" },
];

const floatingCards = [
  { label: "Forecast Accuracy (WAPE)", value: "94.7%", icon: Target, bg: "bg-[#00adb5]/20 text-[#00adb5]" },
  { label: "Active ML Models", value: "4 Production", icon: Brain, bg: "bg-indigo-500/20 text-indigo-400" },
  { label: "Distribution Hubs", value: "4 Centers", icon: Building2, bg: "bg-emerald-500/20 text-emerald-400" },
  { label: "Horizon Coverage", value: "7 - 90 Days", icon: BarChart3, bg: "bg-amber-500/20 text-amber-400" },
  { label: "Live Drift Health", value: "Zero Drift", icon: Shield, bg: "bg-cyan-500/20 text-cyan-400" },
];

const features = [
  {
    title: "3D Warehouse Digital Twin",
    description: "Interactive 3D storage bays, rack utilization, and real-time inventory level indicators across facilities.",
    icon: Layers,
    color: "bg-[#00adb5]/20 text-[#00adb5]",
  },
  {
    title: "Multi-Model ML Forecasting",
    description: "Gradient Boosted Trees, Random Forest, Seasonal Naive, and Meta-Ensembles with chronological backtesting.",
    icon: Brain,
    color: "bg-purple-500/20 text-purple-400",
  },
  {
    title: "End-to-End MLOps Pipeline",
    description: "Automated 9-stage pipeline from ingestion to deployment with zero-downtime rollbacks and MLflow registry.",
    icon: Workflow,
    color: "bg-indigo-500/20 text-indigo-400",
  },
  {
    title: "Dynamic Inventory Optimization",
    description: "Real-time safety stock (SS), reorder point (ROP), and economic order quantity (EOQ) calculations.",
    icon: Boxes,
    color: "bg-emerald-500/20 text-emerald-400",
  },
  {
    title: "3D Supply Chain Topology",
    description: "Track material velocity from raw suppliers through central hubs to regional omnichannel distribution.",
    icon: Network,
    color: "bg-cyan-500/20 text-cyan-400",
  },
  {
    title: "Continuous Drift Monitoring",
    description: "Statistical KS-test drift monitoring on feature inputs and automated retraining triggers.",
    icon: Activity,
    color: "bg-amber-500/20 text-amber-400",
  },
];

export default function Landing() {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % pipelineSteps.length);
    }, 2200);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#222831] text-white selection:bg-[#00adb5] selection:text-[#222831]">
      {/* Navbar */}
      <nav className="border-b border-[#393e46] bg-[#222831]/85 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-xl flex items-center justify-center bg-[#00adb5] text-[#222831] font-black shadow-md shadow-[#00adb5]/20">
              <Zap className="size-5 fill-[#222831]" />
            </div>
            <div>
              <span className="font-extrabold text-base tracking-tight text-white">DemandFlow AI</span>
              <span className="hidden sm:inline-block text-[10px] text-gray-400 ml-2 border-l border-[#393e46] pl-2">
                3D MLOps Platform
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/dashboard")}
              className="px-4 py-2 text-xs font-semibold rounded-xl text-gray-300 hover:text-white hover:bg-[#393e46] transition-all"
            >
              Live Demo
            </button>
            <button
              onClick={() => navigate("/dashboard")}
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-[#00adb5] hover:bg-[#00adb5]/90 text-[#222831] font-bold shadow-md shadow-[#00adb5]/25 transition-all"
            >
              Launch Dashboard
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section with Interactive 3D Canvas */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center rounded-3xl border border-[#393e46] bg-gradient-to-br from-[#222831] via-[#222831]/95 to-[#1b2027] p-6 sm:p-10 shadow-2xl overflow-hidden relative">
          {/* Subtle Ambient Glows */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#00adb5]/10 rounded-full blur-3xl pointer-events-none" />

          {/* Left Column: Title & Proposition */}
          <div className="lg:col-span-6 relative z-10 space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full px-3.5 py-1 text-xs font-semibold bg-[#00adb5]/10 text-[#00adb5] border border-[#00adb5]/30">
              <Sparkles className="size-3" />
              BTech Capstone & Enterprise Portfolio
            </div>

            <div className="space-y-3">
              <span className="text-xs uppercase tracking-widest text-gray-400 font-bold">
                Project Title
              </span>
              <h1 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight text-white">
                Design & Development of an{" "}
                <span className="text-[#00adb5] underline decoration-[#00adb5]/40 underline-offset-8">
                  MLOps-Driven
                </span>{" "}
                Predictive Analytics Framework for Demand Forecasting
              </h1>
            </div>

            <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">
              Transforming historical enterprise sales into high-accuracy multi-echelon demand forecasts.
              Features 3D warehouse digital twins, MLflow experiment tracking, automated retraining pipelines,
              and intelligent safety-stock replenishment.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => navigate("/dashboard")}
                className="px-5 py-2.5 text-xs sm:text-sm font-bold rounded-xl bg-[#00adb5] text-[#222831] hover:bg-[#00adb5]/90 transition-all flex items-center gap-2 shadow-lg shadow-[#00adb5]/25"
              >
                <BarChart3 className="size-4" /> Open Executive Dashboard <ArrowRight className="size-4" />
              </button>
              <button
                onClick={() => navigate("/dashboard/warehouses")}
                className="px-5 py-2.5 text-xs sm:text-sm font-semibold rounded-xl bg-[#393e46] hover:bg-[#393e46]/80 text-white transition-all flex items-center gap-2"
              >
                <Layers className="size-4 text-[#00adb5]" /> 3D Warehouse Twin
              </button>
            </div>
          </div>

          {/* Right Column: 3D Interactive Hero Canvas */}
          <div className="lg:col-span-6 h-[380px] sm:h-[460px] rounded-2xl overflow-hidden border border-[#393e46] bg-[#181e26] relative shadow-inner">
            <Hero3DCanvas />
            <div className="absolute bottom-3 right-3 bg-[#222831]/90 backdrop-blur-md border border-[#393e46] px-3 py-1.5 rounded-xl text-[10px] text-gray-400">
              Interactive 3D Engine • Real-time Three.js
            </div>
          </div>
        </div>

        {/* Floating KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 mt-6">
          {floatingCards.map((card, i) => {
            const Icon = card.icon;
            return (
              <div
                key={card.label}
                className="rounded-2xl border border-[#393e46] bg-[#222831] p-4 shadow-md hover:border-[#00adb5]/50 transition-all"
              >
                <div className={`size-8 rounded-xl flex items-center justify-center ${card.bg} mb-3`}>
                  <Icon className="size-4" />
                </div>
                <div className="text-xl font-bold tracking-tight text-white">{card.value}</div>
                <div className="text-xs text-gray-400 mt-0.5 font-medium">{card.label}</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3D Facility Preview Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-6">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-[#00adb5]">
            Spatial Intelligence
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
            Interactive 3D Digital Twin & Supply Chain
          </h2>
          <p className="text-gray-400 text-xs sm:text-sm mt-1">
            Experience spatial rack allocation and live multi-echelon network flows in 3D.
          </p>
        </div>

        <Warehouse3DScene warehouseName="Nagpur Central Logistics Hub (Interactive)" />
      </section>

      {/* MLOps Pipeline Flow */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="text-center mb-8">
          <span className="text-xs font-bold uppercase tracking-widest text-[#00adb5]">
            Continuous Machine Learning
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
            9-Stage Automated MLOps Pipeline
          </h2>
          <p className="text-gray-400 text-xs sm:text-sm mt-1">
            Data Ingestion → Feature Engineering → Training → MLflow Registry → Canary Deploy → Drift Monitor
          </p>
        </div>

        <div className="rounded-2xl border border-[#393e46] bg-[#222831] p-6 overflow-x-auto shadow-md">
          <div className="flex items-center gap-2 min-w-max justify-center py-2">
            {pipelineSteps.map((step, i) => {
              const Icon = step.icon;
              const isActive = i === activeStep;
              return (
                <div key={step.label} className="flex items-center">
                  <div
                    className={`rounded-2xl p-3.5 text-center transition-all duration-300 min-w-[130px] border ${
                      isActive
                        ? "bg-[#00adb5]/20 border-[#00adb5] text-white shadow-lg shadow-[#00adb5]/20 scale-105"
                        : "bg-[#181e26] border-[#393e46] text-gray-400"
                    }`}
                  >
                    <div className={`size-8 rounded-xl mx-auto mb-2 flex items-center justify-center ${step.color}`}>
                      <Icon className="size-4" />
                    </div>
                    <div className="text-xs font-bold tracking-tight">{step.label}</div>
                  </div>
                  {i < pipelineSteps.length - 1 && (
                    <div className="w-5 h-0.5 mx-1.5 bg-[#393e46]" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Core Platform Capabilities Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="text-center mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-[#00adb5]">
            Architecture & Features
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
            Built for Enterprise Supply Chain Scale
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.title}
                className="rounded-2xl border border-[#393e46] bg-[#222831] p-5 hover:border-[#00adb5]/60 transition-all space-y-3"
              >
                <div className={`size-10 rounded-xl flex items-center justify-center ${feat.color}`}>
                  <Icon className="size-5" />
                </div>
                <h3 className="text-base font-bold text-white">{feat.title}</h3>
                <p className="text-xs text-gray-400 leading-relaxed">{feat.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#393e46] bg-[#181e26] py-10 mt-12 text-xs text-gray-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Zap className="size-4 text-[#00adb5]" />
            <span className="font-bold text-white">DemandFlow AI</span>
            <span>• BTech Final-Year Capstone Project</span>
          </div>
          <div>Demonstration Company: ABC Retail Distribution (Nagpur, Pune, Mumbai, Nashik)</div>
        </div>
      </footer>
    </div>
  );
}
