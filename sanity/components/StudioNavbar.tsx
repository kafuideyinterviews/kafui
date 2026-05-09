import type { NavbarProps } from 'sanity'

/**
 * Custom Studio navbar.
 * Shows the Kafui Dey brand on the left and a Celestial Web Solutions
 * credit on the right alongside the default toolbar actions.
 */
export function StudioNavbar(props: NavbarProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      {/* ── Credit bar ───────────────────────────────────────── */}
      <div
        style={{
          display:         'flex',
          alignItems:      'center',
          justifyContent:  'space-between',
          padding:         '6px 20px',
          backgroundColor: '#0B0F1A',
          borderBottom:    '1px solid rgba(201,168,76,0.2)',
        }}
      >
        {/* Left — project identity */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* KD monogram */}
          <div
            style={{
              width:        28,
              height:       28,
              borderRadius: 4,
              background:   '#C9A84C',
              display:      'flex',
              alignItems:   'center',
              justifyContent: 'center',
              fontFamily:   'Georgia, serif',
              fontStyle:    'italic',
              fontWeight:   600,
              fontSize:     13,
              color:        '#0B0F1A',
              lineHeight:   1,
            }}
          >
            KD
          </div>
          <span
            style={{
              fontFamily:   'Georgia, serif',
              fontStyle:    'italic',
              fontSize:     14,
              color:        '#F7F2EB',
              letterSpacing: 0.3,
            }}
          >
            Kafui Dey — Studio
          </span>
        </div>

        {/* Right — Celestial credit */}
        <a
          href="https://celestialwebsolutions.net"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontFamily:    'system-ui, sans-serif',
            fontSize:      10,
            color:         'rgba(201,168,76,0.7)',
            textDecoration: 'none',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            transition:    'color 0.2s',
          }}
          onMouseOver={(e) => ((e.target as HTMLAnchorElement).style.color = '#C9A84C')}
          onMouseOut={(e)  => ((e.target as HTMLAnchorElement).style.color = 'rgba(201,168,76,0.7)')}
          title="Built by Celestial Web Solutions"
        >
          Built by Celestial Web Solutions
        </a>
      </div>

      {/* ── Default Sanity toolbar ────────────────────────────── */}
      <div>{props.renderDefault(props)}</div>
    </div>
  )
}