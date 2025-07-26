import type { ReactNode } from 'react';

type BlogLayoutProps = {
  children: ReactNode;
};

export default function BlogLayout({ children }: BlogLayoutProps) {
  return (
    <>
      <style jsx global>{`
        .blog-page header {
          background: rgba(22, 22, 22, 0.95) !important;
        }
      `}</style>
      <div className="blog-page">
        {children}
      </div>
    </>
  );
}
