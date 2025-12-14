export default function HomeSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-cyan-100">
      
   {/* skeleton for navbar */}
      <div className="h-16 px-8 flex items-center justify-between backdrop-blur bg-white/60 border-b">
        <div className="h-6 w-24 bg-gray-300/70 rounded-md animate-pulse" />

        <div className="flex items-center gap-4">
          <div className="h-4 w-16 bg-gray-300/70 rounded animate-pulse" />
          <div className="h-4 w-20 bg-gray-300/70 rounded animate-pulse" />
          <div className="h-8 w-16 bg-gray-300/70 rounded-full animate-pulse" />
          <div className="h-8 w-24 bg-gray-300/70 rounded-xl animate-pulse" />
        </div>
      </div>

     {/* hero section */}
      <div className="max-w-7xl mx-auto px-8 py-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        
        {/* {left side */}
        <div className="space-y-6">
          <div className="h-8 w-48 bg-gray-300/70 rounded-full animate-pulse" />

          <div className="space-y-4">
            <div className="h-14 w-full bg-gray-300/70 rounded-xl animate-pulse" />
            <div className="h-14 w-5/6 bg-gray-300/70 rounded-xl animate-pulse" />
            <div className="h-14 w-4/6 bg-gray-300/70 rounded-xl animate-pulse" />
          </div>

          <div className="space-y-3 pt-4">
            <div className="h-4 w-full bg-gray-300/70 rounded animate-pulse" />
            <div className="h-4 w-5/6 bg-gray-300/70 rounded animate-pulse" />
          </div>
        </div>

       {/* right side */}
        <div className="relative">
          <div className="rounded-3xl p-8 bg-white/60 backdrop-blur-xl shadow-xl space-y-6 animate-pulse">
            
            {/* profile */}
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 bg-gray-300/70 rounded-full" />
              <div className="space-y-2">
                <div className="h-4 w-32 bg-gray-300/70 rounded" />
                <div className="h-3 w-48 bg-gray-300/70 rounded" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="h-16 bg-gray-300/70 rounded-xl" />
              <div className="h-16 bg-gray-300/70 rounded-xl" />
            </div>

        
            <div className="h-12 bg-gray-300/70 rounded-xl" />
          </div>
        </div>

      </div>
    </div>
  );
}
