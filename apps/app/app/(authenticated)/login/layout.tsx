import type { ReactNode } from 'react';

type LoginLayoutProperties = {
  readonly children: ReactNode;
};

const LoginLayout = ({ children }: LoginLayoutProperties) => {
  return (
    <div className="min-h-screen bg-[#1a1a1a]">
      {children}
    </div>
  );
};

export default LoginLayout;
