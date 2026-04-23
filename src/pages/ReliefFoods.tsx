import React, { useEffect, useMemo, useState } from 'react';
import { useScrollReveal } from '../hooks/useScrollReveal';
import {
  ArrowLeft, ArrowRight, Search, Sparkles, Heart, Leaf, Droplets, Apple, Flame,
  CheckCircle2, AlertTriangle, Clock, CalendarDays, CalendarRange, CalendarCheck,
  TrendingUp, Sun, Moon, Coffee, Shield,
} from 'lucide-react';

/* =================================================================
   DATA — 8 foods with rich detail content + Unsplash hero images
================================================================= */

type Category = 'Iron-Rich' | 'Anti-Inflammatory' | 'Magnesium-Rich' | 'Hydration';
type Tag = 'Joint Pain' | 'Headache' | 'Muscle Pain' | 'Cramps' | 'Bloating' | 'Fatigue' | 'Mood';

interface Timeline {
  weekly:    { effects: string[]; precautions?: string };
  monthly:   { effects: string[]; precautions?: string };
  sixMonth:  { effects: string[]; precautions?: string };
  yearly:    { effects: string[]; precautions?: string };
}

interface Food {
  id: string;
  name: string;
  category: Category;
  tags: Tag[];
  short: string;
  benefits: string[];
  intro: string;
  detailedBenefits: { icon: React.ComponentType<{ className?: string }>; title: string; desc: string }[];
  timeline: Timeline;
  dailyIntake: string;
  bestTime: string;
  avoidIf: string[];
  image: string;
  accent: string; // tailwind gradient classes
}

