/* ==================================================================== */
/*  SALES CLOUD SHOWCASE — "Six steps. One system."                       */
/*  Step list on the left; each step opens a Lightning-style screen of    */
/*  what it looks like in Salesforce (HTML/CSS mock-ups, no screenshots,  */
/*  no Salesforce logos). Auto-advances every 6s, pauses on hover.        */
/*  Brought back from the September SalesCloud.html (Bing, 2026-11-09).   */
/* ==================================================================== */

const SS_STEPS = () => [
  { num: '01', illo: 'lead', title: tx('Capture and qualify leads', 'Leads binnenhalen en kwalificeren'),
    body: tx('Web forms, inbound mail, events and imports all land in one queue. Assignment rules route each lead to the right person, and scoring tells them who to call first.', 'Webformulieren, inkomende mail, events en imports komen in één wachtrij. Toewijzingsregels sturen elke lead naar de juiste persoon, en scoring laat zien wie je als eerste belt.'),
    points: [tx('Web-to-lead and email capture', 'Web-to-lead en e-mail capture'), tx('Assignment rules and queues', 'Toewijzingsregels en wachtrijen'), tx('Lead scoring and conversion', 'Leadscoring en conversie')] },
  { num: '02', illo: 'account', title: tx('Know the whole account', 'Ken het hele account'),
    body: tx('Every contact, meeting, email and open case on one record. Your reps walk into a call knowing what finance, service and the last rep already said.', 'Elke contactpersoon, afspraak, mail en open case op één kaart. Je verkopers weten bij elk gesprek wat finance, service en de vorige collega al hebben gezegd.'),
    points: [tx('Account and contact hierarchy', 'Account- en contacthiërarchie'), tx('Activity timeline', 'Activiteitentijdlijn'), tx('Related cases, orders and files', 'Gekoppelde cases, orders en bestanden')] },
  { num: '03', illo: 'pipeline', title: tx('Run the pipeline', 'Stuur de pipeline'),
    body: tx('Opportunities move through stages you define, with required fields and guidance at each one. Managers see stalled deals before they die quietly.', 'Opportunities gaan door fases die jij bepaalt, met verplichte velden en begeleiding per fase. Managers zien vastgelopen deals voordat ze stilletjes verdwijnen.'),
    points: [tx('Custom stages and sales paths', 'Eigen fases en salespaden'), tx('Kanban and list views', 'Kanban- en lijstweergaven'), tx('Stalled-deal alerts', 'Signalen bij vastgelopen deals')] },
  { num: '04', illo: 'forecast', title: tx('Forecast with confidence', 'Forecast met vertrouwen'),
    body: tx('Commit, best case and pipeline roll up from rep to team to region. Adjustments are tracked, so the number you give the board is one you can defend.', 'Commit, best case en pipeline tellen op van verkoper naar team naar regio. Aanpassingen worden bijgehouden, dus het getal dat je aan de directie geeft kun je onderbouwen.'),
    points: [tx('Collaborative forecasting', 'Gezamenlijke forecast'), tx('Quota tracking', 'Targets bijhouden'), tx('Forecast adjustments with history', 'Aanpassingen met historie')] },
  { num: '05', illo: 'quote', title: tx('Quote and get approval', 'Offreren en akkoord krijgen'),
    body: tx('Products, price books and discount rules live in the CRM. Quotes generate from the opportunity and approvals route to the right manager automatically.', 'Producten, prijsboeken en kortingsregels staan in het CRM. Offertes maak je vanuit de opportunity en goedkeuringen gaan automatisch naar de juiste manager.'),
    points: [tx('Products and price books', 'Producten en prijsboeken'), tx('Quote templates', 'Offertesjablonen'), tx('Discount approval flows', 'Goedkeuring van kortingen')] },
  { num: '06', illo: 'dashboard', title: tx('See what is working', 'Zie wat werkt'),
    body: tx('Win rates, cycle time, pipeline coverage and rep activity on dashboards that refresh themselves. The Monday meeting starts with facts instead of anecdotes.', 'Winratio, doorlooptijd, pipelinedekking en activiteit per verkoper op dashboards die zichzelf verversen. Het maandagoverleg begint met feiten in plaats van anekdotes.'),
    points: [tx('Reports and dashboards', 'Rapporten en dashboards'), tx('Pipeline coverage and velocity', 'Pipelinedekking en snelheid'), tx('Rep and team scorecards', 'Scorecards per verkoper en team')] },
];

