import { useMemo, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Activity, FileCheck2, FolderGit2, ShieldAlert } from 'lucide-react';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { auditLog, dashboard, featureColors, meta } from './data/dummyData';
import { useAppStore } from './store/appStore';
const DEMO_AUDIT_DATE = '2026-10-08';

export function SpecDashboard() {
  const cards = [
    { label: 'Repos Scanned', value: dashboard.stats.reposScanned, icon: FolderGit2, color: featureColors.code },
    { label: 'Documents Fixed', value: dashboard.stats.documentsFixed, icon: FileCheck2, color: featureColors.document },
    { label: 'Threats Blocked', value: dashboard.stats.threatsBlocked, icon: ShieldAlert, color: featureColors.sandbox },
    { label: 'Compliance Score', value: `${dashboard.stats.complianceScore}%`, icon: Activity, color: '#0f172a' },
  ];
  const destinations = [
    { to:'/scanner', name:'Code-to-GDPR', detail:'Map personal data in repositories to privacy requirements.', color:featureColors.code },
    { to:'/documents', name:'Document Review & Fix', detail:'Find policy gaps and review suggested clause changes.', color:featureColors.document },
    { to:'/runtime', name:'VM Sandbox Monitor', detail:'Follow a simulated threat and block outbound activity.', color:featureColors.sandbox },
  ];
  return <div className="feature-page spec-demo"><div className="page-heading"><div><span className="eyebrow">Acme Ltd · Demo workspace</span><h1>AI Accelerator Suite</h1><p>One workspace for privacy compliance and runtime protection.</p></div></div><div className="sd-banner">{meta.demoBanner}</div>
    <section className="sd-grid">{cards.map(({label,value,icon:Icon,color})=><article className="card-panel sd-stat" key={label}><span>{label}</span><strong>{value}</strong><i className="sd-stat-accent" style={{backgroundColor:color}}/><Icon className="sd-stat-icon" size={19} style={{color}}/></article>)}</section>
    <section className="sd-chart-grid">
      <article className="card-panel feature-card sd-chart-card"><div className="sd-chart-heading"><div><span className="sd-chart-kicker">PERFORMANCE</span><h3>Compliance score</h3><p>Six week improvement trend</p></div><span className="sd-chart-highlight"><b>{dashboard.stats.complianceScore}%</b><small>current</small></span></div><div className="sd-chart"><ResponsiveContainer width="100%" height="100%"><AreaChart data={dashboard.scoreTrend} margin={{top:16,right:14,bottom:0,left:-12}}><defs><linearGradient id="scoreArea" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#12a9ba" stopOpacity={.24}/><stop offset="95%" stopColor="#12a9ba" stopOpacity={0}/></linearGradient></defs><CartesianGrid stroke="#e9edf3" strokeDasharray="3 5" vertical={false}/><XAxis dataKey="week" axisLine={false} tickLine={false} tick={{fill:'#8994a5',fontSize:11}} dy={9}/><YAxis domain={[40,100]} ticks={[40,60,80,100]} axisLine={false} tickLine={false} tick={{fill:'#8994a5',fontSize:10}}/><Tooltip cursor={{stroke:'#cbd5e1',strokeDasharray:'4 4'}} contentStyle={{border:'1px solid #e3e8ef',borderRadius:10,boxShadow:'0 8px 24px #17203314',fontSize:12}} labelStyle={{color:'#64748b',fontWeight:600}} formatter={(value)=>[`${value}%`,'Compliance score']}/><Area type="monotone" dataKey="score" name="Compliance score" stroke="#0b91a4" strokeWidth={3} fill="url(#scoreArea)" activeDot={{r:5,fill:'#fff',stroke:'#0b91a4',strokeWidth:3}}/></AreaChart></ResponsiveContainer></div></article>
      <article className="card-panel feature-card sd-chart-card"><div className="sd-chart-heading"><div><span className="sd-chart-kicker">FINDINGS</span><h3>Issues by category</h3><p>Open items across the workspace</p></div><span className="sd-chart-total">{dashboard.issuesByCategory.reduce((sum,item)=>sum+item.count,0)}<small> total</small></span></div><div className="sd-chart"><ResponsiveContainer width="100%" height="100%"><BarChart data={dashboard.issuesByCategory} margin={{top:16,right:12,bottom:0,left:-18}} barCategoryGap="34%"><defs><linearGradient id="issueBars" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#8b76d9"/><stop offset="100%" stopColor="#6654b8"/></linearGradient></defs><CartesianGrid stroke="#e9edf3" strokeDasharray="3 5" vertical={false}/><XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill:'#8994a5',fontSize:10}} dy={9}/><YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{fill:'#8994a5',fontSize:10}}/><Tooltip cursor={{fill:'#f5f6fa'}} contentStyle={{border:'1px solid #e3e8ef',borderRadius:10,boxShadow:'0 8px 24px #17203314',fontSize:12}} formatter={(value)=>[value,'Issues']}/><Bar dataKey="count" name="Issues" fill="url(#issueBars)" radius={[6,6,2,2]} maxBarSize={38}/></BarChart></ResponsiveContainer></div></article>
    </section>
    <section className="card-panel feature-card"><h3>Recent activity</h3><div className="sd-activity">{dashboard.recentActivity.slice(0,5).map((item,i)=><div key={`${item.feature}-${i}`}><span className="sd-activity-dot" style={{backgroundColor:featureColors[item.feature as keyof typeof featureColors]}}/><span>{item.text}</span><time>{item.time}</time></div>)}</div></section>
    <section className="sd-feature-cards">{destinations.map(({to,name,detail,color})=><NavLink className="card-panel sd-feature-link" to={to} key={to} style={{'--feature-accent':color} as React.CSSProperties}><span>EXPLORE FEATURE</span><h2>{name}</h2><p>{detail}</p><b>Open demo →</b></NavLink>)}</section>
  </div>;
}

