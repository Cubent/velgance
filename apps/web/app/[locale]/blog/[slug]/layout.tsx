import type { ReactNode } from 'react';

type BlogPostLayoutProps = {
  children: ReactNode;
};

export default function BlogPostLayout({ children }: BlogPostLayoutProps) {
  return (
    <div className="blog-page">
      {children}
    </div>
  );
}
