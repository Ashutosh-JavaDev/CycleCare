import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, Sparkles, RefreshCw } from 'lucide-react';
import { useApp } from '../store/AppContext';

interface Message {
  id: number;
  role: 'user' | 'ai';
  text: string;
  timestamp: Date;
}

const FAQ = [
  'Why are my periods irregular?',
  'How to reduce period cramps?',
  'What is PCOS?',
  'Is heavy bleeding normal?',
  'Foods that help during period',
  'Can stress affect my cycle?',
];

const getAIResponse = (question: string): string => {
  const q = question.toLowerCase();

  if (q.includes('irregular') || q.includes('irregular period')) {
    return `**Irregular periods** are very common, especially in teens and young adults! 🌸

Common causes include:
• **Stress**: Academic pressure, exams, or emotional stress can delay or skip periods
• **Weight changes**: Sudden weight gain or loss affects hormones
• **PCOS**: Polycystic Ovary Syndrome is a hormonal condition
• **Thyroid issues**: An overactive or underactive thyroid affects cycles
• **Exercise**: Excessive exercise can affect your period
• **First 1-2 years**: Cycles naturally regulate over time

**When to see a doctor:**
If your period is missing for 3+ months, or cycles vary by more than 7-9 days regularly.

💡 **Tip:** Log your cycles in CycleCare to identify patterns over time!`;
  }

  if (q.includes('cramp') || q.includes('pain') || q.includes('reduce')) {
    return `Here are effective ways to **reduce period cramps** 💪:

**Immediate relief:**
• 🌡️ Apply a heating pad to your lower abdomen (15-20 mins)
• 🧘 Try gentle yoga poses: Child's pose, Cat-Cow stretch
• 💊 Ibuprofen or naproxen (taken at the start of your period)
• 🫖 Ginger or chamomile tea

**Lifestyle changes:**
• 🏃 Regular exercise throughout the month
• 🥗 Reduce caffeine, salt, and processed foods
• 💧 Stay well hydrated
• 😴 Get enough sleep

**Supplements (consult your doctor):**
• Magnesium, Omega-3, Vitamin D, Vitamin B1

⚠️ If cramps are severe and interfere with daily life, please consult a gynecologist — it could be endometriosis or other conditions.`;
  }

  if (q.includes('pcos') || q.includes('polycystic')) {
    return `**PCOS (Polycystic Ovary Syndrome)** is a hormonal condition affecting ~10% of people with periods 🌺

**Common signs:**
• Irregular or missed periods
• Excess hair on face/body (hirsutism)
• Acne
• Weight gain
• Thinning hair on scalp
• Small cysts on ovaries (seen on ultrasound)

**How it's managed:**
• **Lifestyle**: Balanced diet (low-GI foods), regular exercise
• **Medication**: Doctors may prescribe birth control pills or metformin
• **Regular monitoring**: Blood tests, ultrasounds

**Good news:** PCOS is manageable! Many people with PCOS live healthy, normal lives with proper care.

💡 If you suspect PCOS, please see a gynecologist for proper diagnosis. Early intervention helps!`;
  }

  if (q.includes('heavy') || q.includes('bleeding') || q.includes('flow')) {
    return `Regarding **heavy menstrual bleeding** 🩸:

**What's considered "heavy":**
• Soaking a pad/tampon every hour for 2+ hours
• Passing clots larger than a coin
• Period lasting more than 7 days
• Feeling extremely tired or dizzy during period

**Possible causes:**
• Hormonal imbalance
• Fibroids or polyps
• Thyroid conditions
• PCOS
• Blood disorders

**Normal variation:**
• Some people naturally have heavier flow
• Flow can vary from cycle to cycle

**When to seek help immediately:**
🚨 If you're soaking through protection every hour, see a doctor. Severe blood loss can cause anemia.

**At home:** Track the heaviness using CycleCare's symptom logger to show your doctor!`;
  }

  if (q.includes('food') || q.includes('eat') || q.includes('diet') || q.includes('nutrition')) {
    return `**Best foods during your period** 🥗:

**Eat MORE of:**
• 🥬 Leafy greens (iron, magnesium)
• 🐟 Fatty fish — salmon, sardines (Omega-3, reduces inflammation)
• 🍌 Bananas (potassium, reduces bloating)
• 🍫 Dark chocolate 70%+ (magnesium, serotonin boost)
• 🫖 Ginger tea (natural anti-inflammatory)
• 🥜 Nuts and seeds (healthy fats)
• 🍊 Citrus fruits (vitamin C helps iron absorption)

**Reduce or avoid:**
• ☕ Caffeine (worsens cramps and anxiety)
• 🧂 Salty foods (increase bloating)
• 🍬 Refined sugar (worsens mood swings)
• 🍺 Alcohol (dehydrates and worsens pain)

**Stay hydrated!** 💧 Drink 8-10 glasses of water to reduce bloating.`;
  }

  if (q.includes('stress') || q.includes('anxiety') || q.includes('mental')) {
    return `Yes! **Stress significantly affects your menstrual cycle** 🧠💗

**How stress impacts your period:**
• Can delay or skip periods entirely
• May cause lighter or heavier flow
• Worsens PMS symptoms
• Increases cramping
• Can cause earlier or later ovulation

**Why this happens:**
Your brain releases cortisol (stress hormone) which interferes with estrogen and progesterone — the hormones that regulate your cycle.

**Managing stress for a healthier cycle:**
• 🧘 Mindfulness and meditation (even 10 mins/day)
• 🏃 Regular physical exercise
• 😴 Consistent sleep schedule
• 📓 Journaling your feelings
• 🤝 Talking to friends, family, or a counselor
• 📵 Digital detox — limit screen time before bed

💡 **Exam season tip:** Plan ahead, study in advance, and remember your health comes first!`;
  }

  if (q.includes('ovulation') || q.includes('fertile')) {
    return `**Understanding Ovulation** 🌸:

**When does it happen?**
Typically around Day 14 of a 28-day cycle (varies by person).

**Signs of ovulation:**
• 🌡️ Slight rise in basal body temperature
• Clear, stretchy cervical mucus (like egg whites)
• Mild pelvic pain (mittelschmerz)
• Increased sex drive
• Tender breasts

**Your fertile window:**
The 5 days before ovulation + ovulation day = your most fertile period.

**On CycleCare:**
Your ovulation window is shown in **blue** on the calendar! 💙

⚠️ Note: CycleCare provides educational predictions, not medical-grade fertility tracking. For family planning, consult a healthcare provider.`;
  }

  if (q.includes('tampon') || q.includes('pad') || q.includes('cup') || q.includes('product')) {
    return `**Menstrual Products Guide** 🌺:

**Disposable Pads**
• Easy to use, no insertion required
• Good for beginners
• Change every 4-6 hours

**Tampons**
• Inserted internally
• Great for swimming/sports
• Change every 4-8 hours (never exceed 8 hours — TSS risk)

**Menstrual Cup**
• Reusable silicone cup
• Eco-friendly, cost-effective
• Lasts up to 12 hours
• Learning curve to insert/remove

**Period Underwear**
• Absorbent underwear
• Great backup or for light days
• Washable and reusable

**Menstrual Disc**
• Similar to cup but disc-shaped
• Can be worn during some activities

💡 **Choice depends on:** comfort, activity level, flow heaviness, and personal preference. All are safe when used correctly!`;
  }

  if (q.includes('hello') || q.includes('hi') || q.includes('hey')) {
    return `Hello! 👋 I'm CycleCare AI Assistant, your friendly menstrual health guide! 🌸

I can help you with questions about:
• 🔴 Irregular or painful periods
• 💊 Managing cramps and symptoms
• 🥗 Nutrition and exercise during your cycle
• 🔬 Conditions like PCOS, endometriosis
• 📅 Understanding your cycle phases
• 🛡️ Menstrual hygiene and products

What would you like to know? Feel free to ask anything — I'm here to help! 💗`;
  }

  return `Thank you for your question! 🌸

I'm here to help with menstrual health information. Here are some topics I can help with:

• **Cycle irregularities** — why periods change
• **Pain management** — reducing cramps naturally
• **PCOS & conditions** — understanding hormonal disorders
• **Nutrition** — foods that help during your period
• **Hygiene** — best practices for period care
• **Exercise** — safe workouts during your cycle
• **Stress & mental health** — how emotions affect your cycle

💡 **Try asking:** "How do I reduce cramps?" or "What is PCOS?"

⚠️ **Important:** I provide educational information only. For medical concerns, always consult a qualified gynecologist or healthcare provider. Your health is precious! 💗`;
};