export function SpecAuditLog() {
  const liveLogs=useAppStore(state=>state.auditLogs);
  const [feature,setFeature]=useState('All');
  const [severity,setSeverity]=useState('All');
  const [query,setQuery]=useState('');
  const [from,setFrom]=useState('');
  const [to,setTo]=useState('');
  const allRows=useMemo(()=>[...liveLogs.map((row,index)=>({id:row.id,ts:`${DEMO_AUDIT_DATE} ${row.time}`,feature:row.module.includes('Sandbox')||row.module.includes('Runtime')?'Sandbox':row.module.includes('Document')?'Document':'Code',event:row.action,severity:'Info',actor:meta.currentUser.name.toLowerCase().replaceAll(' ','.'),hash:`${row.id.slice(-6)}...${String(index).padStart(4,'0')}`})),...auditLog],[liveLogs]);
  const features=['All',...new Set(allRows.map(row=>row.feature))];
  const severities=['All',...new Set(allRows.map(row=>row.severity))];
  const visible=useMemo(()=>allRows.filter(row=>
    (feature==='All'||row.feature===feature)&&
    (severity==='All'||row.severity===severity)&&
    (!from||row.ts.slice(0,10)>=from)&&(!to||row.ts.slice(0,10)<=to)&&
    `${row.ts} ${row.feature} ${row.event} ${row.actor} ${row.hash}`.toLowerCase().includes(query.toLowerCase())
  ),[feature,severity,query,from,to,allRows]);
  const csvRows=[['Timestamp','Feature','Event','Severity','Actor','Hash'],...visible.map(row=>[row.ts,row.feature,row.event,row.severity,row.actor,row.hash])];
  const csv=csvRows.map(row=>row.map(cell=>`"${cell.replaceAll('"','""')}"`).join(',')).join('\n');
  const exportCsv=()=>{const url=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'}));const anchor=document.createElement('a');anchor.href=url;anchor.download='ai-accelerator-audit-log.csv';anchor.click();URL.revokeObjectURL(url);};
  return <div className="feature-page spec-demo"><div className="page-heading"><div><span className="eyebrow">Supporting page · Tamper-evident demo trail</span><h1>Audit Log</h1><p>History of the supplied demo actions across all three features.</p></div><button className="primary-button" onClick={exportCsv}>Export CSV</button></div><div className="sd-banner">Hashes are illustrative demo values, not cryptographic verification.</div>
    <section className="card-panel sd-audit-filters"><input aria-label="Search audit events" placeholder="Search events, actors, hashes…" value={query} onChange={e=>setQuery(e.target.value)}/><select aria-label="Filter feature" value={feature} onChange={e=>setFeature(e.target.value)}>{features.map(x=><option key={x}>{x}</option>)}</select><select aria-label="Filter severity" value={severity} onChange={e=>setSeverity(e.target.value)}>{severities.map(x=><option key={x}>{x}</option>)}</select><label>From<input type="date" value={from} onChange={e=>setFrom(e.target.value)}/></label><label>To<input type="date" value={to} onChange={e=>setTo(e.target.value)}/></label></section>
    <div className="card-panel data-table-wrap"><table><thead><tr>{['Timestamp','Feature','Event','Severity','Actor','Hash'].map(x=><th key={x}>{x}</th>)}</tr></thead><tbody>{visible.map(row=><tr key={row.id}><td>{row.ts}</td><td>{row.feature}</td><td>{row.event}</td><td><span className={`sd-pill ${row.severity.toLowerCase()}`}>{row.severity}</span></td><td>{row.actor}</td><td><code>{row.hash}</code></td></tr>)}</tbody></table>{visible.length===0&&<p className="empty-state">No audit entries match these filters.</p>}</div><p className="sd-audit-count">Showing {visible.length} of {allRows.length} demo records</p>
  </div>;
}
