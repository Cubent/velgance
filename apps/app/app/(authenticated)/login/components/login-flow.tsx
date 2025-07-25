'use client';

import { Button } from '@repo/design-system/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@repo/design-system/components/ui/card';
import { Checkbox } from '@repo/design-system/components/ui/checkbox';
import { useState } from 'react';
import { toast } from 'sonner';

type User = {
  id: string;
  clerkId: string;
  email: string;
  name: string | null;
  termsAccepted: boolean;
};

type LoginFlowProps = {
  deviceId: string;
  state: string;
  user: User;
};

export const LoginFlow = ({ deviceId, state, user }: LoginFlowProps) => {
  const [termsAccepted, setTermsAccepted] = useState(false); // Always start unselected
  const [isLoading, setIsLoading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const handleAcceptTerms = async () => {
    if (!termsAccepted) {
      toast.error('Please accept the Terms of Use to continue');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/extension/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          deviceId,
          state,
          acceptTerms: !user.termsAccepted,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to complete login');
      }

      const { token, redirectUrl } = await response.json();
      
      setIsComplete(true);
      toast.success('Login successful! You can now return to VS Code.');

      // Auto-redirect to VS Code if supported
      if (redirectUrl) {
        setTimeout(() => {
          window.location.href = redirectUrl;
        }, 2000);
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error instanceof Error ? error.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  if (isComplete) {
    return (
      <>
        <div className="flex flex-col space-y-3 text-center">
          <div className="space-y-2">
            <h1 className="font-semibold text-2xl tracking-tight text-green-400">
              Login Successful!
            </h1>
            <p className="text-white text-sm leading-relaxed">
              Your VS Code extension has been authorized successfully.
            </p>
          </div>
        </div>

        <Card className="w-full max-w-md bg-white border-gray-200">
          <CardContent className="pt-6 text-center space-y-4">
            <div className="mb-4">
              <div className="mx-auto h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
                <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <p className="text-sm text-gray-700">
              You can now return to VS Code. The extension should automatically detect the authorization.
            </p>
            <Button
              onClick={() => window.location.href = 'https://app.cubent.dev/dashboard'}
              className="w-full bg-transparent hover:bg-transparent text-gray-900 border border-gray-300 hover:border-gray-400"
            >
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </>
    );
    );
  }

  return (
    <>
      <div className="flex flex-col space-y-3 text-center">
        <div className="space-y-2">
          <h1 className="font-semibold text-2xl tracking-tight text-white">
            Authorize VS Code Extension
          </h1>
          <p className="text-white text-sm leading-relaxed">
            Welcome, <span className="bg-gradient-to-r from-blue-400 via-rose-400 via-orange-300 via-blue-400 to-rose-400 bg-clip-text text-transparent">{user.name || user.email}</span>! Please review and accept our terms to continue.
          </p>
        </div>
      </div>

      <Card className="w-full max-w-md bg-white border-gray-200">
        <CardContent className="space-y-6 pt-6">
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Terms of Use</h3>
            <div className="max-h-48 overflow-y-auto rounded border border-gray-200 bg-gray-50 p-4 text-sm">
              <p className="mb-4 text-gray-700">
                By using the Cubent VS Code extension, you agree to the following terms:
              </p>
              <ul className="list-disc space-y-2 pl-4 text-gray-700">
                <li>You will use the extension in accordance with our usage policies</li>
                <li>You understand that AI-generated code should be reviewed before use</li>
                <li>You agree to our data collection and processing practices</li>
                <li>You will not use the extension for malicious or harmful purposes</li>
                <li>You acknowledge that the service is provided "as is"</li>
              </ul>
              <p className="mt-4 text-xs text-gray-500">
                For full terms, visit our website's Terms of Service page.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="terms"
              checked={termsAccepted}
              onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
              className="border-gray-300 bg-transparent data-[state=checked]:bg-transparent data-[state=checked]:border-gray-400 data-[state=checked]:text-gray-900 h-4 w-4 [&[data-state=checked]]:bg-transparent"
            />
            <label
              htmlFor="terms"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-700"
            >
              I accept the Terms of Use
            </label>
          </div>

          <Button
            onClick={handleAcceptTerms}
            disabled={!termsAccepted || isLoading}
            className="w-full bg-transparent hover:bg-transparent text-gray-900 border border-gray-300 hover:border-gray-400"
          >
            {isLoading ? 'Authorizing...' : 'Authorize Extension'}
          </Button>

          <div className="text-center">
            <p className="text-xs text-gray-500">
              Device ID: {deviceId.slice(0, 8)}...
            </p>
          </div>
        </CardContent>
        </Card>
      </div>
    </>
  );
};
