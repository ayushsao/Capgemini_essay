'use client';

interface TransitionLoaderProps {
  message?: string;
}

export default function TransitionLoader({ message = "Loading..." }: TransitionLoaderProps) {
  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-40">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4 animate-pulse">
          <span className="text-2xl text-white">📚</span>
        </div>
        <div className="flex justify-center space-x-1 mb-2">
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
        <p className="text-blue-600 font-medium">{message}</p>
      </div>
    </div>
  );
}