const FOODS: Food[] = [
  {
    id: 'turmeric',
    name: 'Turmeric',
    category: 'Anti-Inflammatory',
    tags: ['Cramps', 'Joint Pain', 'Muscle Pain'],
    short: 'A golden spice rich in curcumin — a natural anti-inflammatory used for centuries.',
    benefits: ['Reduces inflammation', 'Eases period cramps', 'Boosts immunity'],
    intro: 'Turmeric (Curcuma longa) is the warm, earthy yellow root that powers Indian kitchens. Its active compound, curcumin, is a potent anti-inflammatory and antioxidant that helps soothe period cramps, joint stiffness and digestive discomfort.',
    detailedBenefits: [
      { icon: Flame,  title: 'Eases Cramps',          desc: 'Curcumin reduces prostaglandins, the chemicals that trigger menstrual pain.' },
      { icon: Shield, title: 'Strong Antioxidant',    desc: 'Neutralizes free radicals and supports immune function during your cycle.' },
      { icon: Leaf,   title: 'Joint & Muscle Relief', desc: 'Reduces stiffness in joints and aids muscle recovery after exercise.' },
      { icon: Heart,  title: 'Mood Support',          desc: 'May lift PMS-related low mood through its effect on serotonin pathways.' },
    ],
    timeline: {
      weekly:   { effects: ['Reduced bloating after meals', 'Lighter feeling in the gut', 'Slightly warmer body temperature'], precautions: 'Take with black pepper for better absorption.' },
      monthly:  { effects: ['Noticeably lighter cramps', 'Calmer skin (less redness/breakouts)', 'Better digestion overall'] },
      sixMonth: { effects: ['Reduced joint stiffness', 'Stable PMS symptoms', 'Stronger immune response — fewer colds'] },
      yearly:   { effects: ['Long-term anti-inflammatory protection', 'Healthier skin & hair', 'Better cardiovascular markers'], precautions: 'Take periodic breaks; avoid mega-doses.' },
    },
    dailyIntake: '½ – 1 tsp (about 1–3 g) with food',
    bestTime: 'With warm milk or food at night',
    avoidIf: ['You take blood thinners', 'You have gallstones', 'You are scheduled for surgery within 2 weeks'],
    image: 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?auto=format&fit=crop&w=1200&q=70',
    accent: 'from-amber-400 to-orange-500',
  },
  {
    id: 'ginger',
    name: 'Ginger',
    category: 'Anti-Inflammatory',
    tags: ['Cramps', 'Bloating', 'Headache'],
    short: 'A warming root that soothes nausea, eases cramps and calms the digestive system.',
    benefits: ['Reduces cramp pain', 'Calms nausea', 'Improves digestion'],
    intro: 'Ginger has been used for thousands of years as a natural remedy for pain and nausea. Studies suggest 250 mg of ginger taken 4 times a day can be as effective as common pain relievers for period cramps.',
    detailedBenefits: [
      { icon: Flame,   title: 'Pain Relief',     desc: 'Blocks prostaglandins similar to NSAIDs, easing cramp intensity.' },
      { icon: Leaf,    title: 'Anti-Nausea',     desc: 'Calms the stomach and reduces period-related nausea or motion sickness.' },
      { icon: Heart,   title: 'Improves Circulation', desc: 'Warms the body and supports healthy blood flow to the pelvis.' },
      { icon: Droplets,title: 'Aids Digestion',  desc: 'Reduces bloating and supports gut motility during your cycle.' },
    ],
    timeline: {
      weekly:   { effects: ['Less nausea', 'Warmer hands and feet', 'Reduced morning bloating'] },
      monthly:  { effects: ['Noticeably milder cramps', 'Improved digestion', 'Less PMS-related fatigue'] },
      sixMonth: { effects: ['More regular cycle comfort', 'Improved cold tolerance', 'Better overall gut health'] },
      yearly:   { effects: ['Long-term anti-inflammatory benefits', 'Stable digestive health', 'Reduced reliance on painkillers'], precautions: 'Excessive intake may cause heartburn.' },
    },
    dailyIntake: '1–4 g fresh root or 1 cup ginger tea',
    bestTime: 'Morning or before meals',
    avoidIf: ['You take blood thinners', 'You have severe heartburn', 'You are in late pregnancy without doctor advice'],
    image: 'https://images.unsplash.com/photo-1615484477778-ca3b77940c25?auto=format&fit=crop&w=1200&q=70',
    accent: 'from-orange-400 to-rose-500',
  },
  {
    id: 'spinach',
    name: 'Spinach',
    category: 'Iron-Rich',
    tags: ['Fatigue', 'Cramps'],
    short: 'A leafy green packed with iron, magnesium and folate to fight period fatigue.',
    benefits: ['Replenishes lost iron', 'Boosts energy', 'High in magnesium'],
    intro: 'Spinach is a nutritional powerhouse for menstruating people. It restores the iron lost through bleeding while delivering magnesium, calcium and antioxidants that support every system in your body.',
    detailedBenefits: [
      { icon: Heart,   title: 'Iron Replenishment', desc: 'Restores iron levels that drop during menstruation, fighting fatigue.' },
      { icon: Sparkles,title: 'Folate-Rich',        desc: 'Supports healthy red blood cell production and hormone balance.' },
      { icon: Leaf,    title: 'Magnesium Boost',    desc: 'Eases muscle cramps and supports nerve relaxation.' },
      { icon: Shield,  title: 'Antioxidant Power',  desc: 'Protects cells from oxidative stress during hormonal shifts.' },
    ],
    timeline: {
      weekly:   { effects: ['More steady energy throughout the day', 'Less mid-cycle fatigue', 'Brighter skin tone'] },
      monthly:  { effects: ['Improved iron levels (clinically measurable)', 'Reduced light-headedness', 'Stronger nails and hair'] },
      sixMonth: { effects: ['Healthier hemoglobin', 'Reduced anemia risk', 'Better post-period recovery'] },
      yearly:   { effects: ['Significantly improved iron stores (ferritin)', 'Stronger bones (vitamin K)', 'Long-term energy stability'], precautions: 'Pair with vitamin C foods for best iron absorption.' },
    },
    dailyIntake: '1–2 cups raw or ½ cup cooked',
    bestTime: 'Lunch or dinner with citrus dressing',
    avoidIf: ['You have kidney stones (oxalates)', 'You take blood thinners (high vitamin K)'],
    image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=1200&q=70',
    accent: 'from-emerald-400 to-green-600',
  },
  {
    id: 'bananas',
    name: 'Bananas',
    category: 'Magnesium-Rich',
    tags: ['Cramps', 'Bloating', 'Mood'],
    short: 'A pocket-sized source of potassium, magnesium and B6 to fight bloating and mood dips.',
    benefits: ['Reduces bloating', 'Eases cramps', 'Lifts mood (B6)'],
    intro: 'Bananas are the most convenient PMS food. Rich in potassium, magnesium and vitamin B6, they reduce water retention, ease muscle cramps and help regulate mood swings caused by hormonal changes.',
    detailedBenefits: [
      { icon: Droplets, title: 'Reduces Bloating', desc: 'Potassium balances sodium levels to flush out excess water weight.' },
      { icon: Leaf,     title: 'Muscle Relaxation',desc: 'Magnesium soothes uterine muscle contractions and back tension.' },
      { icon: Heart,    title: 'Mood Stabilizer',  desc: 'Vitamin B6 supports serotonin production, easing PMS irritability.' },
      { icon: Flame,    title: 'Quick Energy',     desc: 'Natural sugars and complex carbs provide sustained, steady energy.' },
    ],
    timeline: {
      weekly:   { effects: ['Less puffiness in face & ankles', 'Steadier mood', 'Better sleep quality'] },
      monthly:  { effects: ['Reduced PMS irritability', 'Less period-day bloating', 'More regular digestion'] },
      sixMonth: { effects: ['Stable mood patterns', 'Better workout recovery', 'Heart-healthy potassium levels'] },
      yearly:   { effects: ['Long-term cardiovascular benefits', 'Improved gut health', 'Stable weight from less water retention'] },
    },
    dailyIntake: '1–2 medium bananas',
    bestTime: 'Pre-workout or 3pm energy dip',
    avoidIf: ['You have a latex allergy (rare cross-reactivity)', 'You have advanced kidney disease'],
    image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=1200&q=70',
    accent: 'from-yellow-400 to-amber-500',
  },
  {
    id: 'dark-chocolate',
    name: 'Dark Chocolate',
    category: 'Magnesium-Rich',
    tags: ['Cramps', 'Mood', 'Fatigue'],
    short: 'A guilt-free treat — high in magnesium and antioxidants that ease cramps and lift mood.',
    benefits: ['Boosts mood', 'Eases cramps', 'Rich in antioxidants'],
    intro: 'Dark chocolate (70%+ cacao) is one of the richest natural sources of magnesium — perfect for PMS. It releases serotonin and endorphins, naturally lifting mood while easing the muscular tension behind cramps.',
    detailedBenefits: [
      { icon: Heart,    title: 'Mood Boost',         desc: 'Triggers serotonin and endorphin release, easing PMS lows.' },
      { icon: Leaf,     title: 'Magnesium-Rich',     desc: 'One square delivers up to 16% of your daily magnesium needs.' },
      { icon: Shield,   title: 'Powerful Antioxidants',desc: 'Flavanols protect cells and support healthy circulation.' },
      { icon: Sparkles, title: 'Reduces Cravings',   desc: 'Satisfies sweet cravings without the sugar crash of milk chocolate.' },
    ],
    timeline: {
      weekly:   { effects: ['Improved mood during PMS days', 'Fewer sugar cravings', 'Better focus'] },
      monthly:  { effects: ['Lighter cramps', 'More stable energy', 'Less PMS-related anxiety'] },
      sixMonth: { effects: ['Improved heart health markers', 'Better blood pressure regulation', 'Healthier skin'] },
      yearly:   { effects: ['Long-term cardiovascular protection', 'Reduced inflammation', 'Better cholesterol balance'], precautions: 'Stick to small portions — high in calories.' },
    },
    dailyIntake: '20–30 g (1–2 small squares)',
    bestTime: 'Afternoon or after dinner',
    avoidIf: ['You are sensitive to caffeine', 'You have GERD or acid reflux', 'You have a milk allergy (check label)'],
    image: 'https://images.unsplash.com/photo-1623660053975-cf75a8be0908?auto=format&fit=crop&w=1200&q=70',
    accent: 'from-amber-700 to-stone-800',
  },
  {
    id: 'green-tea',
    name: 'Green Tea',
    category: 'Hydration',
    tags: ['Bloating', 'Headache', 'Fatigue'],
    short: 'A soothing antioxidant-rich brew that calms cramps, reduces bloating and lifts focus.',
    benefits: ['Reduces bloating', 'Calms cramps', 'Antioxidant-rich'],
    intro: 'Green tea contains EGCG, one of the most studied antioxidants. Studies show regular green tea drinkers report significantly lower period pain. It hydrates, eases bloating and provides gentle, sustained energy without coffee jitters.',
    detailedBenefits: [
      { icon: Droplets, title: 'Hydration + Antioxidants',desc: 'Hydrates while delivering catechins that fight inflammation.' },
      { icon: Flame,    title: 'Eases Cramps',          desc: 'Polyphenols reduce inflammation linked to period pain.' },
      { icon: Sparkles, title: 'Gentle Energy',         desc: 'L-theanine + small caffeine for calm, focused energy.' },
      { icon: Leaf,     title: 'Reduces Bloating',      desc: 'Mild diuretic effect helps flush retained water comfortably.' },
    ],
    timeline: {
      weekly:   { effects: ['Reduced morning bloating', 'Better mental focus', 'Fresher breath'] },
      monthly:  { effects: ['Lighter cramps', 'Improved skin clarity', 'Steadier energy'] },
      sixMonth: { effects: ['Better metabolic markers', 'Improved cholesterol', 'Lower inflammation overall'] },
      yearly:   { effects: ['Long-term cardiovascular benefits', 'Better cognitive function', 'Reduced cancer risk markers'], precautions: 'Avoid drinking with iron-rich meals (reduces iron absorption).' },
    },
    dailyIntake: '2–3 cups',
    bestTime: 'Morning and early afternoon',
    avoidIf: ['You are caffeine-sensitive', 'You have iron-deficiency anemia (drink between meals)', 'You take certain heart medications'],
    image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=1200&q=70',
    accent: 'from-emerald-400 to-teal-500',
  },
  {
    id: 'avocado',
    name: 'Avocado',
    category: 'Magnesium-Rich',
    tags: ['Cramps', 'Mood'],
    short: 'A creamy fruit packed with healthy fats and magnesium for whole-body comfort.',
    benefits: ['Healthy fats', 'Magnesium-rich', 'Hormone-friendly'],
    intro: 'Avocado is one of the few fruits rich in healthy monounsaturated fats — essential for hormone production. Its magnesium and potassium content makes it a perfect PMS food for cramps, mood and skin health.',
    detailedBenefits: [
      { icon: Heart,    title: 'Hormone Support', desc: 'Healthy fats are building blocks for balanced hormone production.' },
      { icon: Leaf,     title: 'Cramp Relief',    desc: 'Magnesium relaxes uterine muscles and eases tension.' },
      { icon: Sparkles, title: 'Glowing Skin',    desc: 'Vitamin E and healthy fats nourish skin from within.' },
      { icon: Shield,   title: 'Anti-Inflammatory',desc: 'Reduces inflammation throughout the body, including the gut.' },
    ],
    timeline: {
      weekly:   { effects: ['Smoother skin', 'Better satiety after meals', 'More stable blood sugar'] },
      monthly:  { effects: ['Less PMS irritability', 'Reduced cramp intensity', 'Healthier hair shine'] },
      sixMonth: { effects: ['Improved cholesterol profile', 'Better hormone balance', 'Stable energy'] },
      yearly:   { effects: ['Long-term heart health', 'Stronger immune system', 'Better skin elasticity'] },
    },
    dailyIntake: '½ – 1 medium avocado',
    bestTime: 'Lunch or breakfast',
    avoidIf: ['You have a latex allergy', 'You are watching calories closely (it\'s calorie-dense)'],
    image: 'https://images.unsplash.com/photo-1601039641847-7857b994d704?auto=format&fit=crop&w=1200&q=70',
    accent: 'from-lime-400 to-green-600',
  },
  {
    id: 'coconut-water',
    name: 'Coconut Water',
    category: 'Hydration',
    tags: ['Bloating', 'Fatigue', 'Cramps'],
    short: 'Nature\'s sports drink — rich in electrolytes that fight fatigue and bloating.',
    benefits: ['Natural electrolytes', 'Fights fatigue', 'Reduces bloating'],
    intro: 'Coconut water replenishes electrolytes lost during your period — potassium, magnesium, sodium and calcium. It hydrates more effectively than plain water and helps reduce bloating without added sugar.',
    detailedBenefits: [
      { icon: Droplets, title: 'Superior Hydration',desc: 'Electrolyte profile matches what your body loses during your cycle.' },
      { icon: Flame,    title: 'Fights Fatigue',    desc: 'Potassium and magnesium combat the tiredness of menstruation.' },
      { icon: Leaf,     title: 'Eases Bloating',    desc: 'Helps balance sodium and reduce uncomfortable water retention.' },
      { icon: Heart,    title: 'Heart-Friendly',    desc: 'Supports healthy blood pressure and cardiovascular function.' },
    ],
    timeline: {
      weekly:   { effects: ['Reduced thirst', 'More energy on heavy flow days', 'Less bloating'] },
      monthly:  { effects: ['Better workout recovery', 'Stable skin hydration', 'Easier period mornings'] },
      sixMonth: { effects: ['Improved kidney function', 'Stable electrolyte balance', 'Better digestive health'] },
      yearly:   { effects: ['Long-term hydration habits', 'Healthier blood pressure', 'Reduced sugary drink intake'], precautions: 'Choose unsweetened versions only.' },
    },
    dailyIntake: '1 glass (250 ml)',
    bestTime: 'After exercise or first thing in the morning',
    avoidIf: ['You have kidney disease (high potassium)', 'You are on potassium-sparing medications'],
    image: 'https://images.unsplash.com/photo-1581006852262-e4307cf6283a?auto=format&fit=crop&w=1200&q=70',
    accent: 'from-sky-400 to-cyan-500',
  },
];

