import React, { useState } from 'react';
import { BookOpen, Search, ChevronRight, Clock, Heart, Leaf, Dumbbell, Salad, AlertCircle } from 'lucide-react';

const categories = [
  { id: 'all', label: 'All Topics', icon: BookOpen },
  { id: 'basics', label: 'Cycle Basics', icon: Heart },
  { id: 'hygiene', label: 'Hygiene Tips', icon: Leaf },
  { id: 'exercise', label: 'Exercise', icon: Dumbbell },
  { id: 'diet', label: 'Healthy Diet', icon: Salad },
  { id: 'pcos', label: 'PCOS Awareness', icon: AlertCircle },
];

const articles = [
  {
    id: 1, category: 'basics', title: 'Understanding Your Menstrual Cycle',
    excerpt: 'Learn about the four phases of your cycle — menstruation, follicular, ovulation, and luteal — and how they affect your body and mood.',
    readTime: '5 min', tag: 'Essential', color: 'from-pink-400 to-rose-400',
    content: `The menstrual cycle is a monthly process that prepares the body for pregnancy. It typically lasts 21–35 days and has four distinct phases:

1. **Menstruation (Days 1–5)**: The uterine lining sheds, causing your period. Hormones are at their lowest.

2. **Follicular Phase (Days 1–13)**: Estrogen rises as follicles develop in your ovaries. You may feel more energetic.

3. **Ovulation (Day 14)**: A mature egg is released. This is your most fertile time.

4. **Luteal Phase (Days 15–28)**: Progesterone rises to prepare for possible pregnancy. PMS symptoms may appear.

Understanding these phases helps you predict your mood, energy levels, and physical changes throughout the month.`
  },
  {
    id: 2, category: 'hygiene', title: 'Menstrual Hygiene: Best Practices',
    excerpt: 'A comprehensive guide to staying clean, comfortable, and infection-free during your period with practical tips for students.',
    readTime: '4 min', tag: 'Practical', color: 'from-purple-400 to-indigo-400',
    content: `Good menstrual hygiene is essential for your health and comfort. Here are key practices:

**Change products regularly**: Pads every 4–6 hours, tampons every 4–8 hours, menstrual cups every 8–12 hours.

**Wash hands**: Always wash before and after changing products.

**Clean your intimate area**: Use warm water only — no harsh soaps inside the vagina.

**Choose breathable underwear**: Cotton underwear helps prevent moisture buildup.

**Dispose properly**: Wrap used products and dispose in a bin, never flush them.

**Stay dry**: Change promptly after swimming or exercise.

**Consider sustainable options**: Menstrual cups and reusable pads are eco-friendly alternatives.`
  },
  {
    id: 3, category: 'exercise', title: 'Best Exercises During Your Period',
    excerpt: 'Light exercise can actually relieve cramps and boost mood during your period. Discover which exercises work best for each phase.',
    readTime: '6 min', tag: 'Wellness', color: 'from-teal-400 to-cyan-400',
    content: `Exercise during your period can significantly reduce pain and improve mood through endorphin release.

**During Menstruation (Days 1–5)**:
- Light yoga and stretching
- Walking (30 minutes)
- Swimming (warm water is soothing)
- Avoid intense HIIT workouts

**During Follicular Phase (Days 6–13)**:
- Great time for intense workouts
- Strength training
- Running and cardio

**During Ovulation (Day 14)**:
- Peak energy — try your hardest workouts!
- Group fitness classes
- Competitive sports

**During Luteal Phase (Days 15–28)**:
- Moderate cardio
- Pilates
- Light strength training

**Exercises to avoid during heavy flow**: Heavy weightlifting, inverted yoga poses.`
  },
  {
    id: 4, category: 'diet', title: 'Foods That Help During Your Period',
    excerpt: 'What you eat significantly impacts your cycle and symptoms. Discover the best foods to eat and avoid for a more comfortable period.',
    readTime: '5 min', tag: 'Nutrition', color: 'from-green-400 to-teal-400',
    content: `Your diet plays a crucial role in managing menstrual symptoms.

**Foods TO eat**:
- 🥬 **Leafy greens** (spinach, kale): High in iron and magnesium
- 🐟 **Fatty fish** (salmon, sardines): Omega-3s reduce inflammation
- 🍫 **Dark chocolate** (70%+): Magnesium and mood boost
- 🍌 **Bananas**: Potassium reduces bloating
- 🫚 **Ginger tea**: Natural pain reliever
- 🫐 **Berries**: Antioxidants and vitamins
- 💧 **Water**: Reduces bloating and headaches

**Foods to LIMIT**:
- ☕ Caffeine (increases anxiety and cramps)
- 🧂 Salty foods (cause bloating)
- 🍬 Refined sugars (worsen mood swings)
- 🍺 Alcohol (dehydrating and worsens cramps)

**Supplements to consider** (consult a doctor):
- Magnesium, Vitamin D, Iron, Omega-3`
  },
  {
    id: 5, category: 'pcos', title: 'Understanding PCOS: Signs & Management',
    excerpt: 'Polycystic Ovary Syndrome affects 1 in 10 women. Learn the signs, symptoms, and how to manage this common condition.',
    readTime: '8 min', tag: 'Important', color: 'from-orange-400 to-pink-400',
    content: `PCOS (Polycystic Ovary Syndrome) is a hormonal disorder affecting approximately 10% of women of reproductive age.

**Common Signs**:
- Irregular or absent periods
- Excess androgen (acne, excess facial/body hair)
- Polycystic ovaries on ultrasound
- Weight gain
- Thinning hair

**Possible Symptoms**:
- Heavy or painful periods when they occur
- Difficulty getting pregnant
- Mood changes (depression, anxiety)
- Skin darkening in body folds

**How to Manage PCOS**:
1. **Diet**: Low-GI foods, reduce processed carbs
2. **Exercise**: Regular moderate exercise improves insulin sensitivity
3. **Stress management**: High stress worsens symptoms
4. **Medical treatment**: Doctors may prescribe birth control, metformin, or other medications

**When to See a Doctor**:
- If your period is consistently irregular
- If you notice unusual hair growth or acne
- If you're having difficulty conceiving

⚠️ Early diagnosis leads to better outcomes. Don't hesitate to consult a gynecologist.`
  },
  {
    id: 6, category: 'basics', title: 'What is Normal? Period Facts for Teens',
    excerpt: "Periods can be confusing! Here is what is completely normal and what might need a doctor's attention.",
    readTime: '4 min', tag: 'For Students', color: 'from-pink-400 to-purple-400',
    content: `Many students have questions about what's "normal" when it comes to their period.

**What's NORMAL**:
- Cycle length of 21–35 days
- Period lasting 2–7 days
- Light to moderate flow
- Some cramping, especially on Day 1–2
- Mood changes before your period (PMS)
- Irregular cycles in the first 1–2 years

**What's NOT Normal** (see a doctor):
- Periods lasting more than 7 days
- Extremely heavy flow (soaking a pad/tampon every hour)
- Severe pain that stops normal activities
- No period for 3+ months (if not pregnant)
- Periods that are always irregular after 2 years

**Normal Colors**:
- Bright red (active flow) ✅
- Dark red/brown (older blood) ✅
- Pink (light flow/start) ✅
- Orange or grey (infection? see doctor) ⚠️

Remember: Every body is different. If something feels wrong, trust your instincts and consult a healthcare provider!`
  },
];

