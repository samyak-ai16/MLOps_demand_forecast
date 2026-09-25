import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useAuth } from "@/hooks/use-auth";
import { ArrowRight, Loader2, Mail, UserX, Zap, Sparkles } from "lucide-react";
import { Suspense, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";

interface AuthProps {
  redirectAfterAuth?: string;
}

function resolveRedirectAfterAuth(returnTo: string | null, fallback = "/dashboard") {
  if (returnTo?.startsWith("/") && !returnTo.startsWith("//")) return returnTo;
  return fallback;
}

function Auth({ redirectAfterAuth }: AuthProps = {}) {
  const { isLoading: authLoading, isAuthenticated, signIn } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = resolveRedirectAfterAuth(searchParams.get("returnTo"), redirectAfterAuth);
  const [step, setStep] = useState<"signIn" | { email: string }>("signIn");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && isAuthenticated) navigate(redirect);
  }, [authLoading, isAuthenticated, navigate, redirect]);

  const handleEmailSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const email = (new FormData(event.currentTarget).get("email") as string).trim();
      await signIn("email-otp", { email });
      setStep({ email });
      setIsLoading(false);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to send verification code.");
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      if (typeof step === "string") return;
      
      // Submit email and OTP code to convex auth
      await signIn("email-otp", { 
        email: step.email, 
        code: otp,
        token: otp 
      });
      
      navigate(redirect);
    } catch (err) {
      console.error("Verification failed:", err);
      setError("The verification code is incorrect or has expired.");
      setIsLoading(false);
      setOtp("");
    }
  };

  const handleGuestLogin = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await signIn("anonymous");
      navigate(redirect);
    } catch (error) {
      setError(`Failed: ${error instanceof Error ? error.message : "Unknown error"}`);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-indigo-100 selection:text-indigo-900">
      {/* Top bar */}
      <div className="border-b border-border/60 bg-card/75 backdrop-blur-md sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <button onClick={() => navigate("/")} className="flex items-center gap-2.5 cursor-pointer">
            <div className="size-8 rounded-xl flex items-center justify-center bg-gradient-to-tr from-indigo-100 via-purple-100 to-pink-100 dark:from-indigo-950 dark:via-purple-950 dark:to-pink-950 border border-indigo-200/60 dark:border-indigo-800/40 text-indigo-600 dark:text-indigo-400 shadow-2xs">
              <Zap className="size-4 fill-indigo-500/20 text-indigo-600 dark:text-indigo-400" />
            </div>
            <span className="font-bold text-sm tracking-tight text-foreground">MLOps Forecast</span>
          </button>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-[420px]">
          <div className="rounded-3xl border border-border/80 bg-card shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {step === "signIn" ? (
              <>
                <div className="p-8 text-center bg-gradient-to-br from-indigo-50/80 via-purple-50/40 to-pink-50/30 dark:from-slate-900/90 dark:via-indigo-950/30 dark:to-slate-900 border-b border-border/60">
                  <div className="flex justify-center mb-3.5">
                    <div className="size-12 rounded-2xl flex items-center justify-center bg-white/90 dark:bg-slate-800/90 text-indigo-600 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800/40 shadow-xs">
                      <Zap className="size-6 fill-indigo-500/20" />
                    </div>
                  </div>
                  <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">Welcome Back</h1>
                  <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-1">Sign in to your MLOps demand platform</p>
                </div>
                <form onSubmit={handleEmailSubmit} className="p-6 sm:p-7 space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-foreground mb-1.5 block">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/70" />
                      <Input
                        name="email"
                        placeholder="name@example.com"
                        type="email"
                        className="pl-9 rounded-xl bg-slate-50/60 dark:bg-slate-800/30 border-border/70 focus:border-indigo-300 dark:focus:border-indigo-700"
                        disabled={isLoading}
                        required
                      />
                    </div>
                  </div>
                  {error && <p className="text-xs text-rose-500 font-medium">{error}</p>}
                  <Button
                    type="submit"
                    className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-sm hover:shadow-indigo-500/25 transition-all py-2 cursor-pointer"
                    disabled={isLoading}
                  >
                    {isLoading ? <Loader2 className="mr-2 size-4 animate-spin" /> : <ArrowRight className="mr-2 size-4" />}
                    Send Verification Code
                  </Button>
                  <div className="relative my-2">
                    <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border/60" /></div>
                    <div className="relative flex justify-center text-[10px] uppercase">
                      <span className="bg-card px-2 text-muted-foreground font-semibold">Or continue with</span>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full rounded-xl border border-border/80 hover:bg-slate-50 dark:hover:bg-slate-800/40 text-foreground transition-all py-2 cursor-pointer"
                    onClick={handleGuestLogin}
                    disabled={isLoading}
                  >
                    <UserX className="mr-2 size-4 text-indigo-500" /> Demo Guest Access
                  </Button>
                </form>
              </>
            ) : (
              <>
                <div className="p-8 text-center bg-gradient-to-br from-indigo-50/80 via-purple-50/40 to-pink-50/30 dark:from-slate-900/90 dark:via-indigo-950/30 dark:to-slate-900 border-b border-border/60">
                  <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">Check Your Email</h1>
                  <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-1">We sent a 6-digit code to {step.email}</p>
                </div>
                <form onSubmit={handleOtpSubmit} className="p-6 sm:p-7 space-y-4">
                  <div className="flex justify-center py-2">
                    <InputOTP value={otp} onChange={setOtp} maxLength={6} disabled={isLoading}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && otp.length === 6 && !isLoading) {
                          (e.target as HTMLElement).closest("form")?.requestSubmit();
                        }
                      }}>
                      <InputOTPGroup>
                        {Array.from({ length: 6 }).map((_, index) => (
                          <InputOTPSlot key={index} index={index} className="rounded-xl border-border/70" />
                        ))}
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                  {error && <p className="text-xs text-rose-500 font-medium text-center">{error}</p>}
                  <Button
                    type="submit"
                    className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-sm hover:shadow-indigo-500/25 transition-all py-2 cursor-pointer"
                    disabled={isLoading || otp.length !== 6}
                  >
                    {isLoading ? <Loader2 className="mr-2 size-4 animate-spin" /> : <ArrowRight className="mr-2 size-4" />}
                    Verify & Sign In
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setStep("signIn")}
                    disabled={isLoading}
                    className="w-full rounded-xl text-xs text-muted-foreground hover:text-foreground"
                  >
                    Use different email
                  </Button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AuthPage(props: AuthProps) {
  return (
    <Suspense>
      <Auth {...props} />
    </Suspense>
  );
}