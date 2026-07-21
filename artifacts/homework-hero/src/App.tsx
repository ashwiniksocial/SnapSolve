import { lazy, Suspense } from "react";
import { ClerkProvider, Show } from "@clerk/react";
import { publishableKeyFromHost } from "@clerk/react/internal";
import { shadcn } from "@clerk/themes";
import { Switch, Route, Router as WouterRouter, Link, useLocation } from "wouter";
import Home from "@/pages/Home";
import { RouteErrorBoundary } from "@/components/RouteErrorBoundary";

// Lazy-loaded routes — each becomes its own JS chunk loaded on first visit.
// Pages that use the question bank (Practice, Revision, Analytics, Solution)
// will only pull in the ~7 MB question-bank chunk when the student first
// navigates to one of those routes, not at app startup.
const Scan                 = lazy(() => import("@/pages/Scan"));
const Solution             = lazy(() => import("@/pages/Solution"));
const Practice             = lazy(() => import("@/pages/Practice"));
const Progress             = lazy(() => import("@/pages/Progress"));
const QuestionWorkspace    = lazy(() => import("@/pages/Challenge"));
const History              = lazy(() => import("@/pages/History"));
const Journal              = lazy(() => import("@/pages/Journal"));
const Revision             = lazy(() => import("@/pages/Revision"));
const Improvement          = lazy(() => import("@/pages/Improvement"));
const Admin                = lazy(() => import("@/pages/Admin"));
const TeacherDashboard     = lazy(() => import("@/pages/TeacherDashboard"));
const ExamMode             = lazy(() => import("@/pages/ExamMode"));
const SignInPage            = lazy(() => import("@/pages/SignIn"));
const SignUpPage            = lazy(() => import("@/pages/SignUp"));
const OnboardingPage        = lazy(() => import("@/pages/Onboarding"));
const ProfilePage           = lazy(() => import("@/pages/Profile"));
const DevTeachingValidator  = lazy(() => import("@/pages/DevTeachingValidator"));
const Analytics             = lazy(() => import("@/pages/Analytics"));

function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-8 h-8 rounded-full border-2 border-slate-200 border-t-indigo-600 animate-spin" />
    </div>
  );
}

// ─── Clerk wiring (copy verbatim — same code runs in dev and prod) ────────────

const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

// REQUIRED — resolves the key from the hostname so one build serves multiple
// Clerk custom domains. Do NOT inline the env var or leave publishableKey undefined.
const clerkPubKey = publishableKeyFromHost(
  window.location.hostname,
  import.meta.env.VITE_CLERK_PUBLISHABLE_KEY,
);

// REQUIRED — empty in dev (Clerk hits FAPI directly), auto-set in prod.
// Do NOT gate on import.meta.env.PROD — the empty dev value is intentional.
const clerkProxyUrl = import.meta.env.VITE_CLERK_PROXY_URL;

function stripBase(path: string): string {
  return basePath && path.startsWith(basePath)
    ? path.slice(basePath.length) || "/"
    : path;
}

if (!clerkPubKey) {
  throw new Error("Missing VITE_CLERK_PUBLISHABLE_KEY — check environment secrets.");
}

// ─── Clerk appearance (matches app's indigo + slate design system) ────────────

const clerkAppearance = {
  theme:       shadcn,
  cssLayerName: "clerk",
  options: {
    logoPlacement:        "inside" as const,
    logoLinkUrl:          basePath || "/",
    logoImageUrl:         `${window.location.origin}${basePath}/logo.svg`,
    socialButtonsVariant: "blockButton" as const,
    socialButtonsPlacement: "top" as const,
  },
  variables: {
    colorPrimary:         "#4f46e5",
    colorForeground:      "#0f172a",
    colorMutedForeground: "#64748b",
    colorDanger:          "#ef4444",
    colorBackground:      "#ffffff",
    colorInput:           "#f8fafc",
    colorInputForeground: "#0f172a",
    colorNeutral:         "#94a3b8",
    fontFamily:           "'Inter', 'SF Pro Display', system-ui, -apple-system, sans-serif",
    borderRadius:         "0.75rem",
  },
  elements: {
    rootBox:                     "w-full flex justify-center",
    cardBox:                     "bg-white rounded-2xl w-[440px] max-w-full overflow-hidden shadow-sm border border-slate-200",
    card:                        "!shadow-none !border-0 !bg-transparent !rounded-none",
    footer:                      "!shadow-none !border-0 !bg-transparent !rounded-none",
    headerTitle:                 "text-slate-900 font-bold text-xl",
    headerSubtitle:              "text-slate-500 text-sm",
    socialButtonsBlockButtonText:"text-slate-700 font-medium text-sm",
    formFieldLabel:              "text-slate-700 font-semibold text-xs",
    footerActionLink:            "text-indigo-600 font-semibold",
    footerActionText:            "text-slate-500",
    dividerText:                 "text-slate-400 text-xs",
    identityPreviewEditButton:   "text-indigo-600",
    formFieldSuccessText:        "text-emerald-600 text-xs",
    alertText:                   "text-slate-700 text-sm",
    logoBox:                     "mt-1 mb-1",
    logoImage:                   "h-8 w-8 rounded-lg",
    socialButtonsBlockButton:    "border border-slate-200 rounded-xl",
    formButtonPrimary:           "bg-indigo-600 hover:bg-indigo-700 rounded-xl font-semibold",
    formFieldInput:              "border border-slate-200 bg-slate-50 rounded-xl",
    footerAction:                "bg-slate-50 border-t border-slate-100",
    dividerLine:                 "bg-slate-200",
    alert:                       "border border-red-100 bg-red-50 rounded-xl",
    otpCodeFieldInput:           "border border-slate-200 rounded-xl",
    formFieldRow:                "gap-2",
    main:                        "gap-4",
  },
};