const fetchAIResponse = async (question: string): Promise<string> => {
  try {
    const res = await fetch('/api/ai/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question }),
    });
    if (!res.ok) throw new Error('AI API unavailable');
    const data = await res.json();
    return data.answer;
  } catch {
    return getAIResponse(question);
  }
};

export const AIAssistant: React.FC = () => {
  const { user } = useApp();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1, role: 'ai', timestamp: new Date(),
      text: `Hi ${user?.name?.split(' ')[0] || 'there'}! 👋 I'm your CycleCare AI Health Assistant. I can answer questions about menstrual health, cycle tracking, symptoms, and more. How can I help you today? 🌸`,
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { id: Date.now(), role: 'user', text, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);
    await new Promise(r => setTimeout(r, 1200 + Math.random() * 800));
    const aiText = await fetchAIResponse(text);
    const aiMsg: Message = {
      id: Date.now() + 1, role: 'ai',
      text: aiText,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, aiMsg]);
    setIsTyping(false);
  };

  const formatText = (text: string) => {
    return text.split('\n').map((line, i) => {
      if (line.startsWith('**') && line.endsWith('**')) {
        return <p key={i} className="font-bold text-gray-800 mb-1 mt-2">{line.replace(/\*\*/g, '')}</p>;
      }
      if (line.includes('**')) {
        const parts = line.split(/\*\*(.*?)\*\*/g);
        return (
          <p key={i} className="mb-1">
            {parts.map((part, j) => j % 2 === 1 ? <strong key={j}>{part}</strong> : part)}
          </p>
        );
      }
      if (line.startsWith('• ') || line.startsWith('🚨')) {
        return <p key={i} className="ml-2 mb-1">{line}</p>;
      }
      if (line.trim() === '') return <br key={i} />;
      return <p key={i} className="mb-1">{line}</p>;
    });
  };

  return (
    <div className="p-6 h-full animate-fadeIn">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-gray-800">AI Health Assistant 🤖</h1>
        <p className="text-gray-400 text-sm mt-1">Ask me anything about menstrual health — I'm here to help!</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-220px)]">
        {/* Chat area */}
        <div className="flex-1 flex flex-col bg-white rounded-2xl border border-pink-100 shadow-sm overflow-hidden">
          {/* Chat header */}
          <div className="flex items-center gap-3 p-4 border-b border-pink-100 bg-gradient-to-r from-pink-50 to-purple-50">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-purple-400 flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-semibold text-gray-800 text-sm">CycleCare AI</p>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse-soft"></div>
                <p className="text-xs text-gray-400">Online — Here to help</p>
              </div>
            </div>
            <button
              onClick={() => setMessages([{ id: Date.now(), role: 'ai', timestamp: new Date(), text: `Hi again! What would you like to know? 🌸` }])}
              className="ml-auto p-2 hover:bg-pink-100 rounded-xl transition-colors"
              title="Reset chat"
            >
              <RefreshCw className="w-4 h-4 text-gray-400" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map(msg => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}>
                {msg.role === 'ai' && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-400 to-purple-400 flex items-center justify-center flex-shrink-0 mr-2 mt-1">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                )}
                <div className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-3 text-sm leading-relaxed ${
                  msg.role === 'user' ? 'chat-bubble-user text-white' : 'chat-bubble-ai text-gray-700'
                }`}>
                  {msg.role === 'ai' ? formatText(msg.text) : msg.text}
                  <p className={`text-xs mt-2 ${msg.role === 'user' ? 'text-white/60 text-right' : 'text-gray-400'}`}>
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-start gap-2 animate-fadeIn">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-400 to-purple-400 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="chat-bubble-ai px-4 py-3">
                  <div className="flex gap-1 items-center">
                    {[0, 1, 2].map(i => (
                      <div key={i} className="w-2 h-2 rounded-full bg-pink-400 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }}></div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-pink-100">
            <form onSubmit={e => { e.preventDefault(); sendMessage(input); }} className="flex gap-2">
              <input
                value={input} onChange={e => setInput(e.target.value)}
                placeholder="Ask me about your menstrual health..."
                className="flex-1 px-4 py-3 rounded-xl border border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-300 bg-white text-gray-800 placeholder-gray-300 text-sm"
              />
              <button
                type="submit" disabled={!input.trim() || isTyping}
                className="w-11 h-11 bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl flex items-center justify-center disabled:opacity-50 hover:shadow-lg hover:shadow-pink-200 transition-all"
              >
                <Send className="w-4 h-4 text-white" />
              </button>
            </form>
            <p className="text-xs text-gray-300 mt-2 text-center">
              For medical concerns, always consult a qualified healthcare provider.
            </p>
          </div>
        </div>

        {/* FAQ sidebar */}
        <div className="lg:w-64 space-y-4">
          <div className="bg-white rounded-2xl border border-pink-100 shadow-sm p-5">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-4 h-4 text-pink-500" />
              <h3 className="font-bold text-gray-800 text-sm">Suggested Questions</h3>
            </div>
            <div className="space-y-2">
              {FAQ.map(q => (
                <button
                  key={q} onClick={() => sendMessage(q)}
                  className="w-full text-left px-3 py-2.5 rounded-xl text-xs text-gray-600 bg-pink-50 hover:bg-pink-100 hover:text-pink-600 transition-all border border-pink-100"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl border border-pink-100 p-5">
            <p className="text-xs text-gray-500 font-medium mb-2">⚠️ Disclaimer</p>
            <p className="text-xs text-gray-400 leading-relaxed">
              CycleCare AI provides general health information for educational purposes only. It is not a substitute for professional medical advice. Always consult a doctor for health concerns.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
