export default function PostCardSkeleton() {
  return (
    <div className=" max-w-7xl w-full flex gap-3 p-4 my-1 rounded-2xl flex-col justify-center animate-pulse">
      {/* User details and post time */}
      <div className="flex items-center gap-3">
        {/* Profile picture skeleton */}
        <div className="bg-gray-300 rounded-full w-7 h-7"></div>
        {/* Username and time skeleton */}
        <div className="flex gap-1">
          <div className="bg-gray-300 rounded-md h-4 w-28"></div>
          <div className="bg-gray-200 rounded-md h-3 w-16"></div>
        </div>
      </div>

      {/* Post content skeleton */}
      <div className="flex flex-col gap-2">
        {/* Main title skeleton */}
        <div className="bg-gray-300 rounded-md h-6 w-full"></div>
        <div className="bg-gray-300 rounded-md h-6 w-11/12"></div>
        {/* Post image skeleton */}
        <div className="bg-gray-200 rounded-2xl max-h-[540px] h-[440px] w-full"></div>
        {/* Description skeleton */}
        <div className="bg-gray-200 rounded-md h-4 w-full"></div>
        <div className="bg-gray-200 rounded-md h-4 w-3/4"></div> 
      </div>

      {/* Action buttons and counts skeleton */}
      <div className="flex justify-between items-center">
        <div className="flex gap-4">
          {/* Likes skeleton */}
          <div className="flex items-center gap-2">
            <div className="bg-gray-300 h-6 w-6 rounded-full"></div>
            <div className="bg-gray-200 h-4 w-8 rounded-md"></div>
          </div>
          {/* Comments skeleton */}
          <div className="flex items-center gap-2">
            <div className="bg-gray-300 h-6 w-6 rounded-full"></div>
            <div className="bg-gray-200 h-4 w-8 rounded-md"></div>
          </div>
          {/* Share skeleton */}
          <div className="bg-gray-300 h-6 w-6 rounded-full"></div>
        </div>
        {/* Bookmark skeleton */}
        <div className="bg-gray-300 h-6 w-6 rounded-full"></div>
      </div>
    </div>
  );
}