// ─── Bottom navigation ────────────────────────────────────────────────────────

const NAV = [
  { to: "/",         icon: "⊞",  label: "Home"     },
  { to: "/scan",     icon: "⊕",  label: "Scan"     },
  { to: "/revision", icon: "↺",  label: "Revision" },
  { to: "/practice", icon: "✎",  label: "Practice" },
  { to: "/progress", icon: "◈",  label: "Progress" },
  { to: "/exam",     icon: "🎯", label: "Exam"     },
  { to: "/journal",  icon: "✗",  label: "Journal"  },
];

function BottomNav() {
  const [location] = useLocation();
  const active = (path: string) =>
    path === "/" ? location === "/" : location.startsWith(path);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200 shadow-sm">
      <div className="max-w-lg mx-auto flex justify-around py-1">
        {NAV.map(({ to, icon, label }) => (
          <Link key={to} href={to}>
            <button
              className={`flex flex-col items-center gap-0.5 px-1.5 py-1 rounded-xl text-[9px] font-semibold transition-all
                ${active(to)
                  ? "text-indigo-600"
                  : "text-slate-400 hover:text-slate-600"}`}
            >
              <span className={`text-base leading-none mb-0.5 ${active(to) ? "scale-110" : ""} transition-transform`}>
                {icon}
              </span>
              {label}
            </button>
          </Link>
        ))}
      </div>
    </nav>
  );
}

// ─── Router ───────────────────────────────────────────────────────────────────

const AUTH_PATHS = ["/sign-in", "/sign-up", "/onboarding", "/dev"];

function Router() {
  const [location] = useLocation();
  const hideNav = AUTH_PATHS.some(p => location.startsWith(p));

  return (
    <>
      <div className={hideNav ? "min-h-screen" : "pb-20 min-h-screen"}>
        <RouteErrorBoundary key={location}>
          <Suspense fallback={<PageLoader />}>
            <Switch>
              {/* Auth routes — MUST use /*? wildcard for Clerk's OAuth sub-paths */}
              <Route path="/sign-in/*?" component={SignInPage} />
              <Route path="/sign-up/*?" component={SignUpPage} />
              <Route path="/onboarding"  component={OnboardingPage} />

              {/* App routes */}
              <Route path="/"            component={Home} />
              <Route path="/scan"        component={Scan} />
              <Route path="/solution"    component={Solution} />
              <Route path="/challenge"   component={QuestionWorkspace} />
              <Route path="/practice"    component={Practice} />
              <Route path="/progress"    component={Progress} />
              <Route path="/history"     component={History} />
              <Route path="/journal"     component={Journal} />
              <Route path="/revision"    component={Revision} />
              <Route path="/improvement" component={Improvement} />
              <Route path="/profile"     component={ProfilePage} />
              <Route path="/admin"       component={Admin} />
              <Route path="/teacher"     component={TeacherDashboard} />
              <Route path="/exam"        component={ExamMode} />
              <Route path="/analytics"   component={Analytics} />
              <Route path="/dev/validate" component={DevTeachingValidator} />
            </Switch>
          </Suspense>
        </RouteErrorBoundary>
      </div>
      {!hideNav && <BottomNav />}
    </>
  );
}

// ─── Clerk provider ───────────────────────────────────────────────────────────

function ClerkProviderWithRoutes() {
  const [, setLocation] = useLocation();

  return (
    <ClerkProvider
      publishableKey={clerkPubKey}
      proxyUrl={clerkProxyUrl}
      appearance={clerkAppearance}
      signInUrl={`${basePath}/sign-in`}
      signUpUrl={`${basePath}/sign-up`}
      localization={{
        signIn: {
          start: {
            title:    "Welcome back to StudyAI",
            subtitle: "Sign in to sync your progress across devices",
          },
        },
        signUp: {
          start: {
            title:    "Join StudyAI",
            subtitle: "Create an account to save your progress",
          },
        },
      }}
      routerPush={(to) => setLocation(stripBase(to))}
      routerReplace={(to) => setLocation(stripBase(to), { replace: true })}
    >
      <Router />
    </ClerkProvider>
  );
}

// ─── App root ─────────────────────────────────────────────────────────────────

export default function App() {
  return (
    <WouterRouter base={basePath}>
      <ClerkProviderWithRoutes />
    </WouterRouter>
  );
}
