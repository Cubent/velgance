import type { ReactNode } from 'react';

type BlogLayoutProps = {
  children: ReactNode;
};

export default function BlogLayout({ children }: BlogLayoutProps) {
  return (
    <div className="blog-page">
      {children}
    </div>
  );
}
