import { useData } from '../admin/context/DataContext.tsx';

/* "Team wheel" section for the home page — a central leader (Director,
   since the academy has a Director rather than a CEO) surrounded by the
   rest of the team, flanking the centre on both sides like a wheel of
   people. All content comes straight from the admin team_members data,
   so editing the team in /admin updates this automatically. */

const AVATAR_THEMES = [
  'av-purple', 'av-amber', 'av-rose', 'av-emerald', 'av-sky', 'av-violet', 'av-teal', 'av-orange',
];

function initials(name = '') {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0] || '')
    .join('')
    .toUpperCase();
}

function isLeader(m) {
  const d = (m.designation || '').toLowerCase();
  return /director|founder|ceo|head|principal/.test(d);
}

function Avatar({ member, size, themeIndex }) {
  const cls = `wheel-avatar ${AVATAR_THEMES[themeIndex % AVATAR_THEMES.length]}`;
  const style = { width: size, height: size };
  const imgSrc = member.image_url || member.photo;
  if (imgSrc) {
    return (
      <div className={cls} style={style}>
        <img src={imgSrc} alt={member.name} />
      </div>
    );
  }
  return (
    <div className={cls} style={style}>
      <span>{initials(member.name)}</span>
    </div>
  );
}

export default function TeamWheel() {
  const { db } = useData();

  const members = (db.team_members || [])
    .filter((m) => m.is_active !== false)
    .sort((a, b) => (a.display_order ?? 999) - (b.display_order ?? 999));

  if (!members.length) return null;

  // Pick the leader for the centre; everyone else orbits around it.
  const leaderIdx = members.findIndex(isLeader);
  const leader = members[leaderIdx >= 0 ? leaderIdx : 0];
  const others = members.filter((m) => m.id !== leader.id);

  // Split the rest into two flanking columns (left / right).
  const half = Math.ceil(others.length / 2);
  const leftCol = others.slice(0, half);
  const rightCol = others.slice(half);

  const renderPerson = (member, side, i) => (
    <div className={`wheel-person ${side}`} key={member.id} style={{ '--i': i }}>
      <Avatar member={member} size={92} themeIndex={member.id} />
      <div className="wheel-person-info">
        <div className="wheel-person-name">{member.name}</div>
        <div className="wheel-person-role">{member.designation}</div>
      </div>
    </div>
  );

  return (
    <section className="section team-wheel-section">
      <div className="container">
        <div className="section-head">
          <div className="eyebrow">The People</div>
          <h2>Meet the team behind the academy</h2>
          <p>Led by our Director and taught by mentors who work in the industries they teach.</p>
        </div>

        <div className="team-wheel">
          <div className="wheel-col wheel-left">
            {leftCol.map((m, i) => renderPerson(m, 'left', i))}
          </div>

          <div className="wheel-center">
            <div className="wheel-rings">
              <span className="ring ring-1" />
              <span className="ring ring-2" />
              <span className="ring ring-3" />
              <div className="wheel-leader">
                <Avatar member={leader} size={190} themeIndex={0} />
              </div>
            </div>
            <div className="wheel-leader-info">
              <div className="wheel-leader-name">{leader.name}</div>
              <div className="wheel-leader-role">{leader.designation}</div>
            </div>
          </div>

          <div className="wheel-col wheel-right">
            {rightCol.map((m, i) => renderPerson(m, 'right', i))}
          </div>
        </div>
      </div>
    </section>
  );
}