const CATEGORY_FILTERS: { key: 'All' | Category; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { key: 'All',                label: 'All Foods',         icon: Sparkles },
  { key: 'Anti-Inflammatory',  label: 'Anti-Inflammatory', icon: Flame },
  { key: 'Iron-Rich',          label: 'Iron-Rich',         icon: Heart },
  { key: 'Magnesium-Rich',     label: 'Magnesium-Rich',    icon: Leaf },
  { key: 'Hydration',          label: 'Hydration',         icon: Droplets },
];

/* =================================================================
   COMPONENT — main page + detail page
================================================================= */

export const ReliefFoods: React.FC = () => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<'All' | Category>('All');
  const [search, setSearch] = useState('');

  useScrollReveal([selectedId, filter, search]);

  // Scroll to top whenever the view changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [selectedId]);

  const selected = useMemo(() => FOODS.find(f => f.id === selectedId) ?? null, [selectedId]);

  const visibleFoods = useMemo(() => {
    return FOODS.filter(f => {
      if (filter !== 'All' && f.category !== filter) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        return f.name.toLowerCase().includes(q)
          || f.short.toLowerCase().includes(q)
          || f.tags.some(t => t.toLowerCase().includes(q));
      }
      return true;
    });
  }, [filter, search]);

  if (selected) {
    return <FoodDetail food={selected} onBack={() => setSelectedId(null)} />;
  }

  return (
    <div className="min-h-screen pb-20">
      {/* ============== HERO ============== */}
      <section className="relative px-6 pt-10 pb-14 overflow-hidden">
        <div className="absolute -top-10 -left-10 w-72 h-72 bg-emerald-300/25 rounded-full blur-3xl animate-blob" />
        <div className="absolute top-10 -right-10 w-80 h-80 bg-pink-300/25 rounded-full blur-3xl animate-blob" style={{ animationDelay: '5s' }} />

        <div className="relative max-w-6xl mx-auto text-center">
          <span className="section-eyebrow"><Leaf className="w-3.5 h-3.5" /> Natural & Doctor-Reviewed</span>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-ink-800 dark:text-white mt-3 mb-4">
            Natural Pain Relief <span className="gradient-text">Solutions</span>
          </h1>
          <p className="text-ink-500 dark:text-ink-300 text-lg max-w-2xl mx-auto leading-relaxed">
            Whole foods that help with cramps, bloating, fatigue and mood — backed by research and tradition.
            Tap any card to see its full benefits and a long-term consumption timeline.
          </p>

          {/* Search */}
          <div className="mt-8 max-w-md mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search foods, symptoms or benefits..."
              className="input pl-11"
            />
          </div>

          {/* Filter chips */}
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
            {CATEGORY_FILTERS.map(({ key, label, icon: Icon }) => {
              const active = filter === key;
              return (
                <button
                  key={key}
                  onClick={() => setFilter(key)}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    active
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-glow'
                      : 'glass text-ink-600 hover:text-emerald-600 hover:scale-105'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============== CARD GRID ============== */}
      <section className="px-6">
        <div className="max-w-6xl mx-auto">
          {visibleFoods.length === 0 ? (
            <div className="text-center py-20 reveal">
              <div className="inline-flex w-16 h-16 rounded-full bg-pink-50 items-center justify-center mb-3">
                <Search className="w-7 h-7 text-pink-400" />
              </div>
              <p className="text-ink-500">No foods match your search. Try a different term or filter.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {visibleFoods.map((food, i) => (
                <FoodCard
                  key={food.id}
                  food={food}
                  delayIdx={i % 4}
                  onOpen={() => setSelectedId(food.id)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ============== CTA BANNER ============== */}
      <section className="px-6 mt-16">
        <div className="max-w-4xl mx-auto relative overflow-hidden rounded-3xl shadow-lift reveal">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 via-teal-500 to-sky-500" />
          <div className="absolute -right-20 -top-20 w-72 h-72 rounded-full bg-white/10 blur-2xl" />
          <div className="relative p-10 text-center text-white">
            <Apple className="w-12 h-12 mx-auto mb-4 animate-float" />
            <h2 className="font-display text-3xl font-bold mb-2">Start a healthy routine</h2>
            <p className="text-emerald-50/95 mb-6 max-w-xl mx-auto">
              Pick 2–3 foods from above and add them to your weekly grocery list. Small steps lead to big changes.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

/* =================================================================
   FOOD CARD
================================================================= */

const FoodCard: React.FC<{ food: Food; onOpen: () => void; delayIdx: number }> = ({ food, onOpen, delayIdx }) => (
  <article
    className={`group glass rounded-3xl overflow-hidden card-hover reveal reveal-delay-${(delayIdx % 4) + 1} flex flex-col`}
  >
    {/* Image */}
    <div className="relative h-44 overflow-hidden">
      <img
        src={food.image}
        alt={food.name}
        loading="lazy"
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
      <div className={`absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] font-semibold text-white bg-gradient-to-r ${food.accent} shadow-soft uppercase tracking-wide`}>
        {food.category}
      </div>
    </div>

    {/* Body */}
    <div className="p-5 flex-1 flex flex-col">
      <h3 className="font-display text-xl font-bold text-ink-800 dark:text-white">{food.name}</h3>
      <p className="text-sm text-ink-500 dark:text-ink-300 mt-1.5 leading-relaxed line-clamp-2">{food.short}</p>

      {/* Benefits */}
      <ul className="mt-4 space-y-1.5">
        {food.benefits.map(b => (
          <li key={b} className="flex items-start gap-2 text-sm text-ink-600 dark:text-ink-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
            <span>{b}</span>
          </li>
        ))}
      </ul>

      {/* Tags */}
      <div className="mt-4 flex flex-wrap gap-1.5">
        {food.tags.slice(0, 2).map(t => (
          <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-pink-50 text-pink-600 border border-pink-100 dark:bg-pink-900/30 dark:text-pink-200 dark:border-pink-800/40">
            {t}
          </span>
        ))}
      </div>

      <button
        onClick={onOpen}
        className="mt-5 inline-flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-sm font-semibold hover:shadow-glow group/btn transition-all"
      >
        Learn More
        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
      </button>
    </div>
  </article>
);

/* =================================================================
   FOOD DETAIL PAGE
================================================================= */

const FoodDetail: React.FC<{ food: Food; onBack: () => void }> = ({ food, onBack }) => {
  useScrollReveal([food.id]);

  const timelineSections: { key: keyof Timeline; title: string; icon: React.ComponentType<{ className?: string }>; gradient: string }[] = [
    { key: 'weekly',   title: 'After 1 Week',   icon: Clock,         gradient: 'from-pink-500 to-rose-500' },
    { key: 'monthly',  title: 'After 1 Month',  icon: CalendarDays,  gradient: 'from-purple-500 to-fuchsia-500' },
    { key: 'sixMonth', title: 'After 6 Months', icon: CalendarRange, gradient: 'from-emerald-500 to-teal-500' },
    { key: 'yearly',   title: 'After 1 Year',   icon: CalendarCheck, gradient: 'from-sky-500 to-blue-500' },
  ];

  return (
    <div className="min-h-screen pb-20">
      {/* ============== HERO BANNER ============== */}
      <section className="relative">
        <div className="relative h-72 md:h-96 overflow-hidden">
          <img src={food.image} alt={food.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/20" />
          <div className={`absolute inset-0 bg-gradient-to-br ${food.accent} opacity-20 mix-blend-overlay`} />

          {/* Back button */}
          <button
            onClick={onBack}
            className="absolute top-6 left-6 inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-ink-700 dark:text-white text-sm font-medium hover:bg-white/90 dark:hover:bg-slate-800/90 transition-all shadow-soft"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Foods
          </button>

          <div className="absolute inset-x-0 bottom-0 px-6 pb-8 max-w-5xl mx-auto">
            <div className={`inline-block px-3 py-1 rounded-full text-[11px] font-semibold text-white bg-gradient-to-r ${food.accent} shadow-glow uppercase tracking-wide mb-3`}>
              {food.category}
            </div>
            <h1 className="font-display text-4xl md:text-6xl font-bold text-white drop-shadow">{food.name}</h1>
            <p className="text-white/90 mt-3 max-w-2xl text-base md:text-lg drop-shadow">{food.short}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {food.tags.map(t => (
                <span key={t} className="text-xs px-3 py-1 rounded-full bg-white/20 backdrop-blur text-white border border-white/30">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============== INTRO ============== */}
      <section className="px-6 mt-10">
        <div className="max-w-4xl mx-auto reveal">
          <p className="text-lg text-ink-700 dark:text-ink-100 leading-relaxed">{food.intro}</p>
        </div>
      </section>

      {/* ============== BENEFITS ============== */}
      <section className="px-6 mt-12">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8 reveal">
            <span className="section-eyebrow"><Heart className="w-3.5 h-3.5" /> Health Benefits</span>
            <h2 className="font-display text-3xl font-bold text-ink-800 dark:text-white mt-3">
              Why <span className="gradient-text">{food.name}</span> works
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {food.detailedBenefits.map(({ icon: Icon, title, desc }, i) => (
              <div
                key={title}
                className={`glass rounded-2xl p-6 card-hover reveal reveal-delay-${(i % 4) + 1} flex gap-4`}
              >
                <div className={`flex-shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br ${food.accent} flex items-center justify-center shadow-glow`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-ink-800 dark:text-white mb-1">{title}</h3>
                  <p className="text-sm text-ink-500 dark:text-ink-300 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============== TIMELINE ============== */}
      <section className="px-6 mt-16">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10 reveal">
            <span className="section-eyebrow"><TrendingUp className="w-3.5 h-3.5" /> Consumption Timeline</span>
            <h2 className="font-display text-3xl font-bold text-ink-800 dark:text-white mt-3">
              What to expect over time
            </h2>
            <p className="text-ink-500 dark:text-ink-300 mt-2 max-w-2xl mx-auto">
              Consistency is key. Here's how regular consumption of {food.name.toLowerCase()} can change your body.
            </p>
          </div>

          <div className="relative">
            {/* Vertical timeline line */}
            <div className="hidden md:block absolute left-[47px] top-4 bottom-4 w-0.5 bg-gradient-to-b from-pink-300 via-purple-300 to-sky-300" />

            <div className="space-y-6">
              {timelineSections.map(({ key, title, icon: Icon, gradient }, idx) => {
                const data = food.timeline[key];
                return (
                  <div key={key} className={`relative flex gap-4 md:gap-6 reveal reveal-delay-${(idx % 4) + 1}`}>
                    {/* Icon */}
                    <div className="flex-shrink-0">
                      <div className={`w-24 h-24 rounded-2xl bg-gradient-to-br ${gradient} flex flex-col items-center justify-center text-white shadow-glow`}>
                        <Icon className="w-7 h-7" />
                        <span className="text-[10px] mt-1 font-semibold uppercase tracking-wider opacity-90">Stage {idx + 1}</span>
                      </div>
                    </div>

                    {/* Content card */}
                    <div className="flex-1 glass rounded-2xl p-6 shadow-card">
                      <h3 className="font-display text-xl font-bold text-ink-800 dark:text-white mb-3">{title}</h3>
                      <ul className="space-y-2">
                        {data.effects.map(eff => (
                          <li key={eff} className="flex items-start gap-2 text-sm text-ink-600 dark:text-ink-200">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                            <span>{eff}</span>
                          </li>
                        ))}
                      </ul>
                      {data.precautions && (
                        <div className="mt-4 flex items-start gap-2 p-3 rounded-xl bg-amber-50 border border-amber-200 dark:bg-amber-950/30 dark:border-amber-900">
                          <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                          <p className="text-xs text-amber-700 dark:text-amber-200">{data.precautions}</p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ============== SAFETY & TIPS ============== */}
      <section className="px-6 mt-16">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8 reveal">
            <span className="section-eyebrow"><Shield className="w-3.5 h-3.5" /> Safety & Tips</span>
            <h2 className="font-display text-3xl font-bold text-ink-800 dark:text-white mt-3">
              How to use {food.name.toLowerCase()} safely
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Daily intake */}
            <div className="glass rounded-2xl p-6 card-hover reveal reveal-delay-1">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-soft mb-4">
                <Apple className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-display font-bold text-ink-800 dark:text-white mb-1">Recommended Daily Intake</h3>
              <p className="text-sm text-ink-600 dark:text-ink-200 leading-relaxed">{food.dailyIntake}</p>
            </div>

            {/* Best time */}
            <div className="glass rounded-2xl p-6 card-hover reveal reveal-delay-2">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center shadow-soft mb-4">
                {food.bestTime.toLowerCase().includes('morning') ? <Sun className="w-5 h-5 text-white" />
                  : food.bestTime.toLowerCase().includes('night') ? <Moon className="w-5 h-5 text-white" />
                  : <Coffee className="w-5 h-5 text-white" />}
              </div>
              <h3 className="font-display font-bold text-ink-800 dark:text-white mb-1">Best Time to Consume</h3>
              <p className="text-sm text-ink-600 dark:text-ink-200 leading-relaxed">{food.bestTime}</p>
            </div>

            {/* Avoid if */}
            <div className="rounded-2xl p-6 card-hover reveal reveal-delay-3 bg-rose-50 border border-rose-200 dark:bg-rose-950/30 dark:border-rose-900">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-rose-500 to-red-500 flex items-center justify-center shadow-soft mb-4">
                <AlertTriangle className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-display font-bold text-rose-700 dark:text-rose-200 mb-2">Who Should Avoid It</h3>
              <ul className="text-sm text-rose-700/90 dark:text-rose-200/90 space-y-1">
                {food.avoidIf.map(a => (
                  <li key={a} className="flex items-start gap-1.5">
                    <span className="text-rose-500 mt-0.5">•</span><span>{a}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ============== BACK / CTA ============== */}
      <section className="px-6 mt-16">
        <div className="max-w-3xl mx-auto text-center reveal">
          <button
            onClick={onBack}
            className="btn-secondary px-7 py-3.5"
          >
            <ArrowLeft className="w-4 h-4" /> Explore More Foods
          </button>
        </div>
      </section>
    </div>
  );
};