/* Lightning-styled mock screens (copied unchanged from SalesCloud.html) */
const SfIcon = ({ color, glyph }) => <span className="sf-icon" style={{ background: color }}>{glyph}</span>;
const SfFrame = ({ app, tabs, active, children, wide }) => (
  <div className={'sf' + (wide ? ' sf--wide' : '')}>
    <div className="sf-global"><span className="sf-waffle" /><span className="sf-app">{app}</span><span className="sf-search">Search…</span><span className="sf-avatar" /></div>
    <div className="sf-nav">{tabs.map((t, i) => <span key={i} className={t === active ? 'is-on' : ''}>{t}</span>)}</div>
    <div className="sf-page">{children}</div>
  </div>
);
const SC_SF_TABS = ['Home', 'Leads', 'Accounts', 'Opportunities', 'Quotes', 'Dashboards'];

const Illo = ({ kind }) => {
  if (kind === 'lead') {
    const rows = [
      ['Noor Jansen', 'Havenwerk BV', 'Web', 'Hot', 92],
      ['Daan Visser', 'Brightline Energy', 'Event', 'Warm', 74],
      ['Iris de Groot', 'Kade & Zonen', 'Email', 'Warm', 61],
      ['Sem Meijer', 'Polder Logistiek', 'Import', 'Cold', 38],
    ];
    return (
      <SfFrame app="Sales" tabs={SC_SF_TABS} active="Leads">
        <div className="sf-card">
          <div className="sf-card-head">
            <SfIcon color="#F88962" glyph="L" />
            <div className="sf-card-title"><small>Leads</small><b>My Open Leads ▾</b></div>
            <span className="sf-btn sf-btn--brand">New</span>
          </div>
          <div className="sf-meta">4 items · Sorted by Score · Updated a few seconds ago</div>
          <table className="sf-table">
            <thead><tr><th>Name</th><th>Company</th><th>Source</th><th>Rating</th><th>Score</th></tr></thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i}><td><a>{r[0]}</a></td><td>{r[1]}</td><td>{r[2]}</td><td><span className={'sf-pill sf-pill--' + r[3].toLowerCase()}>{r[3]}</span></td><td><span className="sf-score"><i style={{ width: r[4] + '%' }} /></span>{r[4]}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </SfFrame>
    );
  }

  if (kind === 'account') {
    return (
      <SfFrame app="Sales" tabs={SC_SF_TABS} active="Accounts">
        <div className="sf-card sf-highlights">
          <SfIcon color="#7F8DE1" glyph="A" />
          <div className="sf-card-title"><small>Account</small><b>Havenwerk BV</b></div>
          <div className="sf-fields">
            <div><small>Type</small><span>Customer</span></div>
            <div><small>Industry</small><span>Logistics</span></div>
            <div><small>Owner</small><span><a>Lisa Vermeer</a></span></div>
            <div><small>Open Opps</small><span>3 · €218k</span></div>
          </div>
          <div className="sf-actions"><span className="sf-btn">Follow</span><span className="sf-btn">New Contact</span><span className="sf-btn">New Opportunity</span><span className="sf-btn sf-btn--brand">Edit</span></div>
        </div>
        <div className="sf-card">
          <div className="sf-tabs"><span className="is-on">Activity</span><span>Details</span><span>Related</span><span>Chatter</span></div>
          <div className="sf-timeline">
            {[
              ['📞', 'Call · Renewal terms discussed', 'Today · Lisa Vermeer'],
              ['✉️', 'Email · Quote Q-2041 sent to Noor Jansen', 'Yesterday'],
              ['✔︎', 'Case #4410 closed by Service', 'Mon'],
              ['📅', 'Meeting · Integration roadmap review', 'Last week'],
            ].map((t, i) => (
              <div key={i} className="sf-tl"><span className="sf-tl-ic">{t[0]}</span><div><a>{t[1]}</a><small>{t[2]}</small></div></div>
            ))}
          </div>
        </div>
      </SfFrame>
    );
  }

  if (kind === 'pipeline') {
    const cols = [
      ['Qualification', '€70k', ['Brightline Energy', '€48,000', '12 Oct'], ['Bouwgroep Zuid', '€22,000', '30 Oct']],
      ['Proposal', '€144k', ['Kade & Zonen', '€95,000', '18 Oct'], ['Polder Logistiek', '€31,000', '25 Oct'], ['Capisoft', '€18,000', '3 Nov']],
      ['Negotiation', '€140k', ['Havenwerk BV', '€140,000', '9 Oct']],
      ['Closed Won', '€62k', ['Nova Energy', '€62,000', '2 Oct']],
    ];
    return (
      <SfFrame app="Sales" tabs={SC_SF_TABS} active="Opportunities" wide>
        <div className="sf-card">
          <div className="sf-card-head">
            <SfIcon color="#FCB95B" glyph="O" />
            <div className="sf-card-title"><small>Opportunities</small><b>This Quarter ▾</b></div>
            <span className="sf-btn">Kanban ▾</span><span className="sf-btn sf-btn--brand">New</span>
          </div>
          <div className="sf-kanban">
            {cols.map((c, i) => (
              <div key={i} className="sf-col">
                <div className="sf-colhead"><b>{c[0]}</b><small>{c[1]} · {c.length - 2}</small></div>
                {c.slice(2).map((card, j) => (
                  <div key={j} className={'sf-kcard' + (i === 3 ? ' sf-kcard--won' : '')}><a>{card[0]}</a><span>{card[1]}</span><small>Close {card[2]}</small></div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </SfFrame>
    );
  }

  if (kind === 'forecast') {
    const rows = [['Lisa Vermeer', 310, 280, 390], ['Tom Bakker', 240, 260, 340], ['Amira Yildiz', 190, 220, 300]];
    const max = 400;
    return (
      <SfFrame app="Sales" tabs={SC_SF_TABS} active="Home">
        <div className="sf-card">
          <div className="sf-card-head">
            <SfIcon color="#3BA755" glyph="F" />
            <div className="sf-card-title"><small>Forecasts</small><b>Q4 FY26 · Team NL</b></div>
            <span className="sf-btn">Adjust</span>
          </div>
          <div className="sf-fc-summary">
            <div><small>Quota</small><b>€1.40M</b></div>
            <div><small>Closed</small><b>€0.74M</b></div>
            <div><small>Commit</small><b className="sf-blue">€1.21M</b></div>
            <div><small>Best Case</small><b>€1.36M</b></div>
          </div>
          <div className="sf-fc-rows">
            {rows.map((r, i) => (
              <div key={i} className="sf-fc-row">
                <a>{r[0]}</a>
                <div className="sf-fc-bar">
                  <i className="closed" style={{ width: (r[1] / max) * 100 + '%' }} />
                  <i className="commit" style={{ width: ((r[2] - r[1]) / max) * 100 + '%' }} />
                  <i className="best" style={{ width: ((r[3] - r[2]) / max) * 100 + '%' }} />
                  <em style={{ left: '87%' }} />
                </div>
                <span>€{r[2]}k</span>
              </div>
            ))}
          </div>
          <div className="sf-legend"><span><i className="closed" />Closed</span><span><i className="commit" />Commit</span><span><i className="best" />Best case</span><span><em />Quota</span></div>
        </div>
      </SfFrame>
    );
  }

  if (kind === 'quote') {
    const path = ['Draft', 'Review', 'Approved', 'Sent', 'Accepted'];
    return (
      <SfFrame app="Sales" tabs={SC_SF_TABS} active="Quotes">
        <div className="sf-card sf-highlights">
          <SfIcon color="#BF7CCC" glyph="Q" />
          <div className="sf-card-title"><small>Quote</small><b>Q-2041 · Havenwerk BV renewal</b></div>
          <span className="sf-btn">Create PDF</span><span className="sf-btn sf-btn--brand">Email Quote</span>
        </div>
        <div className="sf-path">
          {path.map((st, i) => <span key={i} className={i < 2 ? 'done' : i === 2 ? 'current' : ''}>{st}</span>)}
        </div>
        <div className="sf-card">
          <table className="sf-table sf-table--lines">
            <thead><tr><th>Product</th><th>Qty</th><th>List</th><th>Disc.</th><th>Total</th></tr></thead>
            <tbody>
              <tr><td>Sales Cloud Enterprise</td><td>40</td><td>€1,800</td><td>8%</td><td>€66,240</td></tr>
              <tr><td>Data migration</td><td>1</td><td>€6,400</td><td>—</td><td>€6,400</td></tr>
              <tr><td>Quickstart implementation</td><td>1</td><td>—</td><td>—</td><td>—</td></tr>
            </tbody>
          </table>
          <div className="sf-total"><span>Grand Total</span><b>€72,640</b></div>
          <div className="sf-approval"><span className="sf-check">✓</span> Discount &gt; 5% approved by <a>Sales Director</a> · today 14:02</div>
        </div>
      </SfFrame>
    );
  }

  if (kind === 'dashboard') {
    return (
      <SfFrame app="Sales" tabs={SC_SF_TABS} active="Dashboards" wide>
        <div className="sf-dash-head"><SfIcon color="#5867E8" glyph="D" /><div className="sf-card-title"><small>Dashboard</small><b>Sales Performance · Team NL</b></div><span className="sf-btn">Refresh</span></div>
        <div className="sf-dash">
          {[['Win Rate', '34%', '▲ 6 pts'], ['Avg. Cycle', '41 days', '▼ 9 days'], ['Pipeline Coverage', '3.2×', '▲ 0.4'], ['Activities / rep', '218', '▲ 31']].map((k, i) => (
            <div key={i} className="sf-card sf-metric"><small>{k[0]}</small><b>{k[1]}</b><em>{k[2]}</em></div>
          ))}
          <div className="sf-card sf-chart">
            <small>Pipeline by Stage</small>
            <div className="sf-bars">{[['Qual', 70], ['Prop', 144], ['Nego', 140], ['Won', 62]].map((b, i) => <div key={i}><i style={{ height: (b[1] / 150) * 100 + '%' }} /><span>{b[0]}</span></div>)}</div>
          </div>
          <div className="sf-card sf-chart">
            <small>Won by Source</small>
            <div className="sf-donut"><div className="sf-donut-ring" /><div className="sf-donut-legend"><span><i style={{ background: '#0176D3' }} />Inbound 46%</span><span><i style={{ background: '#1B96FF' }} />Partner 31%</span><span><i style={{ background: '#AACBFF' }} />Events 23%</span></div></div>
          </div>
        </div>
      </SfFrame>
    );
  }

  return null;
};

const SC_SHOWCASE_CSS = `
.sf { width: 100%; max-width: 460px; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif; font-size: 12px; color: #181818; background: #F3F3F3; border: 1px solid #C9C9C9; border-radius: 10px; overflow: hidden; box-shadow: 0 30px 60px -36px rgba(64,35,1,.45); letter-spacing: 0; }
.sf--wide { max-width: 580px; }
.sf a { color: #0176D3; text-decoration: none; cursor: default; }
.sf b { font-weight: 600; }
.sf small { color: #747474; font-size: 11px; }
.sf-global { display: flex; align-items: center; gap: 10px; padding: 7px 12px; background: #fff; border-bottom: 1px solid #E5E5E5; }
.sf-waffle { width: 14px; height: 14px; background: radial-gradient(#747474 1.4px, transparent 1.5px) 0 0 / 5px 5px; flex: none; }
.sf-app { font-weight: 700; font-size: 13px; }
.sf-search { flex: 1; margin: 0 8px; height: 22px; line-height: 22px; padding: 0 10px; border: 1px solid #C9C9C9; border-radius: 12px; color: #747474; background: #fff; font-size: 11px; }
.sf-avatar { width: 20px; height: 20px; border-radius: 50%; background: #9050E9; flex: none; }
.sf-nav { display: flex; gap: 2px; padding: 0 8px; background: #0176D3; }
.sf-nav span { padding: 7px 10px; color: rgba(255,255,255,.85); font-size: 11.5px; white-space: nowrap; }
.sf-nav span.is-on { color: #fff; font-weight: 600; box-shadow: inset 0 -3px 0 #fff; }
.sf-page { padding: 10px; display: flex; flex-direction: column; gap: 10px; }
.sf-card { background: #fff; border: 1px solid #E5E5E5; border-radius: 6px; padding: 10px 12px; box-shadow: 0 2px 2px rgba(0,0,0,.05); }
.sf-card-head { display: flex; align-items: center; gap: 10px; }
.sf-card-title { display: flex; flex-direction: column; gap: 1px; flex: 1; min-width: 0; }
.sf-card-title b { font-size: 14px; font-weight: 700; letter-spacing: -.01em; }
.sf-icon { width: 28px; height: 28px; border-radius: 6px; display: grid; place-items: center; color: #fff; font-weight: 700; font-size: 13px; flex: none; }
.sf-btn { display: inline-flex; align-items: center; height: 24px; padding: 0 10px; border: 1px solid #747474; border-radius: 4px; background: #fff; color: #0176D3; font-size: 11.5px; font-weight: 500; white-space: nowrap; }
.sf-btn--brand { background: #0176D3; border-color: #0176D3; color: #fff; }
.sf-meta { margin: 6px 0 4px 38px; font-size: 10.5px; color: #747474; }
.sf-table { width: 100%; border-collapse: collapse; margin-top: 6px; }
.sf-table th { text-align: left; font-weight: 600; font-size: 10.5px; color: #444; padding: 6px 6px; background: #FAFAF9; border-top: 1px solid #E5E5E5; border-bottom: 1px solid #E5E5E5; }
.sf-table td { padding: 7px 6px; border-bottom: 1px solid #F0F0F0; white-space: nowrap; font-size: 11.5px; }
.sf-table--lines td:nth-child(n+2), .sf-table--lines th:nth-child(n+2) { text-align: right; }
.sf-pill { display: inline-block; padding: 1px 7px; border-radius: 10px; font-size: 10px; font-weight: 600; }
.sf-pill--hot { background: #FEDED8; color: #BA0517; } .sf-pill--warm { background: #FEF1E0; color: #8C4B02; } .sf-pill--cold { background: #EAF5FE; color: #014486; }
.sf-score { display: inline-block; width: 44px; height: 5px; border-radius: 3px; background: #E5E5E5; margin-right: 6px; vertical-align: middle; overflow: hidden; }
.sf-score i { display: block; height: 100%; background: #0176D3; }
.sf-highlights { display: grid; grid-template-columns: auto 1fr; gap: 8px 10px; align-items: center; }
.sf-highlights .sf-card-title { grid-column: 2; }
.sf-fields { grid-column: 1 / -1; display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; padding-top: 8px; border-top: 1px solid #E5E5E5; }
.sf-fields div { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
.sf-fields span { font-size: 11.5px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.sf-actions { grid-column: 1 / -1; display: flex; gap: 6px; flex-wrap: wrap; }
.sf-highlights .sf-btn { grid-column: auto; }
.sf-tabs { display: flex; gap: 16px; border-bottom: 1px solid #E5E5E5; margin: -2px 0 8px; }
.sf-tabs span { padding: 4px 0 8px; font-size: 11.5px; color: #444; }
.sf-tabs span.is-on { color: #0176D3; font-weight: 600; box-shadow: inset 0 -3px 0 #0176D3; }
.sf-timeline { display: flex; flex-direction: column; gap: 8px; }
.sf-tl { display: flex; gap: 10px; align-items: flex-start; }
.sf-tl-ic { width: 22px; height: 22px; border-radius: 50%; background: #F3F3F3; display: grid; place-items: center; font-size: 11px; flex: none; }
.sf-tl div { display: flex; flex-direction: column; gap: 1px; }
.sf-tl a { font-size: 11.5px; }
.sf-kanban { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 8px; margin-top: 10px; }
.sf-col { background: #F3F3F3; border-radius: 6px; padding: 6px; min-height: 120px; }
.sf-colhead { display: flex; flex-direction: column; gap: 1px; padding: 2px 4px 6px; }
.sf-colhead b { font-size: 11px; }
.sf-kcard { background: #fff; border: 1px solid #E5E5E5; border-left: 3px solid #0176D3; border-radius: 4px; padding: 6px 8px; margin-bottom: 6px; display: flex; flex-direction: column; gap: 2px; font-size: 11px; }
.sf-kcard--won { border-left-color: #2E844A; }
.sf-kcard span { font-weight: 600; }
.sf-fc-summary { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin: 10px 0; padding: 8px 0; border-top: 1px solid #E5E5E5; border-bottom: 1px solid #E5E5E5; }
.sf-fc-summary div { display: flex; flex-direction: column; gap: 2px; }
.sf-fc-summary b { font-size: 15px; }
.sf-blue { color: #0176D3; }
.sf-fc-rows { display: flex; flex-direction: column; gap: 9px; }
.sf-fc-row { display: grid; grid-template-columns: 90px 1fr 48px; gap: 10px; align-items: center; font-size: 11.5px; }
.sf-fc-row span { text-align: right; font-weight: 600; }
.sf-fc-bar { position: relative; height: 14px; background: #F3F3F3; border-radius: 3px; display: flex; overflow: visible; }
.sf-fc-bar i, .sf-legend i { display: block; height: 100%; }
.sf-fc-bar i.closed, .sf-legend i.closed { background: #032D60; } .sf-fc-bar i.commit, .sf-legend i.commit { background: #0176D3; } .sf-fc-bar i.best, .sf-legend i.best { background: #AACBFF; }
.sf-fc-bar i:first-child { border-radius: 3px 0 0 3px; }
.sf-fc-bar em { position: absolute; top: -3px; bottom: -3px; width: 2px; background: #BA0517; }
.sf-legend { display: flex; gap: 12px; margin-top: 10px; font-size: 10.5px; color: #444; }
.sf-legend span { display: inline-flex; align-items: center; gap: 5px; }
.sf-legend i { width: 10px; height: 10px; border-radius: 2px; }
.sf-legend em { width: 2px; height: 10px; background: #BA0517; display: inline-block; }
.sf-path { display: flex; gap: 2px; }
.sf-path span { flex: 1; text-align: center; font-size: 10.5px; font-weight: 600; padding: 6px 4px; background: #fff; color: #444; border: 1px solid #C9C9C9; clip-path: polygon(0 0, calc(100% - 8px) 0, 100% 50%, calc(100% - 8px) 100%, 0 100%, 8px 50%); white-space: nowrap; overflow: hidden; }
.sf-path span.done { background: #2E844A; color: #fff; border-color: #2E844A; }
.sf-path span.current { background: #0176D3; color: #fff; border-color: #0176D3; }
.sf-total { display: flex; justify-content: space-between; padding: 8px 6px 4px; font-size: 13px; }
.sf-approval { margin-top: 6px; padding: 7px 8px; background: #EBF7E6; border-radius: 4px; font-size: 11px; color: #2E844A; display: flex; align-items: center; gap: 6px; }
.sf-check { width: 16px; height: 16px; border-radius: 50%; background: #2E844A; color: #fff; display: grid; place-items: center; font-size: 10px; }
.sf-dash-head { display: flex; align-items: center; gap: 10px; }
.sf-dash { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 8px; }
.sf-metric { display: flex; flex-direction: column; gap: 2px; padding: 10px; }
.sf-metric b { font-size: 20px; letter-spacing: -.01em; }
.sf-metric em { font-style: normal; font-size: 10.5px; color: #2E844A; }
.sf-chart { grid-column: span 2; display: flex; flex-direction: column; gap: 8px; min-height: 120px; }
.sf-bars { display: flex; align-items: flex-end; gap: 12px; height: 84px; padding: 0 4px; }
.sf-bars div { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: flex-end; height: 100%; gap: 4px; }
.sf-bars i { display: block; width: 100%; background: #0176D3; border-radius: 3px 3px 0 0; }
.sf-bars span { font-size: 10px; color: #747474; }
.sf-donut { display: flex; align-items: center; gap: 14px; }
.sf-donut-ring { width: 76px; height: 76px; border-radius: 50%; background: conic-gradient(#0176D3 0 46%, #1B96FF 46% 77%, #AACBFF 77% 100%); -webkit-mask: radial-gradient(circle 24px, transparent 98%, #000 100%); mask: radial-gradient(circle 24px, transparent 98%, #000 100%); flex: none; }
.sf-donut-legend { display: flex; flex-direction: column; gap: 5px; font-size: 11px; }
.sf-donut-legend span { display: inline-flex; align-items: center; gap: 6px; }
.sf-donut-legend i { width: 9px; height: 9px; border-radius: 2px; }
.sc-dot { width: 7px; height: 7px; border-radius: 999px; background: var(--intigris-coral); flex: none; margin-top: 7px; }
.sc-show { display: grid; grid-template-columns: minmax(0, .9fr) minmax(0, 1.5fr); gap: clamp(24px, 3vw, 48px); align-items: start; }
.sc-show-list { display: flex; flex-direction: column; gap: 10px; }
.sc-show-item { appearance: none; font: inherit; text-align: left; cursor: pointer; display: grid; grid-template-columns: 34px 1fr 20px; gap: 12px; align-items: center; padding: 14px 16px; background: var(--intigris-paper); border: 1px solid var(--border); border-radius: 16px; color: var(--intigris-dark-brown); transition: background 200ms var(--ease-out), border-color 200ms var(--ease-out), transform 200ms var(--ease-out); }
.sc-show-item:hover { border-color: var(--intigris-coral); }
.sc-show-item.is-on { background: var(--intigris-coral); border-color: var(--intigris-coral); color: var(--intigris-dark-brown); transform: translateX(6px); }
.sc-show-num { font-size: 12px; font-weight: 600; letter-spacing: .12em; color: var(--intigris-coral-700); }
.sc-show-item.is-on .sc-show-num { color: var(--intigris-dark-brown); }
.sc-show-copy { display: flex; flex-direction: column; gap: 3px; min-width: 0; }
.sc-show-copy b { font-size: 17px; font-weight: 500; letter-spacing: -.014em; }
.sc-show-copy small { font-size: 12.5px; color: var(--fg-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.sc-show-item.is-on .sc-show-copy small { color: rgba(64,35,1,.75); }
.sc-show-arrow { color: var(--intigris-coral); transition: transform 200ms var(--ease-out); }
.sc-show-item.is-on .sc-show-arrow { color: var(--intigris-dark-brown); transform: translateX(3px); }
.sc-show-stage { background: var(--intigris-paper); border: 1px solid var(--border); border-radius: var(--radius-xl); padding: clamp(20px, 2.5vw, 36px); }
.sc-show-stage--stack { display: flex; flex-direction: column; gap: clamp(20px, 2.5vw, 32px); }
.sc-show-detail--stack h3 { margin: 0 0 14px; }
.sc-show-detail--row { display: grid; grid-template-columns: minmax(0, 1.3fr) minmax(0, .9fr); gap: clamp(16px, 3vw, 48px); align-items: start; }
.sc-show-detail--stack .sc-show-detail--row p { margin: 0; max-width: 620px; }
.sc-show-detail--stack .sc-show-detail--row ul { margin: 0; padding-left: 0; gap: 0; }
.sc-show-detail--stack .sc-show-detail--row li { font-size: 15.5px; line-height: 1.55; color: var(--fg-muted); }
.sc-show-detail--stack .sc-show-detail--row li .sc-dot { margin-top: 8.5px; }
.sc-show-stage--stack .sc-show-screen .sf { max-width: none; width: 100%; }
.sc-show-stage--stack .sc-show-screen .sf:not(.sf--wide) { max-width: 640px; }
.sc-show-screen { display: flex; justify-content: center; animation: scShowFade 400ms var(--ease-out) both; }
.sc-show-detail { animation: scShowFade 400ms var(--ease-out) both; }
.sc-show-detail h3 { font-size: clamp(24px, 2.4vw, 32px); font-weight: 500; letter-spacing: -.02em; line-height: 1.08; margin: 0; }
.sc-show-detail p { margin: 14px 0 0; font-size: 15.5px; line-height: 1.55; color: var(--fg-muted); }
.sc-show-detail ul { list-style: none; margin: 18px 0 0; padding: 0; display: flex; flex-direction: column; gap: 8px; }
.sc-show-detail li { display: flex; gap: 10px; align-items: flex-start; font-size: 14.5px; }
@keyframes scShowFade { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
@media (max-width: 980px) { .sc-show, .sc-show-detail--row { grid-template-columns: 1fr; } }
@media (prefers-reduced-motion: reduce) { .sc-show-screen, .sc-show-detail { animation: none; } }
`;

function V3SalesShowcase({ head }) {
  const steps = SS_STEPS();
  const [active, setActive] = React.useState(0);
  const [paused, setPaused] = React.useState(false);
  const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  React.useEffect(() => { if (paused || reduce) return; const t = setInterval(() => setActive(a => (a + 1) % steps.length), 6000); return () => clearInterval(t); }, [paused]);
  const s = steps[active];
  return (
    <section id="how" className="ck-section sc-showcase">
      <div className="container-wide">
        <CkHead {...head} />
        <div className="sc-show" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
          <div className="sc-show-list">
            {steps.map((st, i) => (
              <button key={st.num} type="button" className={'sc-show-item' + (i === active ? ' is-on' : '')} onClick={() => setActive(i)} aria-pressed={i === active}>
                <span className="sc-show-num">{st.num}</span>
                <span className="sc-show-copy"><b>{st.title}</b><small>{st.points[0]} · {st.points[1]}</small></span>
                <span className="sc-show-arrow" aria-hidden>→</span>
              </button>
            ))}
          </div>
          <div className="sc-show-stage sc-show-stage--stack">
            <div key={'h' + s.num} className="sc-show-detail sc-show-detail--stack">
              <h3>{s.title}</h3>
              <div className="sc-show-detail--row">
                <p>{s.body}</p>
                <ul>{s.points.map((p, j) => <li key={j}><span aria-hidden className="sc-dot" />{p}</li>)}</ul>
              </div>
            </div>
            <div key={s.num} className="sc-show-screen"><Illo kind={s.illo} /></div>
          </div>
        </div>
      </div>
      <style>{SC_SHOWCASE_CSS}</style>
    </section>
  );
}

Object.assign(window, { V3SalesShowcase });
