import { useState, useRef } from "react";
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, Cell, PieChart, Pie,
  ScatterChart, Scatter, ZAxis, RadarChart, Radar,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  Treemap,
} from "recharts";

const ACCENT = "#6C63FF";
const TEAL   = "#0FA490";
const CORAL  = "#E8604C";
const AMBER  = "#D4860B";
const GRAY   = "#8B8FA8";
const PINK   = "#D946A8";
const NAVY   = "#1E40AF";

// ─── SHARED HELPERS ──────────────────────────────────────────────────────────

const fmtK = (v) =>
  v >= 1000000 ? `${(v / 1000000).toFixed(1)}M`
  : v >= 1000  ? `${(v / 1000).toFixed(0)}K`
  : v;
const fmtDollar = (v) => `$${fmtK(v)}`;

const KPI = ({ label, value, sub, color = ACCENT }) => (
  <div style={{ background: "var(--color-background-secondary)", borderRadius: 10, padding: "14px 18px", flex: 1, minWidth: 120 }}>
    <div style={{ fontSize: 11, color: "var(--color-text-secondary)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>{label}</div>
    <div style={{ fontSize: 22, fontWeight: 500, color }}>{value}</div>
    {sub && <div style={{ fontSize: 11, color: "var(--color-text-tertiary)", marginTop: 2 }}>{sub}</div>}
  </div>
);

const SectionTitle = ({ t }) => (
  <h3 style={{ fontSize: 13, fontWeight: 500, color: "var(--color-text-secondary)", textTransform: "uppercase", letterSpacing: "0.07em", margin: "24px 0 12px" }}>{t}</h3>
);

const Insight = ({ color = TEAL, children }) => (
  <div style={{ background: "var(--color-background-secondary)", borderLeft: `3px solid ${color}`, borderRadius: "0 8px 8px 0", padding: "12px 16px", fontSize: 13, color: "var(--color-text-secondary)", lineHeight: 1.7, marginTop: 8 }}>
    {children}
  </div>
);

// ─── DATA ────────────────────────────────────────────────────────────────────

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
  { name: "Clothing",    value: 22, color: TEAL },
  { name: "Home & Garden", value: 18, color: AMBER },
  { name: "Sports",     value: 13, color: CORAL },
  { name: "Other",      value: 9,  color: GRAY },
];

const covidData = [
  { date: "Jan'20", cases: 580,       deaths: 17,      recoveries: 28 },
  { date: "Mar'20", cases: 418000,    deaths: 18600,   recoveries: 107000 },
  { date: "Jun'20", cases: 10200000,  deaths: 504000,  recoveries: 5500000 },
  { date: "Sep'20", cases: 33400000,  deaths: 1000000, recoveries: 23100000 },
  { date: "Jan'21", cases: 97600000,  deaths: 2080000, recoveries: 54000000 },
  { date: "Jun'21", cases: 180000000, deaths: 3900000, recoveries: 164000000 },
  { date: "Jan'22", cases: 305000000, deaths: 5490000, recoveries: 265000000 },
  { date: "Jul'22", cases: 560000000, deaths: 6360000, recoveries: 530000000 },
];

const vaccineData = [
  { country: "USA",       rate: 68, gdp: 63000 },
  { country: "UK",        rate: 75, gdp: 41000 },
  { country: "Germany",   rate: 72, gdp: 46000 },
  { country: "Brazil",    rate: 84, gdp: 7700 },
  { country: "India",     rate: 68, gdp: 2100 },
  { country: "Nigeria",   rate: 4,  gdp: 2100 },
  { country: "Japan",     rate: 83, gdp: 40000 },
  { country: "Canada",    rate: 85, gdp: 43000 },
  { country: "France",    rate: 79, gdp: 38000 },
  { country: "Australia", rate: 86, gdp: 55000 },
];

const funnelData = [
  { name: "Visitors",       value: 100000, fill: ACCENT },
  { name: "Product Views",  value: 58400,  fill: "#8B7CF6" },
  { name: "Add to Cart",    value: 21000,  fill: TEAL },
  { name: "Checkout Start", value: 9800,   fill: AMBER },
  { name: "Purchase",       value: 4200,   fill: CORAL },
];

const cohortData = [
  { month: "Jan", "Week 1": 100, "Week 2": 68, "Week 3": 52, "Week 4": 44 },
  { month: "Feb", "Week 1": 100, "Week 2": 71, "Week 3": 57, "Week 4": 49 },
  { month: "Mar", "Week 1": 100, "Week 2": 74, "Week 3": 60, "Week 4": 53 },
  { month: "Apr", "Week 1": 100, "Week 2": 76, "Week 3": 63, "Week 4": 58 },
];

const abTestData = [
  { metric: "CTR",       control: 3.2, variant: 4.1 },
  { metric: "Conv Rate", control: 1.8, variant: 2.6 },
  { metric: "Avg Order", control: 67,  variant: 72 },
  { metric: "Bounce %",  control: 44,  variant: 36 },
];

// ── Social Media Data ──────────────────────────────────────────────────────

const socialTrendData = [
  { month: "Jan", Instagram: 4200, Twitter: 2100, LinkedIn: 1800, TikTok: 3100 },
  { month: "Feb", Instagram: 4800, Twitter: 2300, LinkedIn: 2100, TikTok: 4200 },
  { month: "Mar", Instagram: 5100, Twitter: 2000, LinkedIn: 2400, TikTok: 6100 },
  { month: "Apr", Instagram: 5600, Twitter: 2200, LinkedIn: 2800, TikTok: 8400 },
  { month: "May", Instagram: 6200, Twitter: 2400, LinkedIn: 3100, TikTok: 11200 },
  { month: "Jun", Instagram: 7100, Twitter: 2100, LinkedIn: 3600, TikTok: 14800 },
];

const platformTreemap = [
  { name: "TikTok",    size: 34, color: "#010101" },
  { name: "Instagram", size: 28, color: "#E1306C" },
  { name: "LinkedIn",  size: 18, color: "#0077B5" },
  { name: "Twitter",   size: 12, color: "#1DA1F2" },
  { name: "Facebook",  size: 8,  color: "#1877F2" },
];

// Heatmap: avg engagement by day × hour  (7 days × 6 time slots)
const days   = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const slots  = ["6am", "9am", "12pm", "3pm", "6pm", "9pm"];
const heatRaw = [
  [12, 34, 45, 38, 52, 41],
  [18, 42, 51, 44, 58, 38],
  [14, 38, 48, 40, 54, 35],
  [20, 46, 55, 50, 62, 42],
  [16, 40, 50, 43, 60, 48],
  [8,  22, 36, 55, 78, 82],
  [6,  18, 32, 58, 84, 88],
];

const followerHistogram = [
  { range: "0–5K",   accounts: 4200 },
  { range: "5–10K",  accounts: 2800 },
  { range: "10–25K", accounts: 1900 },
  { range: "25–50K", accounts: 980 },
  { range: "50–100K",accounts: 420 },
  { range: "100K+",  accounts: 180 },
];

// ── Marketing Campaign Data ────────────────────────────────────────────────

const channelROI = [
  { channel: "Organic SEO", spend: 8000,  revenue: 52000, cac: 12, ltv: 420 },
  { channel: "Paid Search", spend: 22000, revenue: 68000, cac: 28, ltv: 380 },
  { channel: "Email",       spend: 4000,  revenue: 38000, cac: 8,  ltv: 510 },
  { channel: "Social Ads",  spend: 18000, revenue: 44000, cac: 34, ltv: 290 },
  { channel: "Influencer",  spend: 12000, revenue: 29000, cac: 52, ltv: 260 },
  { channel: "Referral",    spend: 2000,  revenue: 24000, cac: 6,  ltv: 580 },
];

const campaignTimeline = [
  { week: "W1", impressions: 120000, clicks: 4800, conversions: 210 },
  { week: "W2", impressions: 145000, clicks: 5900, conversions: 280 },
  { week: "W3", impressions: 132000, clicks: 5200, conversions: 245 },
  { week: "W4", impressions: 168000, clicks: 7100, conversions: 390 },
  { week: "W5", impressions: 155000, clicks: 6400, conversions: 340 },
  { week: "W6", impressions: 192000, clicks: 8200, conversions: 460 },
];

// Correlation matrix (flattened for heatmap rendering)
const corrVars   = ["Spend", "Impressions", "CTR", "Conversions", "Revenue"];
const corrMatrix = [
  [1.00,  0.92,  0.34,  0.78,  0.81],
  [0.92,  1.00,  0.21,  0.70,  0.74],
  [0.34,  0.21,  1.00,  0.55,  0.62],
  [0.78,  0.70,  0.55,  1.00,  0.94],
  [0.81,  0.74,  0.62,  0.94,  1.00],
];

const radarData = [
  { metric: "Reach",      SEO: 80, Paid: 95, Email: 55, Social: 88 },
  { metric: "Conversion", SEO: 72, Paid: 68, Email: 85, Social: 58 },
  { metric: "Retention",  SEO: 78, Paid: 52, Email: 91, Social: 61 },
  { metric: "ROI",        SEO: 88, Paid: 62, Email: 95, Social: 55 },
  { metric: "Awareness",  SEO: 65, Paid: 90, Email: 48, Social: 92 },
];

// ── Geo / Regional Data ───────────────────────────────────────────────────

const regionData = [
  { region: "West",      revenue: 2840000, growth: 22, customers: 18400, aov: 154 },
  { region: "Northeast", revenue: 2210000, growth: 14, customers: 14200, aov: 156 },
  { region: "South",     revenue: 1980000, growth: 18, customers: 13600, aov: 146 },
  { region: "Midwest",   revenue: 1540000, growth: 11, customers: 10800, aov: 143 },
  { region: "Southwest", revenue: 920000,  growth: 31, customers: 6200,  aov: 148 },
];

const stateTreemap = [
  { name: "CA", size: 1840, color: "#4F46E5" },
  { name: "TX", size: 1240, color: "#6C63FF" },
  { name: "NY", size: 1100, color: "#7C3AED" },
  { name: "FL", size: 920,  color: "#8B5CF6" },
  { name: "WA", size: 780,  color: "#A78BFA" },
  { name: "IL", size: 640,  color: "#C4B5FD" },
  { name: "GA", size: 520,  color: "#DDD6FE" },
  { name: "CO", size: 480,  color: "#EDE9FE" },
];

const cityScatter = [
  { city: "San Jose",    customers: 4200, revenue: 680000, aov: 162 },
  { city: "New York",    customers: 3800, revenue: 610000, aov: 161 },
  { city: "Austin",      customers: 2900, revenue: 420000, aov: 145 },
  { city: "Seattle",     customers: 2600, revenue: 400000, aov: 154 },
  { city: "Chicago",     customers: 2400, revenue: 350000, aov: 146 },
  { city: "Miami",       customers: 2100, revenue: 295000, aov: 140 },
  { city: "Denver",      customers: 1800, revenue: 268000, aov: 149 },
  { city: "Atlanta",     customers: 1600, revenue: 230000, aov: 144 },
  { city: "Boston",      customers: 1500, revenue: 240000, aov: 160 },
  { city: "Phoenix",     customers: 1200, revenue: 170000, aov: 142 },
];

const shippingData = [
  { month: "Jan", onTime: 91, delayed: 9 },
  { month: "Feb", onTime: 88, delayed: 12 },
  { month: "Mar", onTime: 93, delayed: 7 },
  { month: "Apr", onTime: 90, delayed: 10 },
  { month: "May", onTime: 95, delayed: 5 },
  { month: "Jun", onTime: 94, delayed: 6 },
];

// ─── HEATMAP CELL HELPER ─────────────────────────────────────────────────────

function HeatmapCell({ value, max, label }) {
  const intensity = value / max;
  const bg = `rgba(108, 99, 255, ${0.08 + intensity * 0.82})`;
  const textColor = intensity > 0.55 ? "#fff" : "var(--color-text-primary)";
  return (
    <div title={`${label}: ${value}% avg engagement`} style={{
      background: bg, borderRadius: 4, display: "flex",
      alignItems: "center", justifyContent: "center",
      fontSize: 10, fontWeight: 500, color: textColor,
      aspectRatio: "1", cursor: "default", transition: "transform .15s",
    }}>
      {value}
    </div>
  );
}

// ─── TREEMAP CUSTOM CONTENT ──────────────────────────────────────────────────

function TreemapContent({ x, y, width, height, name, value, fill }) {
  if (width < 30 || height < 20) return null;
  return (
    <g>
      <rect x={x} y={y} width={width} height={height} fill={fill} rx={4} />
      <text x={x + width / 2} y={y + height / 2 - 6} textAnchor="middle" fill="#fff" fontSize={Math.min(13, width / 6)} fontWeight={500}>{name}</text>
      <text x={x + width / 2} y={y + height / 2 + 10} textAnchor="middle" fill="rgba(255,255,255,0.75)" fontSize={Math.min(11, width / 7)}>{value ?? ""}%</text>
    </g>
  );
}

// ─── DASHBOARD 1: SALES ──────────────────────────────────────────────────────

function SalesDash() {
  const totalRevenue = salesData.reduce((s, d) => s + d.revenue, 0);
  const totalProfit  = salesData.reduce((s, d) => s + d.profit, 0);
  const margin = ((totalProfit / totalRevenue) * 100).toFixed(1);
  return (
    <div>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 4 }}>
        <KPI label="Total Revenue" value={fmtDollar(totalRevenue)} sub="FY 2024" color={ACCENT} />
        <KPI label="Net Profit"    value={fmtDollar(totalProfit)}  sub="after costs" color={TEAL} />
        <KPI label="Profit Margin" value={`${margin}%`}           sub="blended avg"  color={AMBER} />
        <KPI label="Units Sold"    value={fmtK(salesData.reduce((s, d) => s + d.units, 0))} sub="all SKUs" color={CORAL} />
      </div>
      <SectionTitle t="Revenue vs Cost vs Profit — Monthly" />
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={salesData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor={ACCENT} stopOpacity={0.15} />
              <stop offset="95%" stopColor={ACCENT} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-tertiary)" />
          <XAxis dataKey="month" tick={{ fontSize: 11 }} />
          <YAxis tickFormatter={fmtDollar} tick={{ fontSize: 11 }} />
          <Tooltip formatter={(v) => fmtDollar(v)} />
          <Legend />
          <Area type="monotone" dataKey="revenue" stroke={ACCENT} fill="url(#rev)" strokeWidth={2} name="Revenue" />
          <Line type="monotone" dataKey="cost"    stroke={CORAL}  strokeWidth={1.5} dot={false} name="Cost" />
          <Line type="monotone" dataKey="profit"  stroke={TEAL}   strokeWidth={2}   dot={false} name="Profit" />
        </AreaChart>
      </ResponsiveContainer>
      <SectionTitle t="Revenue by Category" />
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
      <SectionTitle t="Monthly Units Sold" />
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
        <KPI label="Peak Cases"     value="560M+" sub="cumulative global"  color={CORAL} />
        <KPI label="Peak Deaths"    value="6.36M" sub="cumulative global"  color="#B91C1C" />
        <KPI label="Recovery Rate"  value="~94.8%" sub="of confirmed"      color={TEAL} />
        <KPI label="Countries"      value="195+"  sub="with reported data" color={GRAY} />
      </div>
      <SectionTitle t="Global Cumulative Cases Over Time" />
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={covidData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-tertiary)" />
          <XAxis dataKey="date" tick={{ fontSize: 11 }} />
          <YAxis tickFormatter={fmtK} tick={{ fontSize: 11 }} />
          <Tooltip formatter={(v) => fmtK(v)} />
          <Legend />
          <Area type="monotone" dataKey="cases"       stroke={ACCENT} fill={ACCENT} fillOpacity={0.12} strokeWidth={2} name="Cases" />
          <Area type="monotone" dataKey="recoveries"  stroke={TEAL}   fill={TEAL}   fillOpacity={0.12} strokeWidth={2} name="Recoveries" />
          <Area type="monotone" dataKey="deaths"      stroke={CORAL}  fill={CORAL}  fillOpacity={0.18} strokeWidth={2} name="Deaths" />
        </AreaChart>
      </ResponsiveContainer>
      <SectionTitle t="Vaccination Rate vs GDP per Capita" />
      <div style={{ fontSize: 12, color: "var(--color-text-tertiary)", marginBottom: 8 }}>Bubble size = vaccination rate. Higher GDP ≠ always higher coverage.</div>
      <ResponsiveContainer width="100%" height={220}>
        <ScatterChart margin={{ top: 4, right: 8, left: 0, bottom: 16 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-tertiary)" />
          <XAxis dataKey="gdp"  name="GDP/capita" tickFormatter={(v) => `$${fmtK(v)}`} tick={{ fontSize: 11 }} label={{ value: "GDP/capita (USD)", position: "insideBottom", offset: -8, fontSize: 11 }} />
          <YAxis dataKey="rate" name="Vacc. Rate"  tickFormatter={(v) => `${v}%`}       tick={{ fontSize: 11 }} />
          <ZAxis dataKey="rate" range={[60, 400]} />
          <Tooltip cursor={{ strokeDasharray: "3 3" }} content={({ payload }) => {
            if (!payload?.length) return null;
            const d = payload[0]?.payload;
            return (
              <div style={{ background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: 8, padding: "8px 12px", fontSize: 12 }}>
                <strong>{d.country}</strong><br />GDP: ${d.gdp.toLocaleString()}<br />Vacc: {d.rate}%
              </div>
            );
          }} />
          <Scatter data={vaccineData} fill={ACCENT} fillOpacity={0.7} />
        </ScatterChart>
      </ResponsiveContainer>
      <Insight color={TEAL}>
        Countries with higher GDP tend to have higher vaccination rates, but the relationship is not perfectly linear — Brazil (84%) outpaced the USA (68%) despite lower GDP, highlighting that logistics and political will matter as much as wealth.
      </Insight>
    </div>
  );
}

