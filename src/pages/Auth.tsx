import React, { useState } from 'react';
import { useApp } from '../store/AppContext';
import {
  Heart, Eye, EyeOff, ArrowLeft, CheckCircle, Sparkles, Shield, Lock, BookOpen, Bot,
} from 'lucide-react';
import { sendSignupOtp, verifySignupOtp } from '../api/client';

/* ---------- Shared decorative split panel (left side on desktop) ---------- */
const BrandPanel: React.FC<{ subtitle: string }> = ({ subtitle }) => (
  <div className="relative hidden lg:flex flex-col justify-between w-1/2 p-12 text-white overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-br from-pink-500 via-fuchsia-500 to-purple-600" />
    <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-white/10 blur-3xl animate-blob" />
    <div className="absolute -bottom-20 -right-10 w-[28rem] h-[28rem] rounded-full bg-white/10 blur-3xl animate-blob" style={{ animationDelay: '5s' }} />
    <div className="relative z-10">
      <div className="flex items-center gap-2.5">
        <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center shadow-lg">
          <Heart className="w-5 h-5 text-white" fill="white" />
        </div>
        <span className="font-display font-bold text-xl">CycleCare</span>
      </div>
    </div>
    <div className="relative z-10">
      <h2 className="font-display text-4xl font-bold leading-tight mb-3">
        Your cycle, <br />beautifully tracked.
      </h2>
      <p className="text-pink-50/95 text-lg max-w-md mb-10">{subtitle}</p>
      <div className="space-y-3">
        {[
          { icon: Shield, text: 'End-to-end encrypted health data' },
          { icon: BookOpen, text: 'Doctor-reviewed health library' },
          { icon: Bot, text: '24/7 private AI health assistant' },
          { icon: Lock, text: 'Anonymous community support' },
        ].map(({ icon: Icon, text }, i) => (
          <div key={i} className="flex items-center gap-3 text-pink-50/90">
            <div className="w-8 h-8 rounded-lg bg-white/15 backdrop-blur flex items-center justify-center">
              <Icon className="w-4 h-4" />
            </div>
            <span className="text-sm">{text}</span>
          </div>
        ))}
      </div>
    </div>
    <p className="relative z-10 text-pink-100/70 text-xs">© 2025 CycleCare</p>
  </div>
);

const PageWrap: React.FC<{ subtitle: string; children: React.ReactNode }> = ({ subtitle, children }) => {
  const { setPage } = useApp();
  return (
    <div className="min-h-screen bg-mesh flex">
      <BrandPanel subtitle={subtitle} />

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-6 relative overflow-hidden">
        {/* mobile blobs */}
        <div className="absolute top-10 left-10 w-72 h-72 bg-pink-300/30 rounded-full blur-3xl lg:hidden" />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-purple-300/30 rounded-full blur-3xl lg:hidden" />

        <div className="w-full max-w-md relative animate-fadeIn">
          <button
            onClick={() => setPage('landing')}
            className="flex items-center gap-2 text-ink-400 hover:text-pink-600 mb-6 transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </button>
          {children}
        </div>
      </div>
    </div>
  );
};

/* ---------------- LOGIN ---------------- */
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
    <PageWrap subtitle="Welcome back. Sign in to continue tracking your wellness journey.">
      <div className="glass rounded-3xl p-8 shadow-card">
        <div className="text-center mb-7">
          <div className="inline-flex w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-500 to-purple-500 items-center justify-center mb-4 shadow-glow lg:hidden">
            <Heart className="w-7 h-7 text-white" fill="white" />
          </div>
          <h1 className="font-display text-3xl font-bold text-ink-800 dark:text-white">Welcome back</h1>
          <p className="text-ink-400 text-sm mt-1.5">Sign in to your CycleCare account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Email Address</label>
            <input
              type="email" value={email} onChange={e => setEmail(e.target.value)} required
              className="input" placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="label">Password</label>
            <div className="relative">
              <input
                type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required
                className="input pr-12" placeholder="••••••••"
              />
              <button type="button" onClick={() => setShowPass(!showPass)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-ink-400 hover:text-pink-500">
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl animate-fadeIn">
              {error}
            </div>
          )}

          <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 disabled:opacity-70">
            {loading ? 'Signing in...' : 'Login'}
          </button>
        </form>

        <p className="text-center text-sm text-ink-400 mt-6">
          Don't have an account?{' '}
          <button onClick={() => setPage('signup')} className="text-pink-600 font-semibold hover:underline">
            Sign up free
          </button>
        </p>
      </div>
    </PageWrap>
  );
};

