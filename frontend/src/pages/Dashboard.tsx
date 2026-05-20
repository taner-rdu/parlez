export default function Dashboard() {
  const stats = [
    { label: 'Words Learned', value: 142, sub: '+12 this week' },
    { label: 'Sessions', value: 27, sub: '3 this week' },
    { label: 'Avg Score', value: '84%', sub: 'All time' },
  ]

  const activity = [
    { date: 'May 15', description: 'Practiced 10 vocabulary words' },
    { date: 'May 14', description: 'Completed conjugation drill: avoir' },
    { date: 'May 13', description: 'Translated 5 sentences' },
    { date: 'May 12', description: 'Added 8 new words to vocabulary' },
  ]

  return (
    <div>
      <h1 className="text-3xl font-semibold text-navy-900 mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>
        Bonjour
      </h1>
      <p className="text-sm text-gray-500 mb-8">Here's how your French is coming along.</p>

      <div className="grid grid-cols-3 gap-4 mb-10">
        {stats.map((s) => (
          <div
            key={s.label}
            className="bg-white rounded-xl p-5 shadow-sm border border-cream-200"
          >
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">{s.label}</p>
            <p className="text-4xl font-bold text-navy-900 mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>
              {s.value}
            </p>
            <p className="text-xs text-gray-400">{s.sub}</p>
          </div>
        ))}
      </div>

      <h2
        className="text-xl font-semibold text-navy-900 mb-4"
        style={{ fontFamily: "'Playfair Display', serif" }}
      >
        Recent Activity
      </h2>
      <div className="bg-white rounded-xl shadow-sm border border-cream-200 overflow-hidden">
        {activity.map((a, i) => (
          <div
            key={a.date}
            className={`flex items-center gap-4 px-5 py-4 ${i !== activity.length - 1 ? 'border-b border-cream-200' : ''}`}
          >
            <span className="text-xs font-medium text-gold-500 w-14 shrink-0">{a.date}</span>
            <span className="text-sm text-gray-700">{a.description}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
