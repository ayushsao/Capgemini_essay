import ChatGPTDemo from '@/components/ChatGPTDemo';

export default function ChatGPTPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <ChatGPTDemo />
    </div>
  );
}

export const metadata = {
  title: 'ChatGPT Essay Analyzer - Essaytude',
  description: 'Advanced essay analysis powered by OpenAI ChatGPT with real-time streaming feedback',
  keywords: 'ChatGPT, essay analysis, AI writing assistant, OpenAI, essay feedback'
};
