import React, { useState } from 'react';
import { UserAccount } from '../types';
import { DashboardApi } from '../services/api';

interface AdminSignInProps {
  onSignInSuccess: (user: UserAccount) => void;
  onCancel?: () => void;
  users: UserAccount[];
}

export const AdminSignIn: React.FC<AdminSignInProps> = ({
  onSignInSuccess,
  onCancel,
  users,
}) => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    const clean = identifier.trim().toLowerCase();

    try {
      // Production live API login against PostgreSQL database
      const res = await DashboardApi.login(clean, password);
      if (res?.success && res?.data?.user) {
        const apiUser = res.data.user;
        const matchedLocal = users.find(
          (u) =>
            (u.username && u.username.toLowerCase() === clean) ||
            (u.email && u.email.trim().toLowerCase() === clean)
        );

        const authenticatedUser: UserAccount = {
          id: apiUser.id,
          name: apiUser.name,
          username: apiUser.username || clean,
          email: apiUser.email,
          role: (apiUser.role === 'ADMIN' ? 'Admin' : apiUser.role === 'DEVELOPER' ? 'Developer' : 'Manager'),
          roleTitle: matchedLocal?.roleTitle || (apiUser.role === 'DEVELOPER' ? 'Lead Developer & Tech' : 'Salon Administrator'),
          initials: (apiUser.name || 'AD').split(' ').map((n: string) => n[0]).slice(0, 2).join('').toUpperCase(),
          password: password,
          createdAt: new Date().toISOString().split('T')[0],
        };

        setIsLoading(false);
        onSignInSuccess(authenticatedUser);
        return;
      }
    } catch (apiErr: any) {
      setIsLoading(false);
      const msg = apiErr?.message || '';
      if (msg.includes('Invalid credentials') || msg.includes('401') || msg.includes('deactivated')) {
        setErrorMessage('Invalid username/email or password. Please verify and try again.');
      } else {
        setErrorMessage(msg || 'Unable to connect to salon authentication service. Please verify network connectivity.');
      }
      return;
    }

    setIsLoading(false);
    setErrorMessage('Authentication failed. Please verify credentials.');
  };

  return (
    <div className="min-h-screen bg-[#f6faf7] dark:bg-[#0f1713] flex items-center justify-center p-6 antialiased">
      <main className="w-full max-w-md mx-auto">
        <div className="bg-white dark:bg-[#15201a] rounded-2xl shadow-xl p-8 sm:p-10 border border-[#c2c8c2]/40 dark:border-[#2b3a32] relative">
          {onCancel && (
            <button
              onClick={onCancel}
              className="absolute top-4 right-4 text-[#727973] hover:text-[#181d1b] dark:text-[#8d9c94] dark:hover:text-white p-1.5 rounded-full hover:bg-[#f0f5f1] dark:hover:bg-[#1f2d25] transition-colors cursor-pointer"
              title="Return to Dashboard"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          )}

          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#caead5]/50 dark:bg-[#1a382a] text-[#112e20] dark:text-[#7cebb0] mb-2 shadow-xs">
              <span className="material-symbols-outlined text-[24px]">spa</span>
            </div>
            <p className="text-[11px] uppercase tracking-widest text-[#9b4521] dark:text-[#ff9266] font-bold mb-1">
              StyleX Signature Salon
            </p>
            <h1 className="font-serif text-3xl text-[#112e20] dark:text-white font-medium tracking-tight">
              Dashboard Login
            </h1>
            <p className="text-xs text-[#424844] dark:text-[#a0aca4] mt-1">
              Sign in with your registered username or email
            </p>
          </div>

          {/* Error Alert */}
          {errorMessage && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 flex items-start gap-2.5 text-xs text-red-700 dark:text-red-300 animate-in fade-in duration-200">
              <span className="material-symbols-outlined text-[18px] shrink-0 text-red-600 dark:text-red-400">
                error
              </span>
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#181d1b] dark:text-[#d3ded8] mb-1.5" htmlFor="login-identifier">
                Username or Email Address
              </label>
              <div className="relative rounded-lg shadow-2xs">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#424844] dark:text-[#8a9890]">
                  <span className="material-symbols-outlined text-[18px]">person</span>
                </div>
                <input
                  required
                  id="login-identifier"
                  type="text"
                  value={identifier}
                  onChange={(e) => {
                    setIdentifier(e.target.value);
                    setErrorMessage('');
                  }}
                  placeholder="Enter username or email"
                  className="block w-full pl-11 pr-4 py-3 text-sm rounded-lg bg-[#f0f5f1] dark:bg-[#1a2520] text-[#181d1b] dark:text-white focus:outline-none focus:bg-white dark:focus:bg-[#202e26] focus:ring-2 focus:ring-[#9b4521] border border-transparent focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-[#181d1b] dark:text-[#d3ded8]" htmlFor="password">
                  Password
                </label>
              </div>
              <div className="relative rounded-lg shadow-2xs">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#424844] dark:text-[#8a9890]">
                  <span className="material-symbols-outlined text-[18px]">key</span>
                </div>
                <input
                  required
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrorMessage('');
                  }}
                  placeholder="Password"
                  className="block w-full pl-11 pr-11 py-3 text-sm rounded-lg bg-[#f0f5f1] dark:bg-[#1a2520] text-[#181d1b] dark:text-white focus:outline-none focus:bg-white dark:focus:bg-[#202e26] focus:ring-2 focus:ring-[#9b4521] border border-transparent focus:border-transparent tracking-widest placeholder:tracking-normal transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Toggle password visibility"
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#424844] dark:text-[#8a9890] hover:text-[#181d1b] dark:hover:text-white transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#9b4521] hover:bg-[#752906] text-white py-3.5 px-6 rounded-full text-sm font-semibold tracking-wide flex items-center justify-center gap-2 shadow-md hover:shadow-lg transform active:scale-[0.99] transition-all cursor-pointer group disabled:opacity-75"
              >
                <span>{isLoading ? 'Verifying Credentials...' : 'Sign In'}</span>
                <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">
                  arrow_forward
                </span>
              </button>
            </div>
          </form>

          <div className="mt-6 pt-4 border-t border-[#eaefeb] dark:border-[#243029] text-center">
            <p className="text-xs text-[#727973] dark:text-[#8a9890]">
              Registered Salon Accounts • Automatic Profile Recognition
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};
