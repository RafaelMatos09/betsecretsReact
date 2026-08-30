import type { Team } from '../data/teams'

export function TeamMark({ team }: { team: Team }) {
  return (
    <span
      className={`inline-flex size-9 items-center justify-center rounded-full ${team.color} text-[9px] font-black tracking-tight text-white shadow-sm`}
    >
      {team.short.slice(0, 3)}
    </span>
  )
}
