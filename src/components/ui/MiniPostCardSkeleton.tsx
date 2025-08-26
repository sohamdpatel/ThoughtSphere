export default function MiniPostCardSkeleton() {
    return (
        <div className="w-full flex bg-[#1e1e1e] rounded-2xl p-3 animate-pulse">
        <div className="pr-3 min-w-fit">
          <div className="bg-[#303030] rounded-full w-7 h-7 shrink-0"></div>
        </div>
        <div className="flex flex-col gap-2 w-full">
          <div className="flex gap-2 items-center">
            <div className="bg-[#303030] h-4 w-24 rounded"></div>
            <div className="bg-[#303030] h-4 w-10 rounded-full"></div>
          </div>
          <div className="bg-[#303030] h-4 w-full rounded"></div>
          {/* <div className="bg-[#303030] h-4 w-4/5 rounded"></div> */}
          <div className="flex gap-1">
            <div className="flex gap-2 items-center rounded-xl px-1">
              <div className="bg-[#303030] h-4 w-4 rounded-full"></div>
              <div className="bg-[#303030] h-3 w-6 rounded"></div>
            </div>
            <div className="flex gap-2 items-center rounded-xl px-1">
              <div className="bg-[#303030] h-4 w-4 rounded-full"></div>
              <div className="bg-[#303030] h-3 w-6 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    )
}