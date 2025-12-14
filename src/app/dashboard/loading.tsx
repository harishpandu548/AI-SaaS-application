export default function DashboardLoading() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-pink-50 via-white to-purple-50">
      
     {/* theme */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-48 -left-48 h-[600px] w-[600px] rounded-full bg-pink-400/20 blur-3xl" />
        <div className="absolute top-1/4 -right-48 h-[600px] w-[600px] rounded-full bg-purple-400/20 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-[500px] w-[500px] rounded-full bg-indigo-400/10 blur-3xl" />
      </div>

      {/*content */}
      <div className="relative max-w-6xl mx-auto px-6 pt-10 pb-16 animate-pulse">

        <div className="flex items-center justify-between mb-12">
          <div className="h-4 w-32 rounded bg-zinc-200" />
          <div className="flex gap-3">
            <div className="h-8 w-16 rounded-full bg-zinc-200" />
            <div className="h-8 w-16 rounded-full bg-zinc-200" />
          </div>
        </div>

        <div className="
          relative rounded-[32px] p-8
          bg-white/55 backdrop-blur-2xl
          border border-purple-500/20
          ring-1 ring-purple-500/10
          shadow-[0_20px_60px_rgba(168,85,247,0.18)]
        ">
          {/* inner shimmer */}
          <div className="absolute inset-0 rounded-[32px] bg-gradient-to-tr from-white/40 via-transparent to-white/30 opacity-40" />

          <div className="relative space-y-8">
            <div className="h-6 w-1/3 rounded bg-zinc-200" />

            <div className="space-y-4">
              <div className="h-4 w-full rounded bg-zinc-200" />
              <div className="h-4 w-5/6 rounded bg-zinc-200" />
              <div className="h-4 w-2/3 rounded bg-zinc-200" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
              <div className="h-24 rounded-2xl bg-white/60 border border-white/40 backdrop-blur" />
              <div className="h-24 rounded-2xl bg-white/60 border border-white/40 backdrop-blur" />
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
