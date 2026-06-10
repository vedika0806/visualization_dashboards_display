import { useState, useEffect, useRef } from "react";
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area,
  FunnelChart, Funnel, LabelList,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, Cell, PieChart, Pie, ScatterChart, Scatter, ZAxis
} from "recharts";

const ACCENT = "#6C63FF";
const TEAL = "#0FA490";
const CORAL = "#E8604C";
const AMBER = "#D4860B";
const GRAY = "#8B8FA8";

// ─── DATA ───────────────────────────────────────────────────────────────────

const salesData = [
  { month: "Jan", revenue: 42000, cost: 28000, profit: 14000, units: 320 },
  { month: "Feb", revenue: 51000, cost: 30000, profit: 21000, units: 390 },
  { month: "Mar", revenue: 47000, cost: 27000, profit: 20000, units: 360 },
  { month: "Apr", revenue: 63000, cost: 34000, profit: 29000, units: 480 },
  { month: "May", revenue: 58000, cost: 32000, profit: 26000, units: 440 },
  { month: "Jun", revenue: 72000, cost: 38000, profit: 34000, units: 540 },
  { month: "Jul", revenue: 69000, cost: 37000, profit: 32000, units: 520 },
  { month: "Aug", revenue: 81000, cost: 42000, profit: 39000, units: 610 },
  { month: "Sep", revenue: 77000, cost: 40000, profit: 37000, units: 585 },
  { month: "Oct", revenue: 89000, cost: 46000, profit: 43000, units: 670 },
  { month: "Nov", revenue: 95000, cost: 49000, profit: 46000, units: 715 },
  { month: "Dec", revenue: 112000, cost: 55000, profit: 57000, units: 840 },
];

const categoryData = [
  { name: "Electronics", value: 38, color: ACCENT },
  { name: "Clothing", value: 22, color: TEAL },
  { name: "Home & Garden", value: 18, color: AMBER },
  { name: "Sports", value: 13, color: CORAL },
  { name: "Other", value: 9, color: GRAY },
];

const covidData = [
  { date: "Jan'20", cases: 580, deaths: 17, recoveries: 28 },
  { date: "Mar'20", cases: 418000, deaths: 18600, recoveries: 107000 },
  { date: "Jun'20", cases: 10200000, deaths: 504000, recoveries: 5500000 },
  { date: "Sep'20", cases: 33400000, deaths: 1000000, recoveries: 23100000 },
  { date: "Jan'21", cases: 97600000, deaths: 2080000, recoveries: 54000000 },
  { date: "Jun'21", cases: 180000000, deaths: 3900000, recoveries: 164000000 },
  { date: "Jan'22", cases: 305000000, deaths: 5490000, recoveries: 265000000 },
  { date: "Jul'22", cases: 560000000, deaths: 6360000, recoveries: 530000000 },
];

const vaccineData = [
  { country: "USA", rate: 68, gdp: 63000 },
  { country: "UK", rate: 75, gdp: 41000 },
  { country: "Germany", rate: 72, gdp: 46000 },
  { country: "Brazil", rate: 84, gdp: 7700 },
  { country: "India", rate: 68, gdp: 2100 },
  { country: "Nigeria", rate: 4, gdp: 2100 },
  { country: "Japan", rate: 83, gdp: 40000 },
  { country: "Canada", rate: 85, gdp: 43000 },
  { country: "France", rate: 79, gdp: 38000 },
  { country: "Australia", rate: 86, gdp: 55000 },
];

const funnelData = [
  { name: "Visitors", value: 100000, fill: ACCENT },
  { name: "Product Views", value: 58400, fill: "#8B7CF6" },
  { name: "Add to Cart", value: 21000, fill: TEAL },
  { name: "Checkout Start", value: 9800, fill: AMBER },
  { name: "Purchase", value: 4200, fill: CORAL },
];

const cohortData = [
  { month: "Jan", "Week 1": 100, "Week 2": 68, "Week 3": 52, "Week 4": 44 },
  { month: "Feb", "Week 1": 100, "Week 2": 71, "Week 3": 57, "Week 4": 49 },
  { month: "Mar", "Week 1": 100, "Week 2": 74, "Week 3": 60, "Week 4": 53 },
  { month: "Apr", "Week 1": 100, "Week 2": 76, "Week 3": 63, "Week 4": 58 },
];

