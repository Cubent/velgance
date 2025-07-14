
import type { ReactNode } from 'react';

type AuthLayoutProps = {
  readonly children: ReactNode;
};

const AuthLayout = ({ children }: AuthLayoutProps) => (
  <div className="relative min-h-dvh w-full" style={{backgroundColor: '#161616'}}>
    {/* Vertical lines */}
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute top-0 bottom-0 w-px bg-white/5 left-1/4"></div>
      <div className="absolute top-0 bottom-0 w-px bg-white/5 left-2/4"></div>
      <div className="absolute top-0 bottom-0 w-px bg-white/5 left-3/4"></div>
    </div>

    {/* Horizontal lines */}
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute left-0 right-0 h-px bg-white/5 top-1/4"></div>
      <div className="absolute left-0 right-0 h-px bg-white/5 top-2/4"></div>
      <div className="absolute left-0 right-0 h-px bg-white/5 top-3/4"></div>
    </div>

    <div className="relative z-10 flex min-h-dvh items-center justify-center p-4">
      <div className="w-full max-w-lg mx-auto">
        <div className="space-y-6 flex flex-col items-center">
          {children}
        </div>
      </div>
    </div>
  </div>
);

export default AuthLayout;
