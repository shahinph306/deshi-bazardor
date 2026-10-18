export default function ProductSkeleton() {
  return (
    <div className="bg-white rounded-lg border border-gray-100 p-4 animate-pulse">
     
      <div className="w-full h-36 bg-gray-200 rounded-lg mb-3"></div>
      
    
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
      
      <div className="h-3 bg-gray-200 rounded w-1/2 mb-3"></div>
      
      <div className="h-8 bg-gray-200 rounded w-full"></div>
    </div>
  );
}