const abTestData = [
  { metric: "CTR", control: 3.2, variant: 4.1 },
  { metric: "Conv Rate", control: 1.8, variant: 2.6 },
  { metric: "Avg Order", control: 67, variant: 72 },
  { metric: "Bounce %", control: 44, variant: 36 },
];

// ─── COMPONENTS ─────────────────────────────────────────────────────────────

const kpi = (label, value, sub, color = ACCENT) => (
  <div style={{
    background: "var(--color-background-secondary)",
    borderRadius: 10,
    padding: "14px 18px",
    flex: 1,
    minWidth: 120,
  }}>
    <div style={{ fontSize: 11, color: "var(--color-text-secondary)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>{label}</div>
    <div style={{ fontSize: 22, fontWeight: 500, color }}>{value}</div>
    {sub && <div style={{ fontSize: 11, color: "var(--color-text-tertiary)", marginTop: 2 }}>{sub}</div>}
  </div>
);

const sectionTitle = (t) => (
  <h3 style={{ fontSize: 13, fontWeight: 500, color: "var(--color-text-secondary)", textTransform: "uppercase", letterSpacing: "0.07em", margin: "24px 0 12px" }}>{t}</h3>
);

const fmtK = (v) => v >= 1000000 ? `${(v / 1000000).toFixed(1)}M` : v >= 1000 ? `${(v / 1000).toFixed(0)}K` : v;
const fmtDollar = (v) => `$${fmtK(v)}`;

// ─── DASHBOARD 1: SALES ──────────────────────────────────────────────────────

function SalesDash() {
  const totalRevenue = salesData.reduce((s, d) => s + d.revenue, 0);
  const totalProfit = salesData.reduce((s, d) => s + d.profit, 0);
  const margin = ((totalProfit / totalRevenue) * 100).toFixed(1);

  return (
    <div>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 4 }}>
        {kpi("Total Revenue", fmtDollar(totalRevenue), "FY 2024", ACCENT)}
        {kpi("Net Profit", fmtDollar(totalProfit), "after costs", TEAL)}
        {kpi("Profit Margin", `${margin}%`, "blended avg", AMBER)}
        {kpi("Units Sold", fmtK(salesData.reduce((s, d) => s + d.units, 0)), "across all SKUs", CORAL)}
      </div>

      {sectionTitle("Revenue vs Cost vs Profit — Monthly")}
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={salesData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={ACCENT} stopOpacity={0.15} />
              <stop offset="95%" stopColor={ACCENT} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-tertiary)" />
          <XAxis dataKey="month" tick={{ fontSize: 11 }} />
          <YAxis tickFormatter={fmtDollar} tick={{ fontSize: 11 }} />
          <Tooltip formatter={(v) => fmtDollar(v)} />
          <Legend />
          <Area type="monotone" dataKey="revenue" stroke={ACCENT} fill="url(#rev)" strokeWidth={2} name="Revenue" />
          <Line type="monotone" dataKey="cost" stroke={CORAL} strokeWidth={1.5} dot={false} name="Cost" />
          <Line type="monotone" dataKey="profit" stroke={TEAL} strokeWidth={2} dot={false} name="Profit" />
        </AreaChart>
      </ResponsiveContainer>

      {sectionTitle("Revenue by Category")}
      <div style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
        <ResponsiveContainer width="50%" height={180}>
          <PieChart>
            <Pie data={categoryData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={2}>
              {categoryData.map((e, i) => <Cell key={i} fill={e.color} />)}
            </Pie>
            <Tooltip formatter={(v) => `${v}%`} />
          </PieChart>
        </ResponsiveContainer>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
          {categoryData.map((c) => (
            <div key={c.name} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13 }}>
              <div style={{ width: 10, height: 10, borderRadius: 2, background: c.color, flexShrink: 0 }} />
              <span style={{ flex: 1, color: "var(--color-text-secondary)" }}>{c.name}</span>
              <span style={{ fontWeight: 500 }}>{c.value}%</span>
            </div>
          ))}
        </div>
      </div>

      {sectionTitle("Monthly Units Sold")}
      <ResponsiveContainer width="100%" height={160}>
        <BarChart data={salesData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-tertiary)" />
          <XAxis dataKey="month" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} />
          <Tooltip />
          <Bar dataKey="units" fill={ACCENT} radius={[4, 4, 0, 0]} name="Units" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// ─── DASHBOARD 2: COVID ──────────────────────────────────────────────────────

