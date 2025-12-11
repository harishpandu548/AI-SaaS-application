"use client";

import { useSession } from "next-auth/react";
import { signIn, signOut } from "next-auth/react";
import Link from "next/link";

export default function Home() {
  const { data: session, status } = useSession();
  if (status === "loading") {
    return <p>Loading your Session..</p>;
  }
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-slate-50">
      <header className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
        <Link href="/" className="text-2xl font-extrabold tracking-tight">
          SaaS AI
        </Link>

        <nav className="flex items-center gap-4">
          <Link
            href="/pricing"
            className="text-sm px-3 py-2 rounded-md hover:bg-slate-100 transition"
          >
            Pricing
          </Link>
          <Link
            href="/dashboard"
            className="text-sm px-3 py-2 rounded-md hover:bg-slate-100 transition"
          >
            Dashboard
          </Link>
          {session ? (
            <button
              onClick={() => signOut()}
              className="text-sm px-3 py-2 rounded-md bg-red-50 text-red-600 hover:bg-red-100 transition"
            >
              Logout
            </button>
          ) : (
            <button
              onClick={() => signIn("google")}
              className="text-sm px-3 py-2 rounded-md bg-sky-50 text-sky-700 hover:bg-sky-100 transition"
            >
              Login
            </button>
          )}
        </nav>
      </header>

      <section className="max-w-6xl mx-auto px-6 py-12 grid gap-10 lg:grid-cols-2 items-center">
        {/* Left: Hero text */}
        <div className="space-y-6">
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
            Build faster with AI-powered content & automation
          </h1>
          <p className="text-lg text-slate-600 max-w-xl">
            Generate blog posts, emails, captions, summaries and more — all
            backed by Gemini. Start free, upgrade when you need unlimited
            credits and priority support.
          </p>

          <div className="flex flex-wrap gap-3 items-center">
            <Link
              href="/pricing"
              className="inline-block px-5 py-3 rounded-lg bg-indigo-600 text-white font-medium shadow hover:bg-indigo-700 transition"
            >
              View Pricing
            </Link>

            <Link
              href="/dashboard"
              className="inline-block px-4 py-3 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 transition"
            >
              Go to Dashboard
            </Link>
          </div>

          <ul className="mt-4 flex gap-4 text-sm text-slate-500">
            <li>✅ Chat & prompts</li>
            <li>✅ PDF summarizer</li>
            <li>✅ Blog & email writers</li>
            <li>✅ Credits & subscription</li>
          </ul>
        </div>

        {/* Right: Session / CTA card */}
        <aside className="rounded-2xl bg-white p-6 shadow-md border">
          {session ? (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-full bg-slate-100 flex items-center justify-center text-xl">
                  {session.user?.name?.[0] ?? "U"}
                </div>
                <div>
                  <p className="font-semibold">{session.user?.name}</p>
                  <p className="text-sm text-slate-500">
                    {session.user?.email}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="px-3 py-1 rounded-full bg-slate-100 text-sm">
                  Plan:{" "}
                  <span className="font-medium ml-1">
                    {session.user?.plan ?? "FREE"}
                  </span>
                </div>
                <div className="px-3 py-1 rounded-full bg-slate-100 text-sm">
                  Credits:{" "}
                  <span className="font-medium ml-1">
                    {session.user?.credits ?? 0}
                  </span>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/dashboard"
                  className="inline-block w-full text-center px-4 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition"
                >
                  Go to Dashboard
                </Link>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  onClick={() => signOut()}
                  className="flex-1 px-3 py-2 rounded-lg border text-sm hover:bg-slate-50 transition"
                >
                  Logout
                </button>

                <Link
                  href="/pricing"
                  className="flex-1 px-3 py-2 rounded-lg bg-indigo-50 text-indigo-700 text-sm hover:bg-indigo-100 transition text-center"
                >
                  Upgrade
                </Link>
              </div>

              <p className="text-xs text-slate-400 mt-3">
                Session ID:{" "}
                <span className="font-mono">{session.user?.id}</span>
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-slate-700 font-semibold">
                You are not logged in
              </p>
              <p className="text-sm text-slate-500">
                Sign in with Google to save your chat history, credits and
                access PRO features.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => signIn("google")}
                  className="flex-1 px-4 py-2 rounded-lg bg-sky-600 text-white hover:bg-sky-700 transition"
                >
                  Continue with Google
                </button>
                <Link
                  href="/pricing"
                  className="flex-1 px-4 py-2 rounded-lg border text-slate-700 hover:bg-slate-50 text-center"
                >
                  Pricing
                </Link>
              </div>
            </div>
          )}
        </aside>
      </section>

      <footer className="border-t mt-10">
        <div className="max-w-6xl mx-auto px-6 py-6 text-sm text-slate-500 flex justify-between">
          <span>© {new Date().getFullYear()} SaaS AI</span>
          <nav className="flex gap-4">
            <Link href="/terms">Terms</Link>
            <Link href="/privacy">Privacy</Link>
          </nav>
        </div>
      </footer>
    </main>
  );
}

//demo one used for learning
// return (
//   <main className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-slate-50">
//     <div className="max-w-2xl text-center space-y-4">
//       <h1 className="text-3xl md:text-5xl font-bold">
//         AI SaaS Content & Automation Platform
//       </h1>

//       <p className="text-slate-300">
//         Demo: Showing how auth data from NextAuth appears on the frontend.
//       </p>

//       {/* SESSION STATUS */}
//       <div className="mt-8 p-4 rounded-xl bg-slate-900 border border-slate-700 text-left w-full">
//         <p className="text-sm text-slate-400 mb-2">
//           Session status: <span className="font-mono">{status}</span>
//         </p>

//         {status === "loading" && <p>Checking if you are logged in...</p>}

//         {status === "unauthenticated" && (
//           <>
//             <p className="mb-3">You are <span className="font-semibold">not logged in</span>.</p>
//             <Link
//               href="/api/auth/signin"
//               className="inline-block px-4 py-2 rounded-lg bg-sky-500 hover:bg-sky-600 transition"
//             >
//               Go to Login
//             </Link>
//           </>
//         )}

//         {status === "authenticated" && (
//           <>
//             <p className="mb-3">
//               You are <span className="font-semibold">logged in</span> as:
//             </p>
//             <ul className="space-y-1 font-mono text-sm">
//               <li>
//                 {/* <span className="text-slate-400">ID:</span> {session?.user?.id as string} */}
//               </li>
//               <li>
//                 <span className="text-slate-400">Name:</span> {session?.user?.name}
//               </li>
//               <li>
//                 <span className="text-slate-400">Email:</span> {session?.user?.email}
//               </li>
//             </ul>

//             <Link
//               href="/api/auth/signout"
//               className="mt-4 inline-block px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 transition"
//             >
//               Logout
//             </Link>
//           </>
//         )}
//       </div>
//     </div>
//   </main>
// );
