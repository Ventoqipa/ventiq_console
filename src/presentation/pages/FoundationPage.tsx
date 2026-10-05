import React from 'react'

export const FoundationPage: React.FC = () => {
  return (
    <div>
      {/* Título de la sección */}
      <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: '2 rem', fontWeight: 700, color: '#18181b', margin: 0 }}>
          Overview
        </h2>
      </div>

      {/* Tarjetas de Métricas de Resumen (Grid de 5 columnas) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '1rem',
          marginBottom: '1.5rem',
        }}
      >
        {/* REQUESTS */}
        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e4e4e7', borderRadius: '8px', padding: '1.25rem' }}>
          <span style={{ fontSize: '0.7rem', fontWeight: 600, color: '#71717a', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            REQUESTS
          </span>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#18181b', marginTop: '0.3rem' }}>
            25,600
          </div>
          <span style={{ fontSize: '0.75rem', color: '#10b981', display: 'block', marginTop: '0.2rem' }}>
            +3.2% vs yesterday
          </span>
        </div>

        {/* IMPRESSIONS */}
        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e4e4e7', borderRadius: '8px', padding: '1.25rem' }}>
          <span style={{ fontSize: '0.7rem', fontWeight: 600, color: '#71717a', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            IMPRESSIONS
          </span>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#18181b', marginTop: '0.3rem' }}>
            20,900
          </div>
          <span style={{ fontSize: '0.75rem', color: '#10b981', display: 'block', marginTop: '0.2rem' }}>
            +1.8% vs yesterday
          </span>
        </div>

        {/* CLICKS */}
        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e4e4e7', borderRadius: '8px', padding: '1.25rem' }}>
          <span style={{ fontSize: '0.7rem', fontWeight: 600, color: '#71717a', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            CLICKS
          </span>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#18181b', marginTop: '0.3rem' }}>
            1,247
          </div>
          <span style={{ fontSize: '0.75rem', color: '#ef4444', display: 'block', marginTop: '0.2rem' }}>
            -0.4% vs yesterday
          </span>
        </div>

        {/* ERRORS */}
        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e4e4e7', borderRadius: '8px', padding: '1.25rem' }}>
          <span style={{ fontSize: '0.7rem', fontWeight: 600, color: '#71717a', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            ERRORS
          </span>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#ef4444', marginTop: '0.3rem' }}>
            312
          </div>
          <span style={{ fontSize: '0.75rem', color: '#ef4444', display: 'block', marginTop: '0.2rem' }}>
            +22% vs yesterday
          </span>
        </div>

        {/* EST. REVENUE */}
        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e4e4e7', borderRadius: '8px', padding: '1.25rem', position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.7rem', fontWeight: 600, color: '#71717a', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              EST. REVENUE
            </span>
            <span style={{ fontSize: '0.65rem', backgroundColor: '#f4f4f5', color: '#71717a', padding: '0.15rem 0.4rem', borderRadius: '4px' }}>
              Source: AdMob
            </span>
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#18181b', marginTop: '0.3rem' }}>
            $184.30
          </div>
        </div>
      </div>

      {/* Secondary Grid: Trend and Recent Alerts */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
        {/* Trend Panel */}
        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e4e4e7', borderRadius: '8px', padding: '1.5rem' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#18181b', margin: '0 0 1rem 0' }}>
            Requests vs. Impressions — Last 7 days
          </h3>
          <div style={{ height: '200px', backgroundColor: '#fafafa', border: '1px dashed #e4e4e7', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#a1a1aa', fontSize: '0.875rem' }}>
            [ Trending Telemetry Graph ]
          </div>
        </div>

        {/* Recent Alerts Panel */}
        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e4e4e7', borderRadius: '8px', padding: '1.5rem' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#18181b', margin: '0 0 1rem 0' }}>
            Recent Alerts
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', padding: '0.75rem', borderRadius: '6px', fontSize: '0.8rem', color: '#991b1b' }}>
              <strong>Game over banner</strong> — error rate 18.4% (last 1h)
            </div>
            <div style={{ backgroundColor: '#fffbe3', border: '1px solid #fef08a', padding: '0.75rem', borderRadius: '6px', fontSize: '0.8rem', color: '#854d0e' }}>
              <strong>Meta Audience Network</strong> — sync failed 48h ago
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