/* ---------------- SIGNUP ---------------- */
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
    if (!form.email) { setError('Please enter your email first.'); return; }
    setOtpLoading(true); setError('');
    try {
      const result = await sendSignupOtp({ email: form.email });
      setOtpSent(true); setOtpVerified(false);
      setDevOtpHint(result.devOtp ? `Dev OTP: ${result.devOtp}` : '');
    } catch (err) {
      setDevOtpHint('');
      setError(err instanceof Error ? err.message : 'Could not send OTP.');
    } finally { setOtpLoading(false); }
  };

  const handleVerifyOtp = async () => {
    if (!form.email || !otp) { setError('Enter email and OTP to verify.'); return; }
    setOtpLoading(true); setError('');
    try {
      await verifySignupOtp({ email: form.email, otp });
      setOtpVerified(true);
    } catch (err) {
      setOtpVerified(false);
      setError(err instanceof Error ? err.message : 'OTP verification failed.');
    } finally { setOtpLoading(false); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpVerified) { setError('Please verify your email with OTP before creating account.'); return; }
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
      <div className="min-h-screen bg-mesh flex items-center justify-center p-6">
        <div className="glass rounded-3xl p-10 text-center animate-fadeIn shadow-glow">
          <CheckCircle className="w-20 h-20 text-emerald-500 mx-auto mb-4 animate-pulse-soft" />
          <h2 className="font-display text-2xl font-bold text-ink-800 dark:text-white mb-2">Welcome to CycleCare!</h2>
          <p className="text-ink-500">Redirecting to your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <PageWrap subtitle="Create your free account in under two minutes. Your data, your control.">
      <div className="glass rounded-3xl p-8 shadow-card">
        <div className="text-center mb-7">
          <div className="inline-flex w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-500 to-purple-500 items-center justify-center mb-4 shadow-glow lg:hidden">
            <Heart className="w-7 h-7 text-white" fill="white" />
          </div>
          <h1 className="font-display text-3xl font-bold text-ink-800 dark:text-white">Create your account</h1>
          <p className="text-ink-400 text-sm mt-1.5 inline-flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-pink-500" /> Join CycleCare — it's free!
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { label: 'Full Name', key: 'name', type: 'text', placeholder: 'Priya Sharma' },
            { label: 'Age', key: 'age', type: 'number', placeholder: '20' },
            { label: 'Average Cycle Length (days, optional)', key: 'cycleLength', type: 'number', placeholder: '28' },
          ].map(({ label, key, type, placeholder }) => (
            <div key={key}>
              <label className="label">{label}</label>
              <input
                type={type} value={form[key as keyof typeof form]}
                onChange={e => setForm(prev => ({ ...prev, [key]: e.target.value }))}
                required={key !== 'cycleLength'}
                className="input" placeholder={placeholder}
              />
            </div>
          ))}

          <div>
            <label className="label">Email Address</label>
            <div className="flex gap-2">
              <input
                type="email"
                value={form.email}
                onChange={e => {
                  setForm(prev => ({ ...prev, email: e.target.value }));
                  setOtp(''); setOtpSent(false); setOtpVerified(false); setDevOtpHint('');
                }}
                required className="input" placeholder="priya@example.com"
              />
              <button
                type="button" onClick={handleSendOtp} disabled={otpLoading || !form.email}
                className="btn-secondary px-3 py-2 text-sm whitespace-nowrap disabled:opacity-60"
              >
                {otpLoading ? '...' : otpSent ? 'Resend' : 'Send OTP'}
              </button>
            </div>
          </div>

          {otpSent && (
            <div className="animate-fadeIn">
              <label className="label">Email OTP</label>
              <div className="flex gap-2">
                <input
                  type="text" value={otp}
                  onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  required className="input tracking-[0.5em] text-center font-mono" placeholder="••••••"
                />
                <button
                  type="button" onClick={handleVerifyOtp} disabled={otpLoading || otp.length !== 6}
                  className="btn-secondary px-3 py-2 text-sm whitespace-nowrap disabled:opacity-60"
                >
                  Verify
                </button>
              </div>
              {otpVerified && (
                <p className="text-xs text-emerald-600 mt-2 inline-flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" /> Email verified successfully.
                </p>
              )}
              {devOtpHint && <p className="text-xs text-amber-600 mt-1">{devOtpHint}</p>}
            </div>
          )}

          <div>
            <label className="label">Password</label>
            <div className="relative">
              <input
                type={showPass ? 'text' : 'password'} value={form.password}
                onChange={e => setForm(prev => ({ ...prev, password: e.target.value }))} required minLength={6}
                className="input pr-12" placeholder="Min. 6 characters"
              />
              <button type="button" onClick={() => setShowPass(!showPass)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-ink-400 hover:text-pink-500">
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl animate-fadeIn">
              {error}
            </div>
          )}

          <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 disabled:opacity-70">
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-xs text-ink-400 mt-4">
          By signing up, you agree to our Privacy Policy. Your data is always encrypted.
        </p>

        <p className="text-center text-sm text-ink-400 mt-3">
          Already have an account?{' '}
          <button onClick={() => setPage('login')} className="text-pink-600 font-semibold hover:underline">
            Login
          </button>
        </p>
      </div>
    </PageWrap>
  );
};
