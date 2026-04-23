import React, { useEffect, useState } from 'react';
import { useApp } from '../store/AppContext';
import { useScrollReveal } from '../hooks/useScrollReveal';
import {
  Heart, Calendar, Activity, BookOpen, Bot, Users,
  ArrowRight, Star, Shield, ChevronDown, Sparkles,
  Pill, Apple, Cross, CheckCircle2, Lock, Zap
} from 'lucide-react';

const features = [
  { icon: Heart,    title: 'Cycle Tracking',         desc: 'Log periods in seconds. Beautifully designed inputs and instant insights.', color: 'from-pink-500 to-rose-400' },
  { icon: Activity, title: 'Symptom Logging',        desc: 'Capture mood, pain and energy daily. Spot patterns over time.',                color: 'from-purple-500 to-indigo-400' },
  { icon: Calendar, title: 'Smart Predictions',      desc: 'AI-assisted forecasts of your next period and ovulation window.',              color: 'from-pink-500 to-purple-500' },
  { icon: BookOpen, title: 'Health Library',         desc: 'Doctor-reviewed articles on PCOS, cramps, hormones and more.',                 color: 'from-violet-500 to-purple-400' },
  { icon: Bot,      title: '24/7 AI Assistant',      desc: 'Private, judgment-free answers to any health question, instantly.',            color: 'from-fuchsia-500 to-pink-400' },
  { icon: Users,    title: 'Anonymous Community',    desc: 'Connect with peers in a safe space — moderated and stigma-free.',              color: 'from-purple-500 to-pink-500' },
  { icon: Pill,     title: 'Medicine Guide',         desc: 'Common period medications, dosage notes and safety tips.',                     color: 'from-rose-500 to-pink-400' },
  { icon: Apple,    title: 'Pain Relief Foods',      desc: 'Curated foods that help with cramps, fatigue and bloating.',                   color: 'from-emerald-500 to-teal-400' },
  { icon: Cross,    title: 'Find Hospitals',         desc: 'Locate the nearest hospitals and women\'s clinics in seconds.',                color: 'from-sky-500 to-blue-400' },
];

const testimonials = [
  { name: 'Priya S.',  age: 20, text: 'CycleCare helped me understand my body so much better. The predictions are incredibly accurate!', rating: 5 },
  { name: 'Ananya M.', age: 19, text: 'I love the community forum. Finally a safe space to discuss health topics without judgment.',     rating: 5 },
  { name: 'Riya K.',   age: 21, text: 'The symptom tracking helped me identify a pattern that led to my PCOS diagnosis. Life-changing!',  rating: 5 },
];

const steps = [
  { num: '01', title: 'Create Account',  desc: 'Sign up securely in under 2 minutes.' },
  { num: '02', title: 'Log Your Cycle',  desc: 'Enter your period start and end dates.' },
  { num: '03', title: 'Track Symptoms',  desc: 'Log daily symptoms and pain levels.' },
  { num: '04', title: 'Get Insights',    desc: 'Receive predictions and health tips.' },
];

const trustPoints = [
  { icon: Lock,        text: 'End-to-end encrypted data' },
  { icon: Shield,      text: 'Never sold to advertisers' },
  { icon: CheckCircle2,text: 'Doctor-reviewed content' },
  { icon: Zap,         text: 'Lightning-fast experience' },
];