export const Education: React.FC = () => {
  const [selectedCat, setSelectedCat] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [openArticle, setOpenArticle] = useState<typeof articles[0] | null>(null);

  const filtered = articles.filter(a => {
    const matchCat = selectedCat === 'all' || a.category === selectedCat;
    const matchSearch = a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  if (openArticle) {
    return (
      <div className="p-6 animate-fadeIn">
        <button onClick={() => setOpenArticle(null)} className="flex items-center gap-2 text-gray-400 hover:text-pink-500 mb-6 transition-colors text-sm">
          ← Back to Articles
        </button>
        <div className="max-w-2xl mx-auto">
          <div className={`bg-gradient-to-br ${openArticle.color} rounded-2xl p-6 text-white mb-6`}>
            <span className="text-xs bg-white/20 px-3 py-1 rounded-full">{openArticle.tag}</span>
            <h1 className="text-2xl font-bold mt-3 mb-2">{openArticle.title}</h1>
            <div className="flex items-center gap-2 text-white/70 text-sm">
              <Clock className="w-4 h-4" />
              <span>{openArticle.readTime} read</span>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-pink-100 shadow-sm p-6">
            <div className="prose prose-sm text-gray-700 whitespace-pre-line leading-relaxed">
              {openArticle.content.split('\n').map((line, i) => {
                if (line.startsWith('**') && line.endsWith('**')) {
                  return <p key={i} className="font-bold text-gray-800 mt-4 mb-1">{line.replace(/\*\*/g, '')}</p>;
                }
                if (line.startsWith('- ') || line.match(/^\d+\./)) {
                  return <p key={i} className="ml-4 text-gray-600 my-1">{line}</p>;
                }
                if (line.trim() === '') return <br key={i} />;
                return <p key={i} className="text-gray-600 my-2">{line.replace(/\*\*/g, '')}</p>;
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Health Education 📚</h1>
        <p className="text-gray-400 text-sm mt-1">Learn everything about menstrual health from trusted sources.</p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
        <input
          value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search articles..."
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-300 bg-white text-gray-800 placeholder-gray-300"
        />
      </div>

      {/* Categories */}
      <div className="flex gap-2 flex-wrap">
        {categories.map(({ id, label, icon: Icon }) => (
          <button
            key={id} onClick={() => setSelectedCat(id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              selectedCat === id
                ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-md'
                : 'bg-white border border-pink-200 text-gray-500 hover:border-pink-400'
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Articles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map(article => (
          <div
            key={article.id}
            className="bg-white rounded-2xl border border-pink-100 shadow-sm card-hover overflow-hidden cursor-pointer"
            onClick={() => setOpenArticle(article)}
          >
            <div className={`bg-gradient-to-br ${article.color} p-5 text-white`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">{article.tag}</span>
                <div className="flex items-center gap-1 text-white/70 text-xs">
                  <Clock className="w-3 h-3" />
                  {article.readTime}
                </div>
              </div>
              <h3 className="font-bold text-base leading-tight">{article.title}</h3>
            </div>
            <div className="p-4">
              <p className="text-gray-500 text-sm leading-relaxed line-clamp-3">{article.excerpt}</p>
              <button className="mt-3 flex items-center gap-1 text-pink-500 text-sm font-medium hover:gap-2 transition-all">
                Read Article <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="w-12 h-12 text-pink-200 mx-auto mb-3" />
          <p className="text-gray-400">No articles found for your search.</p>
        </div>
      )}
    </div>
  );
};
