import dynamic from 'next/dynamic';
import { ComponentType } from 'react';

// This creates a component that only renders on the client side
const NoSSR = dynamic(() => Promise.resolve(({ children }: { children: React.ReactNode }) => <>{children}</>), {
  ssr: false
});

export default NoSSR;
