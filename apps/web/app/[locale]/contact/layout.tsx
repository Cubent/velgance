import { getDictionary } from '@repo/internationalization';
import { createMetadata } from '@repo/seo/metadata';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';

type ContactLayoutProps = {
  readonly children: ReactNode;
  readonly params: Promise<{
    locale: string;
  }>;
};

export const generateMetadata = async ({
  params,
}: ContactLayoutProps): Promise<Metadata> => {
  const { locale } = await params;
  const dictionary = await getDictionary(locale);

  return createMetadata(dictionary.web.contact.meta);
};

const ContactLayout = ({ children }: ContactLayoutProps) => {
  return (
    <div className="min-h-screen">
      {children}
    </div>
  );
};

export default ContactLayout;