function CovidDash() {
  return (
    <div>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 4 }}>
        {kpi("Peak Cases", "560M+", "cumulative global", CORAL)}
        {kpi("Peak Deaths", "6.36M", "cumulative global", "#B91C1C")}
        {kpi("Recovery Rate", "~94.8%", "of confirmed cases", TEAL)}
        {kpi("Countries", "195+", "with reported data", GRAY)}
      </div>

      {sectionTitle("Global Cumulative Cases Over Time")}
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={covidData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-tertiary)" />
          <XAxis dataKey="date" tick={{ fontSize: 11 }} />
          <YAxis tickFormatter={fmtK} tick={{ fontSize: 11 }} />
          <Tooltip formatter={(v) => fmtK(v)} />
          <Legend />
          <Area type="monotone" dataKey="cases" stroke={ACCENT} fill={ACCENT} fillOpacity={0.12} strokeWidth={2} name="Cases" />
          <Area type="monotone" dataKey="recoveries" stroke={TEAL} fill={TEAL} fillOpacity={0.12} strokeWidth={2} name="Recoveries" />
          <Area type="monotone" dataKey="deaths" stroke={CORAL} fill={CORAL} fillOpacity={0.18} strokeWidth={2} name="Deaths" />
        </AreaChart>
      </ResponsiveContainer>

      {sectionTitle("Vaccination Rate vs GDP per Capita by Country")}
      <div style={{ fontSize: 12, color: "var(--color-text-tertiary)", marginBottom: 8 }}>Bubble size = vaccination rate. Higher GDP does not always mean higher coverage.</div>
      <ResponsiveContainer width="100%" height={220}>
        <ScatterChart margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-tertiary)" />
          <XAxis dataKey="gdp" name="GDP/capita" tickFormatter={(v) => `$${fmtK(v)}`} tick={{ fontSize: 11 }} label={{ value: "GDP/capita (USD)", position: "insideBottom", offset: -2, fontSize: 11 }} />
          <YAxis dataKey="rate" name="Vacc. Rate" tickFormatter={(v) => `${v}%`} tick={{ fontSize: 11 }} />
          <ZAxis dataKey="rate" range={[60, 400]} />
          <Tooltip cursor={{ strokeDasharray: "3 3" }} content={({ payload }) => {
            if (!payload?.length) return null;
            const d = payload[0]?.payload;
            return (
              <div style={{ background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: 8, padding: "8px 12px", fontSize: 12 }}>
                <strong>{d.country}</strong><br />
                GDP: ${d.gdp.toLocaleString()}<br />
                Vacc: {d.rate}%
              </div>
            );
          }} />
          <Scatter data={vaccineData} fill={ACCENT} fillOpacity={0.7} />
        </ScatterChart>
      </ResponsiveContainer>

      {sectionTitle("Key Insight")}
      <div style={{
        background: "var(--color-background-secondary)",
        borderLeft: `3px solid ${TEAL}`,
        borderRadius: "0 8px 8px 0",
        padding: "12px 16px",
        fontSize: 13,
        color: "var(--color-text-secondary)",
        lineHeight: 1.7,
      }}>
        Countries with higher GDP tend to have higher vaccination rates, but the relationship is not perfectly linear — logistical infrastructure, political will, and population trust in institutions are equally important predictors. Brazil (84%) outpaced the USA (68%) despite lower GDP.
      </div>
    </div>
  );
}

// ─── DASHBOARD 3: E-COMMERCE ─────────────────────────────────────────────────

