import { RegisterForm2 as RegisterForm } from "@/components/auth/register-form"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Register - Body Fat Tracker",
  description: "Create a new account",
}

export default function RegisterPage() {
  return (
    <div className="h-screen w-full flex overflow-hidden bg-[#020617]">
      {/* Left Panel: Branding & Visuals (Hidden on mobile) */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden items-center justify-center">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(139,92,246,0.15),rgba(2,6,23,0)_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,rgba(236,72,153,0.1),rgba(2,6,23,0)_60%)]" />
        <div className="absolute top-0 left-0 w-full h-full bg-[url('/grid-pattern.svg')] opacity-[0.04]" />

        {/* Content Container */}
        <div className="relative z-10 max-w-lg px-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="mb-8 inline-block p-3 rounded-2xl bg-slate-900/40 backdrop-blur-md border border-indigo-500/20 shadow-xl shadow-indigo-500/5">
            {/* Simple Logo Placeholder or Icon */}
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-violet-500 to-pink-500" />
          </div>

          <h1 className="text-5xl font-bold tracking-tight text-white mb-6 leading-tight">
            Start your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-pink-400">
              Transformation
            </span>
          </h1>

          <p className="text-lg text-slate-400 mb-10 leading-relaxed">
            Create an account to start tracking your body composition journey.
            Set goals, monitor progress, and achieve your best self.
          </p>

          <div className="grid grid-cols-2 gap-6">
            <div className="p-4 rounded-xl bg-slate-900/40 border border-indigo-500/10 backdrop-blur-sm">
              <div className="text-violet-400 font-semibold mb-1">Free Account</div>
              <div className="text-sm text-slate-500">Get started instantly</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/40 border border-indigo-500/10 backdrop-blur-sm">
              <div className="text-pink-400 font-semibold mb-1">Secure & Private</div>
              <div className="text-sm text-slate-500">Your data is yours alone</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel: Register Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative overflow-y-auto">
        {/* Subtle background glow for form side */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(139,92,246,0.05),transparent_70%)] pointer-events-none" />

        <div className="w-full max-w-sm space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200 relative z-10 my-auto">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white">Create an account</h2>
            <p className="mt-2 text-sm text-slate-400">
              Enter your details to get started
            </p>
          </div>

          <div className="bg-slate-950/50 p-6 rounded-3xl border border-white/10 backdrop-blur-md shadow-2xl">
            <RegisterForm />
          </div>

          <p className="text-center text-xs text-slate-500">
            By creating an account, you agree to our{" "}
            <a href="#" className="underline underline-offset-4 hover:text-violet-400 transition-colors">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="underline underline-offset-4 hover:text-violet-400 transition-colors">
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  )
}
