'use client';

import { useState, useEffect } from 'react';

type ObfuscatedEmailProps = {
  user: string;
  domain: string;
  className?: string;
  children?: React.ReactNode;
};

export const ObfuscatedEmail = ({ user, domain, className = '', children }: ObfuscatedEmailProps) => {
  const [email, setEmail] = useState('');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Decode the email on the client side
    const decodedEmail = `${user}@${domain}`;
    setEmail(decodedEmail);
  }, [user, domain]);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (email) {
      window.location.href = `mailto:${email}`;
    }
  };

  if (!isClient) {
    // Server-side render with obfuscated content
    return (
      <span className={className}>
        {children || 'Contact us'}
      </span>
    );
  }

  return (
    <a
      href={`mailto:${email}`}
      onClick={handleClick}
      className={className}
      aria-label={`Send email to ${email}`}
    >
      {children || email}
    </a>
  );
};

// Helper function to encode email parts
export const encodeEmailParts = (email: string) => {
  const [user, domain] = email.split('@');
  return {
    user: btoa(user),
    domain: btoa(domain),
  };
};
