import { INFO_CARDS } from '../constants'

const InfoCards = () => (
  <div className="grid sm:grid-cols-2 gap-4">
    {INFO_CARDS.map((card) => (
      <div key={card.label} className="card">
        <p className="text-xs uppercase tracking-widest text-dim">{card.label}</p>
        <p className="text-lg font-semibold text-white mt-2">{card.title}</p>
        <p className="text-sm text-dim mt-2">{card.desc}</p>
      </div>
    ))}
  </div>
)

export default InfoCards
