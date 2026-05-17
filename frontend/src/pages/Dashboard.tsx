export default function Dashboard() {
  const stats = [
    { label: 'Words Learned', value: 142 },
    { label: 'Sessions', value: 27 },
    { label: 'Avg Score', value: '84%' },
  ]

  const activity = [
    { date: 'May 15', description: 'Practiced 10 vocabulary words' },
    { date: 'May 14', description: 'Completed conjugation drill: avoir' },
    { date: 'May 13', description: 'Translated 5 sentences' },
    { date: 'May 12', description: 'Added 8 new words to vocabulary' },
  ]

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Dashboard</h1>

      <div className="grid grid-cols-3 gap-4 mb-8">
        {stats.map((s) => (
          <div key={s.label} className="border border-gray-200 rounded-lg p-5">
            <p className="text-sm text-gray-500 mb-1">{s.label}</p>
            <p className="text-3xl font-bold text-gray-800">{s.value}</p>
          </div>
        ))}
      </div>

      <h2 className="text-lg font-medium text-gray-700 mb-3">Recent Activity</h2>
      <ul className="divide-y divide-gray-100 border border-gray-200 rounded-lg">
        {activity.map((a) => (
          <li key={a.date} className="flex items-center gap-4 px-4 py-3">
            <span className="text-xs text-gray-400 w-14 shrink-0">{a.date}</span>
            <span className="text-sm text-gray-700">{a.description}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