// ─── DASHBOARD 3: E-COMMERCE ─────────────────────────────────────────────────

function EcommerceDash() {
  const convRate       = ((funnelData[4].value / funnelData[0].value) * 100).toFixed(2);
  const cartAbandonment = (((funnelData[2].value - funnelData[4].value) / funnelData[2].value) * 100).toFixed(1);
  return (
    <div>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 4 }}>
        <KPI label="Total Visitors"   value="100K"          sub="monthly avg"         color={ACCENT} />
        <KPI label="Conversion Rate"  value={`${convRate}%`} sub="visitor → purchase" color={TEAL} />
        <KPI label="Cart Abandonment" value={`${cartAbandonment}%`} sub="of add-to-cart" color={CORAL} />
        <KPI label="Avg Order Value"  value="$74.20"        sub="per order"           color={AMBER} />
      </div>
      <SectionTitle t="Conversion Funnel" />
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={funnelData} layout="vertical" margin={{ top: 4, right: 60, left: 90, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-tertiary)" horizontal={false} />
          <XAxis type="number" tickFormatter={fmtK} tick={{ fontSize: 11 }} />
          <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} />
          <Tooltip formatter={(v) => [fmtK(v), "Users"]} />
          <Bar dataKey="value" radius={[0, 6, 6, 0]}>
            {funnelData.map((e, i) => <Cell key={i} fill={e.fill} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <SectionTitle t="Cohort Retention Analysis (% still active)" />
      <ResponsiveContainer width="100%" height={180}>
        <LineChart data={cohortData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-tertiary)" />
          <XAxis dataKey="month" tick={{ fontSize: 11 }} />
          <YAxis tickFormatter={(v) => `${v}%`} domain={[0, 100]} tick={{ fontSize: 11 }} />
          <Tooltip formatter={(v) => `${v}%`} />
          <Legend />
          <Line dataKey="Week 1" stroke={ACCENT} strokeWidth={2} dot={{ r: 4 }} />
          <Line dataKey="Week 2" stroke={TEAL}   strokeWidth={2} dot={{ r: 4 }} />
          <Line dataKey="Week 3" stroke={AMBER}  strokeWidth={2} dot={{ r: 4 }} />
          <Line dataKey="Week 4" stroke={CORAL}  strokeWidth={2} dot={{ r: 4 }} />
        </LineChart>
      </ResponsiveContainer>
      <SectionTitle t="A/B Test Results — Checkout Page Redesign" />
      <div style={{ fontSize: 12, color: "var(--color-text-tertiary)", marginBottom: 8 }}>Variant B showed lift across all key metrics. p &lt; 0.05.</div>
      <ResponsiveContainer width="100%" height={160}>
        <BarChart data={abTestData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-tertiary)" />
          <XAxis dataKey="metric" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} />
          <Tooltip /><Legend />
          <Bar dataKey="control" fill={GRAY} radius={[4, 4, 0, 0]} name="Control (A)" />
          <Bar dataKey="variant" fill={TEAL} radius={[4, 4, 0, 0]} name="Variant (B)" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// ─── DASHBOARD 4: SOCIAL MEDIA ───────────────────────────────────────────────

function SocialDash() {
  const maxHeat = Math.max(...heatRaw.flat());
  return (
    <div>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 4 }}>
        <KPI label="Total Followers" value="284K"  sub="across platforms"    color={PINK} />
        <KPI label="Avg Eng. Rate"   value="4.8%"  sub="industry avg 1.9%"   color={ACCENT} />
        <KPI label="Best Platform"   value="TikTok" sub="34% share"          color="#010101" />
        <KPI label="MoM Growth"      value="+18.4%" sub="follower growth"    color={TEAL} />
      </div>

      {/* Follower growth by platform — Line */}
      <SectionTitle t="Follower Growth by Platform (Jan–Jun)" />
      <ResponsiveContainer width="100%" height={210}>
        <LineChart data={socialTrendData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-tertiary)" />
          <XAxis dataKey="month" tick={{ fontSize: 11 }} />
          <YAxis tickFormatter={fmtK} tick={{ fontSize: 11 }} />
          <Tooltip formatter={(v) => fmtK(v)} />
          <Legend />
          <Line dataKey="TikTok"    stroke="#010101" strokeWidth={2.5} dot={{ r: 3 }} />
          <Line dataKey="Instagram" stroke="#E1306C" strokeWidth={2}   dot={{ r: 3 }} />
          <Line dataKey="LinkedIn"  stroke="#0077B5" strokeWidth={2}   dot={{ r: 3 }} />
          <Line dataKey="Twitter"   stroke="#1DA1F2" strokeWidth={2}   dot={{ r: 3 }} />
        </LineChart>
      </ResponsiveContainer>

      {/* Treemap — platform share */}
      <SectionTitle t="Platform Share by Audience Size (Treemap)" />
      <div style={{ fontSize: 12, color: "var(--color-text-tertiary)", marginBottom: 8 }}>Area = proportion of total following. TikTok now dominates at 34%.</div>
      <ResponsiveContainer width="100%" height={200}>
        <Treemap
          data={platformTreemap}
          dataKey="size"
          nameKey="name"
          content={<TreemapContent />}
          isAnimationActive={false}
        >
          {platformTreemap.map((e, i) => <Cell key={i} fill={e.color} />)}
        </Treemap>
      </ResponsiveContainer>

      {/* Heatmap — best posting times */}
      <SectionTitle t="Engagement Heatmap — Best Time to Post" />
      <div style={{ fontSize: 12, color: "var(--color-text-tertiary)", marginBottom: 10 }}>Darker = higher average engagement rate. Weekends 6–9pm consistently outperform.</div>
      <div style={{ overflowX: "auto" }}>
        <div style={{ minWidth: 360 }}>
          {/* Column headers */}
          <div style={{ display: "grid", gridTemplateColumns: "44px repeat(6, 1fr)", gap: 4, marginBottom: 4 }}>
            <div />
            {slots.map((s) => <div key={s} style={{ fontSize: 10, color: "var(--color-text-tertiary)", textAlign: "center" }}>{s}</div>)}
          </div>
          {/* Rows */}
          {days.map((day, di) => (
            <div key={day} style={{ display: "grid", gridTemplateColumns: "44px repeat(6, 1fr)", gap: 4, marginBottom: 4 }}>
              <div style={{ fontSize: 11, color: "var(--color-text-secondary)", display: "flex", alignItems: "center", paddingRight: 4 }}>{day}</div>
              {heatRaw[di].map((val, si) => (
                <HeatmapCell key={si} value={val} max={maxHeat} label={`${day} ${slots[si]}`} />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Histogram — follower distribution */}
      <SectionTitle t="Follower Count Distribution (Histogram)" />
      <div style={{ fontSize: 12, color: "var(--color-text-tertiary)", marginBottom: 8 }}>Most accounts in our niche have under 10K followers — long tail toward micro-influencers.</div>
      <ResponsiveContainer width="100%" height={160}>
        <BarChart data={followerHistogram} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-tertiary)" />
          <XAxis dataKey="range" tick={{ fontSize: 11 }} />
          <YAxis tickFormatter={fmtK} tick={{ fontSize: 11 }} />
          <Tooltip formatter={(v) => [fmtK(v), "Accounts"]} />
          <Bar dataKey="accounts" fill={PINK} radius={[4, 4, 0, 0]} name="Accounts" />
        </BarChart>
      </ResponsiveContainer>
      <Insight color={PINK}>
        TikTok follower growth outpaced all other platforms by 3.8× from Jan to Jun, confirming the platform's superior organic reach for short-form content. Optimal posting window across all platforms is Saturday–Sunday between 6–9pm.
      </Insight>
    </div>
  );
}

// ─── DASHBOARD 5: MARKETING CAMPAIGNS ───────────────────────────────────────

function MarketingDash() {
  const bestChannel = channelROI.reduce((a, b) => (b.revenue / b.spend > a.revenue / a.spend ? b : a));
  const totalSpend  = channelROI.reduce((s, d) => s + d.spend, 0);
  const totalRev    = channelROI.reduce((s, d) => s + d.revenue, 0);

  return (
    <div>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 4 }}>
        <KPI label="Total Ad Spend" value={fmtDollar(totalSpend)} sub="6 channels"        color={ACCENT} />
        <KPI label="Total Revenue"  value={fmtDollar(totalRev)}   sub="campaign-attributed" color={TEAL} />
        <KPI label="Blended ROAS"   value={`${(totalRev / totalSpend).toFixed(1)}×`} sub="return on ad spend" color={AMBER} />
        <KPI label="Best Channel"   value={bestChannel.channel}   sub={`ROAS ${(bestChannel.revenue / bestChannel.spend).toFixed(1)}×`} color={CORAL} />
      </div>

      {/* Channel ROI */}
      <SectionTitle t="Revenue vs Spend by Channel" />
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={channelROI} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-tertiary)" />
          <XAxis dataKey="channel" tick={{ fontSize: 10 }} />
          <YAxis tickFormatter={fmtDollar} tick={{ fontSize: 11 }} />
          <Tooltip formatter={(v) => fmtDollar(v)} />
          <Legend />
          <Bar dataKey="spend"   fill={GRAY}   radius={[4, 4, 0, 0]} name="Spend" />
          <Bar dataKey="revenue" fill={ACCENT} radius={[4, 4, 0, 0]} name="Revenue" />
        </BarChart>
      </ResponsiveContainer>

      {/* CAC vs LTV scatter */}
      <SectionTitle t="CAC vs LTV by Channel" />
      <div style={{ fontSize: 12, color: "var(--color-text-tertiary)", marginBottom: 8 }}>Bottom-left = efficient (low CAC). Top-right = high lifetime value. Ideal: bottom-right.</div>
      <ResponsiveContainer width="100%" height={200}>
        <ScatterChart margin={{ top: 4, right: 8, left: 0, bottom: 16 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-tertiary)" />
          <XAxis dataKey="cac" name="CAC ($)" tick={{ fontSize: 11 }} label={{ value: "Customer Acquisition Cost ($)", position: "insideBottom", offset: -8, fontSize: 11 }} />
          <YAxis dataKey="ltv" name="LTV ($)" tick={{ fontSize: 11 }} />
          <ZAxis range={[80, 80]} />
          <Tooltip cursor={{ strokeDasharray: "3 3" }} content={({ payload }) => {
            if (!payload?.length) return null;
            const d = payload[0]?.payload;
            return (
              <div style={{ background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: 8, padding: "8px 12px", fontSize: 12 }}>
                <strong>{d.channel}</strong><br />CAC: ${d.cac} &nbsp; LTV: ${d.ltv}<br />
                LTV:CAC = {(d.ltv / d.cac).toFixed(1)}×
              </div>
            );
          }} />
          <Scatter data={channelROI} fill={TEAL} fillOpacity={0.8} />
        </ScatterChart>
      </ResponsiveContainer>

      {/* Radar — channel strengths */}
      <SectionTitle t="Channel Performance Radar" />
      <div style={{ fontSize: 12, color: "var(--color-text-tertiary)", marginBottom: 8 }}>Multi-dimensional channel comparison across 5 KPIs (0–100 score).</div>
      <ResponsiveContainer width="100%" height={220}>
        <RadarChart data={radarData} margin={{ top: 4, right: 24, left: 24, bottom: 4 }}>
          <PolarGrid stroke="var(--color-border-tertiary)" />
          <PolarAngleAxis dataKey="metric" tick={{ fontSize: 11 }} />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10 }} />
          <Radar name="SEO"    dataKey="SEO"    stroke="#6C63FF" fill="#6C63FF" fillOpacity={0.12} strokeWidth={2} />
          <Radar name="Email"  dataKey="Email"  stroke={TEAL}    fill={TEAL}    fillOpacity={0.12} strokeWidth={2} />
          <Radar name="Paid"   dataKey="Paid"   stroke={CORAL}   fill={CORAL}   fillOpacity={0.12} strokeWidth={2} />
          <Radar name="Social" dataKey="Social" stroke={AMBER}   fill={AMBER}   fillOpacity={0.12} strokeWidth={2} />
          <Legend />
          <Tooltip />
        </RadarChart>
      </ResponsiveContainer>

      {/* Correlation Heatmap */}
      <SectionTitle t="Correlation Matrix — Campaign Variables" />
      <div style={{ fontSize: 12, color: "var(--color-text-tertiary)", marginBottom: 10 }}>Values close to 1.0 indicate strong positive correlation. Spend → Revenue correlation: 0.81.</div>
      <div style={{ overflowX: "auto" }}>
        <div style={{ minWidth: 320, display: "inline-block", width: "100%" }}>
          <div style={{ display: "grid", gridTemplateColumns: `80px repeat(${corrVars.length}, 1fr)`, gap: 3, marginBottom: 3 }}>
            <div />
            {corrVars.map((v) => <div key={v} style={{ fontSize: 10, color: "var(--color-text-tertiary)", textAlign: "center", fontWeight: 500 }}>{v}</div>)}
          </div>
          {corrVars.map((rowVar, ri) => (
            <div key={rowVar} style={{ display: "grid", gridTemplateColumns: `80px repeat(${corrVars.length}, 1fr)`, gap: 3, marginBottom: 3 }}>
              <div style={{ fontSize: 10, color: "var(--color-text-secondary)", display: "flex", alignItems: "center", fontWeight: 500 }}>{rowVar}</div>
              {corrMatrix[ri].map((val, ci) => {
                const intensity = val;
                const bg = ri === ci ? `rgba(108,99,255,0.85)` : `rgba(108,99,255,${0.05 + intensity * 0.65})`;
                const textColor = (ri === ci || intensity > 0.6) ? "#fff" : "var(--color-text-primary)";
                return (
                  <div key={ci} title={`${rowVar} × ${corrVars[ci]}: ${val}`} style={{
                    background: bg, borderRadius: 4, padding: "8px 2px",
                    textAlign: "center", fontSize: 11, fontWeight: 500,
                    color: textColor, cursor: "default",
                  }}>{val.toFixed(2)}</div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
      <Insight color={AMBER}>
        Email and Referral have the highest LTV:CAC ratios (64× and 97×), making them the most efficient channels despite lower reach. Paid Search drives the most revenue but at a much higher acquisition cost.
      </Insight>
    </div>
  );
}

// ─── DASHBOARD 6: GEO / REGIONAL ─────────────────────────────────────────────

function GeoDash() {
  const totalCustomers = regionData.reduce((s, d) => s + d.customers, 0);
  const totalRevenue   = regionData.reduce((s, d) => s + d.revenue, 0);

  return (
    <div>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 4 }}>
        <KPI label="Total Revenue"   value={fmtDollar(totalRevenue)}  sub="all US regions"   color={ACCENT} />
        <KPI label="Total Customers" value={fmtK(totalCustomers)}     sub="active accounts"  color={TEAL} />
        <KPI label="Fastest Growing" value="Southwest" sub="+31% YoY"                         color={CORAL} />
        <KPI label="Top Region"      value="West"      sub="$2.84M revenue"                   color={AMBER} />
      </div>

      {/* Region revenue bar */}
      <SectionTitle t="Revenue by US Region" />
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={regionData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-tertiary)" />
          <XAxis dataKey="region" tick={{ fontSize: 11 }} />
          <YAxis tickFormatter={fmtDollar} tick={{ fontSize: 11 }} />
          <Tooltip formatter={(v, n) => n === "revenue" ? fmtDollar(v) : v} />
          <Legend />
          <Bar dataKey="revenue"   fill={ACCENT} radius={[4, 4, 0, 0]} name="Revenue" />
          <Bar dataKey="customers" fill={TEAL}   radius={[4, 4, 0, 0]} name="Customers" />
        </BarChart>
      </ResponsiveContainer>

      {/* State-level treemap */}
      <SectionTitle t="Revenue by State (Treemap)" />
      <div style={{ fontSize: 12, color: "var(--color-text-tertiary)", marginBottom: 8 }}>Area proportional to revenue contribution. CA, TX, NY account for 54% of total.</div>
      <ResponsiveContainer width="100%" height={200}>
        <Treemap data={stateTreemap} dataKey="size" nameKey="name" content={<TreemapContent />} isAnimationActive={false}>
          {stateTreemap.map((e, i) => <Cell key={i} fill={e.color} />)}
        </Treemap>
      </ResponsiveContainer>

      {/* City scatter — customers vs revenue */}
      <SectionTitle t="Top Cities — Customers vs Revenue" />
      <div style={{ fontSize: 12, color: "var(--color-text-tertiary)", marginBottom: 8 }}>Each dot = a city. Position shows customer count (x) vs revenue (y). Color intensity = avg order value.</div>
      <ResponsiveContainer width="100%" height={220}>
        <ScatterChart margin={{ top: 4, right: 8, left: 0, bottom: 16 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-tertiary)" />
          <XAxis dataKey="customers" name="Customers" tickFormatter={fmtK} tick={{ fontSize: 11 }} label={{ value: "Customer count", position: "insideBottom", offset: -8, fontSize: 11 }} />
          <YAxis dataKey="revenue"   name="Revenue"   tickFormatter={fmtDollar} tick={{ fontSize: 11 }} />
          <ZAxis dataKey="aov" range={[60, 300]} name="Avg Order Value" />
          <Tooltip cursor={{ strokeDasharray: "3 3" }} content={({ payload }) => {
            if (!payload?.length) return null;
            const d = payload[0]?.payload;
            return (
              <div style={{ background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: 8, padding: "8px 12px", fontSize: 12 }}>
                <strong>{d.city}</strong><br />
                Customers: {d.customers.toLocaleString()}<br />
                Revenue: {fmtDollar(d.revenue)}<br />
                AOV: ${d.aov}
              </div>
            );
          }} />
          <Scatter data={cityScatter} fill={NAVY} fillOpacity={0.75} />
        </ScatterChart>
      </ResponsiveContainer>

      {/* Shipping on-time stacked bar */}
      <SectionTitle t="On-Time vs Delayed Shipments by Region" />
      <ResponsiveContainer width="100%" height={160}>
        <BarChart data={shippingData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-tertiary)" />
          <XAxis dataKey="month" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${v}%`} domain={[0, 100]} />
          <Tooltip formatter={(v) => `${v}%`} />
          <Legend />
          <Bar dataKey="onTime"  fill={TEAL}  stackId="a" name="On-time %" />
          <Bar dataKey="delayed" fill={CORAL} stackId="a" name="Delayed %" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
      <Insight color={NAVY}>
        The West region drives the most revenue ($2.84M) but the Southwest is the fastest-growing at +31% YoY with a smaller customer base — indicating strong penetration opportunity. San Jose and NYC alone account for 21% of total revenue.
      </Insight>
    </div>
  );
}

// ─── MAIN APP ────────────────────────────────────────────────────────────────

const projects = [
  { id: "sales",     emoji: "📈", title: "Sales Performance Analytics",
    desc: "Full-year revenue, profit margin, and category breakdown using real retail patterns.",
    tags: ["Python", "SQL", "Area Chart", "EDA"], component: <SalesDash /> },
  { id: "covid",     emoji: "🌍", title: "COVID-19 Global Trend Analysis",
    desc: "Epidemiological trends, vaccination equity, and GDP correlation across 10 countries.",
    tags: ["Pandas", "Public Health", "Scatter", "Time Series"], component: <CovidDash /> },
  { id: "ecomm",     emoji: "🛒", title: "E-commerce Funnel & Retention",
    desc: "Conversion funnel, cohort retention curves, and A/B test lift analysis.",
    tags: ["SQL", "Cohort Analysis", "A/B Testing", "Funnel"], component: <EcommerceDash /> },
  { id: "social",    emoji: "📱", title: "Social Media Analytics",
    desc: "Engagement heatmap, platform treemap, follower histogram, and growth trends.",
    tags: ["Heatmap", "Treemap", "Histogram", "TikTok / Instagram"], component: <SocialDash /> },
  { id: "marketing", emoji: "📣", title: "Marketing Campaign Analytics",
    desc: "Channel ROI, CAC vs LTV scatter, correlation matrix, and radar performance chart.",
    tags: ["Correlation", "Radar", "CAC/LTV", "Multi-channel"], component: <MarketingDash /> },
  { id: "geo",       emoji: "🗺️", title: "Geo & Regional Analysis",
    desc: "US regional revenue, state-level treemap, city scatter, and shipping performance.",
    tags: ["Geospatial", "Treemap", "Regional", "Logistics"], component: <GeoDash /> },
];

export default function Portfolio() {
  const [active, setActive] = useState(null);
  const dashRef = useRef(null);

  const openProject = (id) => {
    setActive((prev) => {
      const next = prev === id ? null : id;
      if (next) setTimeout(() => dashRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 60);
      return next;
    });
  };

  const proj = projects.find((p) => p.id === active);

  return (
    <div style={{ fontFamily: "var(--font-sans)", color: "var(--color-text-primary)", maxWidth: 760, margin: "0 auto", padding: "0 0 60px" }}>

      {/* Header */}
      <div style={{ padding: "36px 0 24px", borderBottom: "0.5px solid var(--color-border-tertiary)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 12 }}>
          <div style={{ width: 52, height: 52, borderRadius: "50%", background: ACCENT, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 500, fontSize: 18, flexShrink: 0 }}>VS</div>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 500, margin: 0 }}>Vedika Sumbli</h1>
            <p style={{ margin: 0, fontSize: 13, color: "var(--color-text-secondary)" }}>Data Analyst · San Jose, CA · vedika.sumbli@gmail.com</p>
          </div>
        </div>
        <p style={{ fontSize: 14, color: "var(--color-text-secondary)", lineHeight: 1.7, margin: 0, maxWidth: 580 }}>
          Recent graduate with hands-on experience in SQL, Python, and data visualization. I turn messy datasets into clear, decision-ready insights. Six end-to-end analysis projects below.
        </p>
        <div style={{ display: "flex", gap: 8, marginTop: 14, flexWrap: "wrap" }}>
          {["SQL", "Python", "Tableau", "Power BI", "Excel", "Statistics", "A/B Testing", "Cohort Analysis", "Heatmaps"].map((s) => (
            <span key={s} style={{ fontSize: 11, padding: "3px 10px", background: "var(--color-background-secondary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: 20, color: "var(--color-text-secondary)" }}>{s}</span>
          ))}
        </div>
      </div>

      {/* Project Cards */}
      <div style={{ marginTop: 28 }}>
        <h2 style={{ fontSize: 13, fontWeight: 500, color: "var(--color-text-secondary)", textTransform: "uppercase", letterSpacing: "0.07em", margin: "0 0 16px" }}>Projects — click to explore</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {projects.map((p) => (
            <div key={p.id} onClick={() => openProject(p.id)} style={{
              background: "var(--color-background-primary)",
              border: `0.5px solid ${active === p.id ? ACCENT : "var(--color-border-tertiary)"}`,
              borderLeft: `3px solid ${active === p.id ? ACCENT : "transparent"}`,
              borderRadius: 10, padding: "16px 20px", cursor: "pointer", transition: "border-color 0.15s",
            }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
                <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <span style={{ fontSize: 22 }}>{p.emoji}</span>
                  <div>
                    <div style={{ fontWeight: 500, fontSize: 15 }}>{p.title}</div>
                    <div style={{ fontSize: 13, color: "var(--color-text-secondary)", marginTop: 3, lineHeight: 1.6 }}>{p.desc}</div>
                    <div style={{ display: "flex", gap: 6, marginTop: 8, flexWrap: "wrap" }}>
                      {p.tags.map((t) => (
                        <span key={t} style={{ fontSize: 10, padding: "2px 8px", background: `${ACCENT}18`, color: ACCENT, borderRadius: 20, fontWeight: 500 }}>{t}</span>
                      ))}
                    </div>
                  </div>
                </div>
                <div style={{ fontSize: 12, color: active === p.id ? ACCENT : "var(--color-text-tertiary)", whiteSpace: "nowrap", paddingTop: 4, fontWeight: active === p.id ? 500 : 400 }}>
                  {active === p.id ? "▲ Collapse" : "▼ View"}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dashboard Panel */}
      {active && proj && (
        <div ref={dashRef} style={{ marginTop: 20, background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: 12, padding: "24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div>
              <div style={{ fontSize: 16, fontWeight: 500 }}>{proj.emoji} {proj.title}</div>
              <div style={{ fontSize: 12, color: "var(--color-text-tertiary)", marginTop: 2 }}>Interactive dashboard · live data simulation</div>
            </div>
            <button onClick={() => setActive(null)} style={{ background: "none", border: "0.5px solid var(--color-border-tertiary)", borderRadius: 6, padding: "4px 10px", cursor: "pointer", fontSize: 12, color: "var(--color-text-secondary)" }}>Close ✕</button>
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
          {["GitHub ↗", "LinkedIn ↗", "Resume PDF ↗"].map((l) => (
            <span key={l} style={{ fontSize: 12, color: ACCENT, cursor: "pointer" }}>{l}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
