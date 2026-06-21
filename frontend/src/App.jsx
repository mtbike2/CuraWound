import React, { useState, useEffect } from 'react'

const styles = {
  shell: {
    display: 'flex',
    height: '100vh',
    backgroundColor: '#F1F8F4',
  },
  sidebar: {
    width: '220px',
    backgroundColor: '#2E7D32',
    display: 'flex',
    flexDirection: 'column',
    padding: '0',
    flexShrink: 0,
  },
  sidebarLogo: {
    padding: '24px 20px',
    borderBottom: '1px solid #1B5E20',
  },
  logoText: {
    color: '#FFFFFF',
    fontSize: '20px',
    fontWeight: '700',
    letterSpacing: '0.5px',
  },
  logoSub: {
    color: '#A5D6A7',
    fontSize: '11px',
    marginTop: '2px',
    letterSpacing: '0.3px',
  },
  nav: {
    flex: 1,
    padding: '12px 0',
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    padding: '12px 20px',
    color: '#C8E6C9',
    fontSize: '14px',
    cursor: 'pointer',
    borderLeft: '3px solid transparent',
    transition: 'all 0.15s',
    userSelect: 'none',
  },
  navItemActive: {
    color: '#FFFFFF',
    backgroundColor: '#1B5E20',
    borderLeft: '3px solid #66BB6A',
  },
  navIcon: {
    marginRight: '10px',
    fontSize: '16px',
  },
  header: {
    height: '56px',
    backgroundColor: '#FFFFFF',
    borderBottom: '1px solid #E0E6E4',
    display: 'flex',
    alignItems: 'center',
    padding: '0 24px',
    flexShrink: 0,
  },
  breadcrumb: {
    fontSize: '13px',
    color: '#455A64',
  },
  breadcrumbSep: {
    margin: '0 6px',
    color: '#B0BEC5',
  },
  breadcrumbActive: {
    color: '#2E7D32',
    fontWeight: '600',
  },
  main: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  workspace: {
    flex: 1,
    padding: '32px',
    overflowY: 'auto',
  },
  pageTitle: {
    fontSize: '22px',
    fontWeight: '700',
    color: '#2E7D32',
    marginBottom: '8px',
  },
  pageSubtitle: {
    fontSize: '14px',
    color: '#78909C',
    marginBottom: '32px',
  },
  statusCard: {
    backgroundColor: '#FFFFFF',
    border: '1px solid #E0E6E4',
    borderRadius: '8px',
    padding: '20px 24px',
    marginBottom: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  statusDot: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    flexShrink: 0,
  },
  statusLabel: {
    fontSize: '13px',
    color: '#78909C',
    marginBottom: '2px',
  },
  statusValue: {
    fontSize: '15px',
    fontWeight: '600',
    color: '#455A64',
  },
}

const NAV_ITEMS = [
  { key: 'home', label: 'Home', icon: '⌂' },
  { key: 'patients', label: 'Patients', icon: '👤' },
  { key: 'capture', label: 'Capture Wound', icon: '📷' },
  { key: 'timeline', label: 'Healing Timeline', icon: '📈' },
  { key: 'note', label: 'Generate Note', icon: '📝' },
  { key: 'reports', label: 'Reports', icon: '📄' },
  { key: 'settings', label: 'Settings', icon: '⚙' },
]

const BREADCRUMBS = {
  home: ['Home'],
  patients: ['Home', 'Patients'],
  capture: ['Home', 'Capture Wound'],
  timeline: ['Home', 'Healing Timeline'],
  note: ['Home', 'Generate Note'],
  reports: ['Home', 'Reports'],
  settings: ['Home', 'Settings'],
}

export default function App() {
  const [activePage, setActivePage] = useState('home')
  const [apiStatus, setApiStatus] = useState('checking')

  useEffect(() => {
    fetch('http://localhost:8000/health')
      .then(res => res.json())
      .then(data => {
        if (data.status === 'ok') setApiStatus('connected')
        else setApiStatus('error')
      })
      .catch(() => setApiStatus('offline'))
  }, [])

  const breadcrumbs = BREADCRUMBS[activePage] || ['Home']

  return (
    <div style={styles.shell}>

      {/* Sidebar */}
      <div style={styles.sidebar}>
        <div style={styles.sidebarLogo}>
          <div style={styles.logoText}>CuraWound</div>
          <div style={styles.logoSub}>Wound Care Platform</div>
        </div>
        <nav style={styles.nav}>
          {NAV_ITEMS.map(item => (
            <div
              key={item.key}
              style={{
                ...styles.navItem,
                ...(activePage === item.key ? styles.navItemActive : {})
              }}
              onClick={() => setActivePage(item.key)}
            >
              <span style={styles.navIcon}>{item.icon}</span>
              {item.label}
            </div>
          ))}
        </nav>
      </div>

      {/* Main area */}
      <div style={styles.main}>

        {/* Header with breadcrumbs */}
        <div style={styles.header}>
          <div style={styles.breadcrumb}>
            {breadcrumbs.map((crumb, i) => (
              <span key={i}>
                {i > 0 && <span style={styles.breadcrumbSep}>/</span>}
                <span style={i === breadcrumbs.length - 1 ? styles.breadcrumbActive : {}}>
                  {crumb}
                </span>
              </span>
            ))}
          </div>
        </div>

        {/* Workspace */}
        <div style={styles.workspace}>
          <div style={styles.pageTitle}>
            {NAV_ITEMS.find(n => n.key === activePage)?.label || 'Home'}
          </div>
          <div style={styles.pageSubtitle}>
            {activePage === 'home' && 'Welcome to CuraWound. Select a patient or start a new visit.'}
            {activePage === 'patients' && 'Search for an existing patient or create a new one.'}
            {activePage === 'capture' && 'Upload or capture a wound photo to begin measurement.'}
            {activePage === 'timeline' && 'View wound healing progress over time.'}
            {activePage === 'note' && 'Generate an AI-assisted clinical note for review and signing.'}
            {activePage === 'reports' && 'Export visit summaries, healing proof, and reports.'}
            {activePage === 'settings' && 'Configure your CuraWound installation.'}
          </div>

          {/* API status card — home page only */}
          {activePage === 'home' && (
            <div style={styles.statusCard}>
              <div style={{
                ...styles.statusDot,
                backgroundColor:
                  apiStatus === 'connected' ? '#2E7D32' :
                  apiStatus === 'checking' ? '#FFA726' : '#C62828'
              }} />
              <div>
                <div style={styles.statusLabel}>Backend API</div>
                <div style={styles.statusValue}>
                  {apiStatus === 'connected' && 'Connected — CuraWound API is running'}
                  {apiStatus === 'checking' && 'Checking connection...'}
                  {apiStatus === 'offline' && 'Offline — start the backend to connect'}
                  {apiStatus === 'error' && 'Error — unexpected response from API'}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
