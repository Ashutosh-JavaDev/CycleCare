import React from 'react';
import { useApp } from '../store/AppContext';
import {
  Heart, Calendar, Activity, BookOpen, Bot, Users,
  ArrowRight, Star, Shield, ChevronDown, Sparkles
} from 'lucide-react';

const features = [
  { icon: Heart, title: 'Cycle Tracking', desc: 'Log and monitor your menstrual cycle with ease and precision.', color: 'from-pink-400 to-rose-400' },
  { icon: Activity, title: 'Symptom Logging', desc: 'Track daily symptoms, pain levels, and mood changes.', color: 'from-purple-400 to-indigo-400' },
  { icon: Calendar, title: 'Next Period Prediction', desc: 'AI-powered predictions for your upcoming cycle dates.', color: 'from-pink-400 to-purple-400' },
  { icon: BookOpen, title: 'Health Education', desc: 'Access curated articles on menstrual health and wellness.', color: 'from-violet-400 to-purple-400' },
  { icon: Bot, title: 'AI Health Assistant', desc: 'Get instant answers to your health questions 24/7.', color: 'from-pink-400 to-fuchsia-400' },
  { icon: Users, title: 'Community Support', desc: 'Connect with peers in a safe, anonymous environment.', color: 'from-purple-400 to-pink-400' },
];

const testimonials = [
  { name: 'Priya S.', age: 20, text: 'CycleCare helped me understand my body so much better. The predictions are incredibly accurate!', rating: 5 },
  { name: 'Ananya M.', age: 19, text: 'I love the community forum. Finally a safe space to discuss health topics without judgment.', rating: 5 },
  { name: 'Riya K.', age: 21, text: 'The symptom tracking helped me identify a pattern that led to my PCOS diagnosis. Life-changing app!', rating: 5 },
];

const steps = [
  { num: '01', title: 'Create Account', desc: 'Sign up securely in under 2 minutes.' },
  { num: '02', title: 'Log Your Cycle', desc: 'Enter your period start and end dates.' },
  { num: '03', title: 'Track Symptoms', desc: 'Log daily symptoms and pain levels.' },
  { num: '04', title: 'Get Insights', desc: 'Receive predictions and health tips.' },
];

export const Landing: React.FC = () => {
  const { setPage } = useApp();

  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-pink-100 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="w-7 h-7 text-pink-500" fill="currentColor" />
            <span className="font-bold text-xl gradient-text">CycleCare</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-gray-500">
            <a href="#features" className="hover:text-pink-500 transition-colors">Features</a>
            <a href="#how" className="hover:text-pink-500 transition-colors">How It Works</a>
            <a href="#testimonials" className="hover:text-pink-500 transition-colors">Reviews</a>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setPage('login')} className="px-4 py-2 text-sm text-pink-500 font-medium hover:bg-pink-50 rounded-xl transition-all">
              Login
            </button>
            <button onClick={() => setPage('signup')} className="px-4 py-2 text-sm bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-pink-200 transition-all">
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        {/* Background blobs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-pink-200/30 rounded-full blur-3xl"></div>
        <div className="absolute top-32 right-10 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-1/2 w-64 h-64 bg-pink-100/50 rounded-full blur-3xl"></div>

        <div className="max-w-4xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 bg-pink-50 border border-pink-200 text-pink-600 text-sm px-4 py-2 rounded-full mb-8 animate-fadeIn">
            <Sparkles className="w-4 h-4" />
            <span>Trusted by 10,000+ students across India</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6 leading-tight animate-fadeIn">
            Understand Your Cycle.
            <br />
            <span className="gradient-text">Take Control of Your Health.</span>
          </h1>

          <p className="text-lg text-gray-500 mb-10 max-w-2xl mx-auto animate-fadeIn">
            CycleCare helps students track menstrual health easily and privately. Log symptoms, predict periods, and access expert health guidance — all in one safe place.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fadeIn">
            <button
              onClick={() => setPage('signup')}
              className="px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-2xl font-semibold text-lg hover:shadow-xl hover:shadow-pink-200 transition-all flex items-center gap-2 justify-center group"
            >
              Get Started Free
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-4 bg-white border border-pink-200 text-gray-600 rounded-2xl font-semibold text-lg hover:bg-pink-50 transition-all flex items-center gap-2 justify-center"
            >
              Learn More
              <ChevronDown className="w-5 h-5" />
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 mt-16 max-w-2xl mx-auto">
            {[
              { num: '10K+', label: 'Active Users' },
              { num: '98%', label: 'Prediction Accuracy' },
              { num: '4.9★', label: 'User Rating' },
            ].map((stat, i) => (
              <div key={i} className="bg-white/60 backdrop-blur-sm border border-pink-100 rounded-2xl p-4 card-hover">
                <p className="text-2xl font-bold gradient-text">{stat.num}</p>
                <p className="text-sm text-gray-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-6 bg-white/40">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Everything You Need to <span className="gradient-text">Thrive</span>
            </h2>
            <p className="text-gray-500 text-lg">Comprehensive tools designed specifically for students.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(({ icon: Icon, title, desc, color }, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-pink-100 card-hover shadow-sm">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center mb-4 shadow-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-gray-800 text-lg mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how" className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              How <span className="gradient-text">CycleCare</span> Works
            </h2>
            <p className="text-gray-500 text-lg">Get started in minutes. No complexity, just clarity.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, i) => (
              <div key={i} className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <span className="text-white font-bold text-lg">{step.num}</span>
                </div>
                <h3 className="font-bold text-gray-800 mb-2">{step.title}</h3>
                <p className="text-gray-500 text-sm">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 px-6 bg-white/40">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Loved by <span className="gradient-text">Students</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-pink-100 card-hover shadow-sm">
                <div className="flex gap-1 mb-4">
                  {Array(t.rating).fill(0).map((_, j) => (
                    <Star key={j} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">"{t.text}"</p>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-400 to-purple-400 flex items-center justify-center text-white text-xs font-bold">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">{t.name}</p>
                    <p className="text-xs text-gray-400">Age {t.age}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Privacy Banner */}
      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto bg-gradient-to-r from-pink-500 to-purple-500 rounded-3xl p-10 text-center shadow-2xl shadow-pink-200">
          <Shield className="w-14 h-14 text-white mx-auto mb-4 animate-float" />
          <h2 className="text-3xl font-bold text-white mb-3">Your Privacy is Our Priority</h2>
          <p className="text-pink-100 mb-8">All your health data is encrypted, private, and never shared. You are always in control.</p>
          <button
            onClick={() => setPage('signup')}
            className="px-8 py-4 bg-white text-pink-500 rounded-2xl font-bold text-lg hover:shadow-xl transition-all"
          >
            Start Your Journey 🌸
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white/60 border-t border-pink-100 py-10 px-6 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Heart className="w-5 h-5 text-pink-500" fill="currentColor" />
          <span className="font-bold gradient-text text-lg">CycleCare</span>
        </div>
        <p className="text-gray-400 text-sm">© 2025 CycleCare. Empowering students to understand their health. 🌸</p>
        <p className="text-gray-300 text-xs mt-2">Made with love for student wellness</p>
      </footer>
    </div>
  );
};