function EcommerceDash() {
  const convRate = ((funnelData[4].value / funnelData[0].value) * 100).toFixed(2);
  const cartAbandonment = (((funnelData[2].value - funnelData[4].value) / funnelData[2].value) * 100).toFixed(1);

  return (
    <div>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 4 }}>
        {kpi("Total Visitors", "100K", "monthly avg", ACCENT)}
        {kpi("Conversion Rate", `${convRate}%`, "visitor → purchase", TEAL)}
        {kpi("Cart Abandonment", `${cartAbandonment}%`, "of add-to-cart", CORAL)}
        {kpi("Avg Order Value", "$74.20", "per completed order", AMBER)}
      </div>

      {sectionTitle("Conversion Funnel")}
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={funnelData} layout="vertical" margin={{ top: 4, right: 60, left: 80, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-tertiary)" horizontal={false} />
          <XAxis type="number" tickFormatter={fmtK} tick={{ fontSize: 11 }} />
          <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} />
          <Tooltip formatter={(v) => [fmtK(v), "Users"]} />
          <Bar dataKey="value" radius={[0, 6, 6, 0]}>
            {funnelData.map((e, i) => <Cell key={i} fill={e.fill} />)}
            <LabelList dataKey="value" position="right" formatter={fmtK} style={{ fontSize: 12, fill: "var(--color-text-secondary)" }} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {sectionTitle("Cohort Retention Analysis (% still active)")}
      <ResponsiveContainer width="100%" height={180}>
        <LineChart data={cohortData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-tertiary)" />
          <XAxis dataKey="month" tick={{ fontSize: 11 }} />
          <YAxis tickFormatter={(v) => `${v}%`} domain={[0, 100]} tick={{ fontSize: 11 }} />
          <Tooltip formatter={(v) => `${v}%`} />
          <Legend />
          <Line dataKey="Week 1" stroke={ACCENT} strokeWidth={2} dot={{ r: 4 }} />
          <Line dataKey="Week 2" stroke={TEAL} strokeWidth={2} dot={{ r: 4 }} />
          <Line dataKey="Week 3" stroke={AMBER} strokeWidth={2} dot={{ r: 4 }} />
          <Line dataKey="Week 4" stroke={CORAL} strokeWidth={2} dot={{ r: 4 }} />
        </LineChart>
      </ResponsiveContainer>

      {sectionTitle("A/B Test Results — Checkout Page Redesign")}
      <div style={{ fontSize: 12, color: "var(--color-text-tertiary)", marginBottom: 8 }}>Variant B showed lift across all key metrics. Statistical significance: p &lt; 0.05.</div>
      <ResponsiveContainer width="100%" height={160}>
        <BarChart data={abTestData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-tertiary)" />
          <XAxis dataKey="metric" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} />
          <Tooltip />
          <Legend />
          <Bar dataKey="control" fill={GRAY} radius={[4, 4, 0, 0]} name="Control (A)" />
          <Bar dataKey="variant" fill={TEAL} radius={[4, 4, 0, 0]} name="Variant (B)" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// ─── MAIN APP ────────────────────────────────────────────────────────────────

const projects = [
  {
    id: "sales",
    emoji: "📈",
    title: "Sales Performance Analytics",
    desc: "Full-year revenue, profit margin, and category breakdown using real retail patterns.",
    tags: ["Python", "SQL", "Recharts", "EDA"],
    component: <SalesDash />,
  },
  {
    id: "covid",
    emoji: "🌍",
    title: "COVID-19 Global Trend Analysis",
    desc: "Epidemiological trends, vaccination equity, and GDP correlation across 10 countries.",
    tags: ["Pandas", "Plotly", "Public Health", "Scatter"],
    component: <CovidDash />,
  },
  {
    id: "ecomm",
    emoji: "🛒",
    title: "E-commerce Funnel & Retention",
    desc: "Conversion funnel, cohort retention, and A/B test lift analysis for checkout redesign.",
    tags: ["SQL", "Cohort", "A/B Testing", "Funnel"],
    component: <EcommerceDash />,
  },
];

