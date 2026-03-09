import React from 'react';

const categories = [
  {
    title: 'Iron Rich Foods',
    items: [
      { name: 'Spinach', benefit: 'Supports iron recovery during menstrual blood loss.', emoji: '🥬' },
      { name: 'Lentils', benefit: 'Adds iron and protein for stable energy.', emoji: '🫘' },
      { name: 'Beans', benefit: 'Helps reduce fatigue with iron and fiber.', emoji: '🌱' },
    ],
  },
  {
    title: 'Magnesium Rich Foods',
    items: [
      { name: 'Bananas', benefit: 'May reduce bloating and muscle cramps.', emoji: '🍌' },
      { name: 'Dark Chocolate', benefit: 'Magnesium support and mood boost.', emoji: '🍫' },
      { name: 'Avocado', benefit: 'Healthy fats plus magnesium for comfort.', emoji: '🥑' },
    ],
  },
  {
    title: 'Anti Inflammatory Foods',
    items: [
      { name: 'Ginger', benefit: 'Helps ease cramp pain and nausea.', emoji: '🫚' },
      { name: 'Turmeric', benefit: 'Curcumin may reduce inflammation.', emoji: '🌿' },
      { name: 'Green Tea', benefit: 'Light antioxidants and calming hydration.', emoji: '🍵' },
    ],
  },
  {
    title: 'Hydration Tips',
    items: [
      { name: 'Water', benefit: 'Reduces bloating and supports blood flow.', emoji: '💧' },
      { name: 'Coconut Water', benefit: 'Natural electrolytes for energy.', emoji: '🥥' },
      { name: 'Herbal Tea', benefit: 'Warm fluids soothe cramps and stress.', emoji: '🫖' },
    ],
  },
];

export const ReliefFoods: React.FC = () => {
  return (
    <div className="p-6 space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Period Pain Relief Foods</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Simple food choices to support comfort during menstrual days.</p>
      </div>

      <div className="space-y-6">
        {categories.map(category => (
          <section key={category.title}>
            <h2 className="font-semibold text-lg text-pink-600 dark:text-pink-300 mb-3">{category.title}</h2>
            <div className="grid gap-4 md:grid-cols-3">
              {category.items.map(item => (
                <article key={item.name} className="rounded-2xl border border-pink-100 bg-white p-4 shadow-sm dark:bg-slate-900 dark:border-slate-800">
                  <div className="text-2xl" aria-hidden="true">{item.emoji}</div>
                  <h3 className="font-semibold text-slate-800 dark:text-slate-100 mt-2">{item.name}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">{item.benefit}</p>
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
};