export const Landing: React.FC = () => {
  const { setPage } = useApp();
  const [scrolled, setScrolled] = useState(false);
  useScrollReveal([]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="min-h-screen overflow-x-hidden bg-mesh">
      {/* Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 px-6 py-3 transition-all duration-300 ${scrolled ? 'bg-white/85 backdrop-blur-xl border-b border-pink-100 shadow-soft' : 'bg-transparent'}`}>
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center shadow-glow">
              <Heart className="w-4.5 h-4.5 text-white" fill="white" />
            </div>
            <span className="font-display font-bold text-xl gradient-text">CycleCare</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-ink-500">
            <a href="#features"     className="hover:text-pink-600 transition-colors">Features</a>
            <a href="#how"          className="hover:text-pink-600 transition-colors">How It Works</a>
            <a href="#testimonials" className="hover:text-pink-600 transition-colors">Reviews</a>
            <a href="#trust"        className="hover:text-pink-600 transition-colors">Privacy</a>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setPage('login')}  className="btn-ghost">Login</button>
            <button onClick={() => setPage('signup')} className="btn-primary px-4 py-2 text-sm">Get Started</button>
          </div>
        </div>
      </nav>

      {/* ============== HERO ============== */}
      <section className="pt-32 pb-24 px-6 relative overflow-hidden">
        <div className="absolute -top-10 -left-10 w-80 h-80 bg-pink-300/30 rounded-full blur-3xl animate-blob" />
        <div className="absolute top-20 -right-10 w-[28rem] h-[28rem] bg-purple-300/30 rounded-full blur-3xl animate-blob" style={{ animationDelay: '4s' }} />
        <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-rose-200/40 rounded-full blur-3xl animate-blob" style={{ animationDelay: '8s' }} />

        <div className="max-w-5xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 glass text-pink-600 text-sm px-4 py-2 rounded-full mb-7 shadow-soft animate-fadeIn">
            <Sparkles className="w-4 h-4" />
            <span>Trusted by 10,000+ students across India</span>
          </div>

          <h1 className="font-display text-5xl md:text-7xl font-extrabold text-ink-800 dark:text-white mb-6 leading-[1.05] animate-fadeIn">
            Understand your cycle.
            <br />
            <span className="gradient-text">Take control of your health.</span>
          </h1>

          <p className="text-lg md:text-xl text-ink-500 dark:text-ink-200 mb-10 max-w-2xl mx-auto leading-relaxed animate-fadeIn">
            CycleCare helps you track menstrual health easily and privately. Log symptoms,
            predict periods, and access expert health guidance — all in one safe place.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center animate-fadeIn">
            <button onClick={() => setPage('signup')} className="btn-primary px-7 py-4 text-base group">
              Get Started Free
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
              className="btn-secondary px-7 py-4 text-base"
            >
              Explore Features
              <ChevronDown className="w-5 h-5" />
            </button>
          </div>

          {/* Trust mini-row */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-ink-400">
            {trustPoints.map(({ icon: Icon, text }, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <Icon className="w-3.5 h-3.5 text-pink-500" />
                <span>{text}</span>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 sm:gap-6 mt-14 max-w-2xl mx-auto">
            {[
              { num: '10K+', label: 'Active Users' },
              { num: '98%',  label: 'Prediction Accuracy' },
              { num: '4.9★', label: 'User Rating' },
            ].map((stat, i) => (
              <div key={i} className={`glass rounded-2xl p-4 sm:p-5 card-hover reveal reveal-delay-${i + 1}`}>
                <p className="text-2xl sm:text-3xl font-display font-bold gradient-text">{stat.num}</p>
                <p className="text-xs sm:text-sm text-ink-500 mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============== FEATURES ============== */}
      <section id="features" className="py-24 px-6 relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14 reveal">
            <span className="section-eyebrow"><Sparkles className="w-3.5 h-3.5" /> Features</span>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-ink-800 dark:text-white mt-3 mb-4">
              Everything you need to <span className="gradient-text">thrive</span>
            </h2>
            <p className="text-ink-500 dark:text-ink-300 text-lg max-w-2xl mx-auto">
              Comprehensive tools designed specifically for students — fast, private and beautifully simple.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map(({ icon: Icon, title, desc, color }, i) => (
              <div
                key={i}
                className={`group glass rounded-2xl p-6 card-hover reveal reveal-delay-${(i % 4) + 1} relative overflow-hidden`}
              >
                <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-gradient-to-br opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-2xl"
                     style={{ backgroundImage: `linear-gradient(135deg, var(--tw-gradient-stops))` }} />
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center mb-4 shadow-glow group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-display font-bold text-ink-800 dark:text-white text-lg mb-1.5">{title}</h3>
                <p className="text-ink-500 dark:text-ink-300 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============== HOW IT WORKS ============== */}
      <section id="how" className="py-24 px-6 relative">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14 reveal">
            <span className="section-eyebrow"><Zap className="w-3.5 h-3.5" /> Get started fast</span>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-ink-800 dark:text-white mt-3 mb-4">
              How <span className="gradient-text">CycleCare</span> works
            </h2>
            <p className="text-ink-500 dark:text-ink-300 text-lg">Get started in minutes. No complexity, just clarity.</p>
          </div>

          <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Connecting line on large screens */}
            <div className="hidden lg:block absolute left-[12%] right-[12%] top-8 h-px divider-grad" />

            {steps.map((step, i) => (
              <div key={i} className={`text-center reveal reveal-delay-${i + 1} relative`}>
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center mx-auto mb-4 shadow-glow ring-4 ring-white dark:ring-slate-900">
                  <span className="text-white font-display font-bold text-lg">{step.num}</span>
                </div>
                <h3 className="font-display font-bold text-ink-800 dark:text-white mb-1.5">{step.title}</h3>
                <p className="text-ink-500 dark:text-ink-300 text-sm">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============== TESTIMONIALS ============== */}
      <section id="testimonials" className="py-24 px-6 bg-gradient-to-b from-transparent via-white/40 to-transparent dark:via-slate-900/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14 reveal">
            <span className="section-eyebrow"><Star className="w-3.5 h-3.5" /> Real Stories</span>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-ink-800 dark:text-white mt-3 mb-4">
              Loved by <span className="gradient-text">students</span>
            </h2>
            <p className="text-ink-500 dark:text-ink-300 text-lg">What our users say after a few weeks with CycleCare.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className={`glass rounded-2xl p-6 card-hover reveal reveal-delay-${i + 1}`}>
                <div className="flex gap-0.5 mb-4">
                  {Array(t.rating).fill(0).map((_, j) => (
                    <Star key={j} className="w-4 h-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-ink-700 dark:text-ink-100 text-sm leading-relaxed mb-5">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center text-white font-display font-bold text-sm shadow-soft">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-ink-800 dark:text-white text-sm">{t.name}</p>
                    <p className="text-xs text-ink-400">Age {t.age}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============== PRIVACY / CTA BANNER ============== */}
      <section id="trust" className="py-20 px-6">
        <div className="max-w-4xl mx-auto relative overflow-hidden rounded-3xl shadow-lift reveal">
          <div className="absolute inset-0 bg-gradient-to-br from-pink-500 via-fuchsia-500 to-purple-600" />
          <div className="absolute -right-20 -top-20 w-72 h-72 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -left-12 -bottom-16 w-72 h-72 rounded-full bg-white/10 blur-2xl" />
          <div className="relative p-10 md:p-14 text-center text-white">
            <Shield className="w-14 h-14 mx-auto mb-4 animate-float" />
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-3">Your privacy is our priority</h2>
            <p className="text-pink-50/95 mb-8 max-w-xl mx-auto">
              All your health data is encrypted, private, and never shared. You are always in control.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button onClick={() => setPage('signup')} className="btn px-7 py-3.5 bg-white text-pink-600 hover:shadow-2xl hover:bg-pink-50 transition-all">
                Start your journey
                <ArrowRight className="w-4 h-4" />
              </button>
              <button onClick={() => setPage('login')} className="btn px-7 py-3.5 bg-white/15 backdrop-blur text-white border border-white/30 hover:bg-white/25 transition-all">
                I already have an account
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ============== FOOTER ============== */}
      <footer className="border-t border-pink-100 dark:border-slate-800 py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center shadow-soft">
              <Heart className="w-4 h-4 text-white" fill="white" />
            </div>
            <span className="font-display font-bold gradient-text text-lg">CycleCare</span>
          </div>
          <p className="text-ink-400 text-sm">© 2025 CycleCare. Empowering students to understand their health.</p>
          <div className="flex items-center gap-5 text-sm text-ink-500">
            <button onClick={() => setPage('privacy')} className="hover:text-pink-600">Privacy</button>
            <button onClick={() => setPage('help')}    className="hover:text-pink-600">Help</button>
          </div>
        </div>
      </footer>
    </div>
  );
};
