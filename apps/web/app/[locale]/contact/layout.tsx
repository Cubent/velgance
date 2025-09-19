import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact | Travira',
  description: 'Get in touch with Travira for support, questions, or feedback about our flight deal notification service.',
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}