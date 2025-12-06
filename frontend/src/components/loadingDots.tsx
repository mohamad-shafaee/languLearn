
export default function LoadingDots() {
  return (
    <div className="flex items-center space-x-2">
      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
      <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
      <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce"></div>
    </div>
  );
}