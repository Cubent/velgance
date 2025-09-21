import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Partnership Program | Travira',
  description: 'Join Travira\'s partnership program and earn rewards by sharing flight deals with your audience. Simple, transparent, and beneficial for both you and your followers.',
};

export default function PartnershipLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
