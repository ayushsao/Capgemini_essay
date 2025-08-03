import App from '@/components/App';
import AuthDebugger from '@/components/AuthDebugger';

export default function Home() {
  return (
    <>
      <App />
      {/* Debug component for production testing - remove after fixing login */}
      <AuthDebugger />
    </>
  );
}