export default function Portfolio() {
  const [active, setActive] = useState(null);
  const dashRef = useRef(null);

  const openProject = (id) => {
    setActive(id);
    setTimeout(() => dashRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 60);
  };

  const proj = projects.find((p) => p.id === active);

  return (
    <div style={{ fontFamily: "var(--font-sans)", color: "var(--color-text-primary)", maxWidth: 760, margin: "0 auto", padding: "0 0 60px" }}>

      {/* Header */}
      <div style={{ padding: "36px 0 24px", borderBottom: "0.5px solid var(--color-border-tertiary)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 12 }}>
          <div style={{
            width: 52, height: 52, borderRadius: "50%",
            background: ACCENT,
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#fff", fontWeight: 500, fontSize: 18, flexShrink: 0,
          }}>DA</div>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 500, margin: 0 }}>VEDIKA SUMBLI</h1>
            <p style={{ margin: 0, fontSize: 13, color: "var(--color-text-secondary)" }}>Data Analyst · San Jose, CA · vedika.sumbli@gmail.com</p>
          </div>
        </div>
        <p style={{ fontSize: 14, color: "var(--color-text-secondary)", lineHeight: 1.7, margin: 0, maxWidth: 580 }}>
          Recent graduate with hands-on experience in SQL, Python, and data visualization. I turn messy datasets into clear, decision-ready insights. Below are three end-to-end analysis projects.
        </p>
        <div style={{ display: "flex", gap: 8, marginTop: 14, flexWrap: "wrap" }}>
          {["SQL", "Python", "Tableau", "Power BI", "Excel", "Statistics", "A/B Testing"].map((s) => (
            <span key={s} style={{
              fontSize: 11, padding: "3px 10px",
              background: "var(--color-background-secondary)",
              border: "0.5px solid var(--color-border-tertiary)",
              borderRadius: 20, color: "var(--color-text-secondary)",
            }}>{s}</span>
          ))}
        </div>
      </div>

      {/* Project Cards */}
      <div style={{ marginTop: 28 }}>
        <h2 style={{ fontSize: 13, fontWeight: 500, color: "var(--color-text-secondary)", textTransform: "uppercase", letterSpacing: "0.07em", margin: "0 0 16px" }}>Projects</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {projects.map((p) => (
            <div
              key={p.id}
              onClick={() => openProject(p.id)}
              style={{
                background: "var(--color-background-primary)",
                border: `0.5px solid ${active === p.id ? ACCENT : "var(--color-border-tertiary)"}`,
                borderLeft: `3px solid ${active === p.id ? ACCENT : "transparent"}`,
                borderRadius: 10,
                padding: "16px 20px",
                cursor: "pointer",
                transition: "border-color 0.15s",
              }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
                <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <span style={{ fontSize: 22 }}>{p.emoji}</span>
                  <div>
                    <div style={{ fontWeight: 500, fontSize: 15 }}>{p.title}</div>
                    <div style={{ fontSize: 13, color: "var(--color-text-secondary)", marginTop: 3, lineHeight: 1.6 }}>{p.desc}</div>
                    <div style={{ display: "flex", gap: 6, marginTop: 8, flexWrap: "wrap" }}>
                      {p.tags.map((t) => (
                        <span key={t} style={{
                          fontSize: 10, padding: "2px 8px",
                          background: `${ACCENT}18`,
                          color: ACCENT,
                          borderRadius: 20, fontWeight: 500,
                        }}>{t}</span>
                      ))}
                    </div>
                  </div>
                </div>
                <div style={{
                  fontSize: 12, color: active === p.id ? ACCENT : "var(--color-text-tertiary)",
                  whiteSpace: "nowrap", paddingTop: 4,
                  fontWeight: active === p.id ? 500 : 400,
                }}>
                  {active === p.id ? "▲ Collapse" : "▼ View"}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dashboard Panel */}
      {active && proj && (
        <div ref={dashRef} style={{
          marginTop: 24,
          background: "var(--color-background-primary)",
          border: "0.5px solid var(--color-border-tertiary)",
          borderRadius: 12,
          padding: "24px 24px",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div>
              <div style={{ fontSize: 16, fontWeight: 500 }}>{proj.emoji} {proj.title}</div>
              <div style={{ fontSize: 12, color: "var(--color-text-tertiary)", marginTop: 2 }}>Interactive dashboard · live data simulation</div>
            </div>
            <button
              onClick={() => setActive(null)}
              style={{
                background: "none", border: "0.5px solid var(--color-border-tertiary)",
                borderRadius: 6, padding: "4px 10px", cursor: "pointer",
                fontSize: 12, color: "var(--color-text-secondary)",
              }}
            >Close</button>
          </div>
          <div style={{ borderTop: "0.5px solid var(--color-border-tertiary)", paddingTop: 16 }}>
            {proj.component}
          </div>
        </div>
      )}

      {/* Footer */}
      <div style={{ marginTop: 48, borderTop: "0.5px solid var(--color-border-tertiary)", paddingTop: 20, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
        <div style={{ fontSize: 12, color: "var(--color-text-tertiary)" }}>Built with React · Recharts · SQL-backed datasets</div>
        <div style={{ display: "flex", gap: 14 }}>
          {["GitHub", "LinkedIn", "Resume PDF"].map((l) => (
            <span key={l} style={{ fontSize: 12, color: ACCENT, cursor: "pointer" }}>{l} ↗</span>
          ))}
        </div>
      </div>
    </div>
  );
}
