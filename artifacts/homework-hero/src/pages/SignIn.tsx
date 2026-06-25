import { SignIn } from "@clerk/react";

const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4 py-10">
      <div className="mb-6 text-center">
        <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-bold text-xl mx-auto mb-3 shadow-md">
          <img src={`${basePath}/logo.svg`} alt="StudyAI" className="w-8 h-8" />
        </div>
        <h1 className="text-xl font-bold text-slate-900">StudyAI</h1>
        <p className="text-sm text-slate-500 mt-0.5">Sign in to sync your progress across devices</p>
      </div>
      <SignIn
        routing="path"
        path={`${basePath}/sign-in`}
        signUpUrl={`${basePath}/sign-up`}
        fallbackRedirectUrl={basePath || "/"}
      />
    </div>
  );
}
