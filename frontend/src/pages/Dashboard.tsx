export default function Dashboard() {
  const stats = [
    { label: 'Mots appris', value: 142, sub: '+12 cette semaine' },
    { label: 'Séances', value: 27, sub: '3 cette semaine' },
    { label: 'Score moyen', value: '84%', sub: 'Depuis le début' },
  ]

  const activity = [
    { date: '15 mai', description: 'Pratiqué 10 mots de vocabulaire' },
    { date: '14 mai', description: 'Exercice de conjugaison terminé : avoir' },
    { date: '13 mai', description: 'Traduit 5 phrases' },
    { date: '12 mai', description: 'Ajouté 8 nouveaux mots au vocabulaire' },
  ]

  return (
    <div>
      <h1 className="text-3xl font-semibold text-navy-900 mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>
        Bonjour
      </h1>
      <p className="text-sm text-gray-500 mb-8">Voici où en est votre français.</p>

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
        Activité récente
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
