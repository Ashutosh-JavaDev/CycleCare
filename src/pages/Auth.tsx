import React, { useState } from 'react';
import { useApp } from '../store/AppContext';
import { Heart, Eye, EyeOff, ArrowLeft, CheckCircle } from 'lucide-react';
import { sendSignupOtp, verifySignupOtp } from '../api/client';

export const Login: React.FC = () => {
  const { login, setPage } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const result = await login(email, password);
    if (!result.success) setError(result.message || 'Invalid email or password.');
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-10 left-10 w-72 h-72 bg-pink-200/30 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl"></div>

      <div className="w-full max-w-md relative">
        <button onClick={() => setPage('landing')} className="flex items-center gap-2 text-gray-400 hover:text-pink-500 mb-6 transition-colors text-sm">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </button>

        <div className="bg-white/80 backdrop-blur-lg rounded-3xl border border-pink-100 shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-400 to-purple-400 flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Heart className="w-7 h-7 text-white" fill="white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Welcome Back 🌸</h1>
            <p className="text-gray-400 text-sm mt-1">Sign in to your CycleCare account</p>
          </div>

          <div className="bg-pink-50 border border-pink-200 rounded-2xl p-4 mb-6 text-sm text-gray-600">
            Accounts are now validated against the connected database.
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)} required
                className="w-full px-4 py-3 rounded-xl border border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-300 bg-white/80 text-gray-800 placeholder-gray-300"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required
                  className="w-full px-4 py-3 rounded-xl border border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-300 bg-white/80 text-gray-800 placeholder-gray-300 pr-12"
                  placeholder="••••••••"
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-pink-400">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-500 text-sm px-4 py-3 rounded-xl">
                {error}
              </div>
            )}

            <button
              type="submit" disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-pink-200 transition-all disabled:opacity-70"
            >
              {loading ? 'Signing in...' : 'Login'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-400 mt-6">
            Don't have an account?{' '}
            <button onClick={() => setPage('signup')} className="text-pink-500 font-semibold hover:underline">
              Sign up free
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export const Signup: React.FC = () => {
  const { signup, setPage } = useApp();
  const [form, setForm] = useState({ name: '', email: '', password: '', age: '', cycleLength: '' });
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [devOtpHint, setDevOtpHint] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSendOtp = async () => {
    if (!form.email) {
      setError('Please enter your email first.');
      return;
    }

    setOtpLoading(true);
    setError('');
    try {
      const result = await sendSignupOtp({ email: form.email });
      setOtpSent(true);
      setOtpVerified(false);
      setDevOtpHint(result.devOtp ? `Dev OTP: ${result.devOtp}` : '');
    } catch (err) {
      setDevOtpHint('');
      setError(err instanceof Error ? err.message : 'Could not send OTP.');
    } finally {
      setOtpLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!form.email || !otp) {
      setError('Enter email and OTP to verify.');
      return;
    }

    setOtpLoading(true);
    setError('');
    try {
      await verifySignupOtp({ email: form.email, otp });
      setOtpVerified(true);
    } catch (err) {
      setOtpVerified(false);
      setError(err instanceof Error ? err.message : 'OTP verification failed.');
    } finally {
      setOtpLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpVerified) {
      setError('Please verify your email with OTP before creating account.');
      return;
    }

    setLoading(true); setError('');
    const result = await signup({
      name: form.name, email: form.email, password: form.password,
      age: parseInt(form.age), cycleLength: form.cycleLength ? parseInt(form.cycleLength) : undefined,
    });
    if (!result.success) setError(result.message || 'This email is already registered. Please login.');
    else setSuccess(true);
    setLoading(false);
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="text-center animate-fadeIn">
          <CheckCircle className="w-20 h-20 text-green-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome to CycleCare! 🌸</h2>
          <p className="text-gray-500">Redirecting to your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-10 right-10 w-72 h-72 bg-purple-200/30 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-pink-200/30 rounded-full blur-3xl"></div>

      <div className="w-full max-w-md relative">
        <button onClick={() => setPage('landing')} className="flex items-center gap-2 text-gray-400 hover:text-pink-500 mb-6 transition-colors text-sm">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </button>

        <div className="bg-white/80 backdrop-blur-lg rounded-3xl border border-pink-100 shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-400 to-purple-400 flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Heart className="w-7 h-7 text-white" fill="white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Create Account 🌸</h1>
            <p className="text-gray-400 text-sm mt-1">Join CycleCare – it's free!</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { label: 'Full Name', key: 'name', type: 'text', placeholder: 'Priya Sharma' },
              { label: 'Age', key: 'age', type: 'number', placeholder: '20' },
              { label: 'Average Cycle Length (days, optional)', key: 'cycleLength', type: 'number', placeholder: '28' },
            ].map(({ label, key, type, placeholder }) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                <input
                  type={type} value={form[key as keyof typeof form]}
                  onChange={e => setForm(prev => ({ ...prev, [key]: e.target.value }))}
                  required={key !== 'cycleLength'}
                  className="w-full px-4 py-3 rounded-xl border border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-300 bg-white/80 text-gray-800 placeholder-gray-300"
                  placeholder={placeholder}
                />
              </div>
            ))}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <div className="flex gap-2">
                <input
                  type="email"
                  value={form.email}
                  onChange={e => {
                    setForm(prev => ({ ...prev, email: e.target.value }));
                    setOtp('');
                    setOtpSent(false);
                    setOtpVerified(false);
                    setDevOtpHint('');
                  }}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-300 bg-white/80 text-gray-800 placeholder-gray-300"
                  placeholder="priya@example.com"
                />
                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={otpLoading || !form.email}
                  className="px-3 py-2 rounded-xl border border-pink-200 text-pink-600 text-sm font-semibold hover:bg-pink-50 disabled:opacity-60"
                >
                  {otpLoading ? '...' : otpSent ? 'Resend' : 'Send OTP'}
                </button>
              </div>
            </div>

            {otpSent && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email OTP</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={otp}
                    onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-300 bg-white/80 text-gray-800 placeholder-gray-300"
                    placeholder="Enter 6-digit OTP"
                  />
                  <button
                    type="button"
                    onClick={handleVerifyOtp}
                    disabled={otpLoading || otp.length !== 6}
                    className="px-3 py-2 rounded-xl border border-pink-200 text-pink-600 text-sm font-semibold hover:bg-pink-50 disabled:opacity-60"
                  >
                    Verify
                  </button>
                </div>
                {otpVerified && <p className="text-xs text-green-600 mt-2">Email verified successfully.</p>}
                {devOtpHint && <p className="text-xs text-amber-600 mt-1">{devOtpHint}</p>}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'} value={form.password}
                  onChange={e => setForm(prev => ({ ...prev, password: e.target.value }))} required minLength={6}
                  className="w-full px-4 py-3 rounded-xl border border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-300 bg-white/80 text-gray-800 placeholder-gray-300 pr-12"
                  placeholder="Min. 6 characters"
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-pink-400">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-500 text-sm px-4 py-3 rounded-xl">{error}</div>
            )}

            <button
              type="submit" disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-pink-200 transition-all disabled:opacity-70"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-xs text-gray-400 mt-4">
            By signing up, you agree to our Privacy Policy. Your data is always encrypted.
          </p>

          <p className="text-center text-sm text-gray-400 mt-4">
            Already have an account?{' '}
            <button onClick={() => setPage('login')} className="text-pink-500 font-semibold hover:underline">Login</button>
          </p>
        </div>
      </div>
    </div>
  );
};
