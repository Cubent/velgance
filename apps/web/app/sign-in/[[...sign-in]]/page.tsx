import { redirect } from 'next/navigation';

export default function RootSignInRedirect() {
  redirect('/en/sign-in');
}

