import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Card from '../../components/Card';
import { Skeleton } from '../../components/Loader';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, LineChart, Line,
} from 'recharts';

const mockAnalytics = {
  deptPlacement: [
    { dept: 'CSE', placed: 82, total: 100 },
    { dept: 'IT', placed: 74, total: 90 },
    { dept: 'ECE', placed: 65, total: 85 },
    { dept: 'ME', placed: 48, total: 70 },
  ],
  companyWise: [
    { company: 'TCS', count: 45 }, { company: 'Infosys', count: 38 }, { company: 'Wipro', count: 30 },
    { company: 'Google', count: 12 }, { company: 'Microsoft', count: 8 }, { company: 'Amazon', count: 15 },
  ],
  salaryBand: [
    { band: '<5 LPA', count: 20 }, { band: '5-10 LPA', count: 65 }, { band: '10-15 LPA', count: 45 },
    { band: '15-20 LPA', count: 25 }, { band: '>20 LPA', count: 15 },
  ],
  monthlyTrend: [
    { month: 'Jul', placed: 10 }, { month: 'Aug', placed: 18 }, { month: 'Sep', placed: 24 },
    { month: 'Oct', placed: 35 }, { month: 'Nov', placed: 42 }, { month: 'Dec', placed: 38 },
  ],
  skillDemand: [
    { skill: 'Python', demand: 89 }, { skill: 'React', demand: 75 }, { skill: 'Java', demand: 68 },
    { skill: 'AWS', demand: 62 }, { skill: 'SQL', demand: 58 }, { skill: 'ML', demand: 55 },
  ],
};

const COLORS = ['#4F46E5', '#059669', '#0284C7', '#D97706', '#7C3AED', '#DC2626'];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: 'var(--surface-elevated)', border: '1px solid rgba(15,23,42,0.08)', borderRadius: 8, padding: '10px 14px', fontSize: 13, boxShadow: 'var(--shadow-2)' }}>
      <p style={{ fontWeight: 600, marginBottom: 4 }}>{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color || 'var(--text-secondary)' }}>{p.name}: {p.value}</p>
      ))}
    </div>
  );
};

export default function Analytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => { setData(mockAnalytics); setLoading(false); }, 800);
  }, []);

  return (
    <div style={{ flex: 1, overflow: 'auto' }}>
      <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }`}</style>
      <Navbar title="Placement Analytics" actions={
        <button style={{ padding: '7px 14px', background: 'var(--surface-secondary)', border: '1px solid rgba(15,23,42,0.1)', borderRadius: 'var(--radius-default)', fontSize: 13, cursor: 'pointer', color: 'var(--text-secondary)' }}>
          Export Report ↓
        </button>
      } />

      <div style={{ padding: '24px 32px', maxWidth: 1300, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 20 }}>
        {/* Top Charts */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, animation: 'fadeIn 0.4s ease-out' }}>
          <Card title="Placement by Department" subtitle="Placed vs total students" elevation={2}>
            {loading ? <Skeleton height={240} /> : (
              <div style={{ height: 240 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.deptPlacement} barGap={6}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(15,23,42,0.05)" vertical={false} />
                    <XAxis dataKey="dept" tick={{ fontSize: 12, fill: 'var(--text-secondary)' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: 'var(--text-tertiary)' }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="total" fill="#E2E8F0" radius={[4, 4, 0, 0]} name="Total" />
                    <Bar dataKey="placed" fill="#4F46E5" radius={[4, 4, 0, 0]} name="Placed" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </Card>

          <Card title="Monthly Placement Trend" subtitle="Students placed per month" elevation={2}>
            {loading ? <Skeleton height={240} /> : (
              <div style={{ height: 240 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data.monthlyTrend} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(15,23,42,0.05)" vertical={false} />
                    <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'var(--text-secondary)' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: 'var(--text-tertiary)' }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Line type="monotone" dataKey="placed" stroke="#059669" strokeWidth={2.5} dot={{ r: 5, fill: '#059669', stroke: '#fff', strokeWidth: 2 }} name="Placed" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </Card>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20, animation: 'fadeIn 0.5s ease-out 0.1s both' }}>
          <Card title="Salary Distribution" subtitle="CTC band breakdown" elevation={2}>
            {loading ? <Skeleton height={220} /> : (
              <div style={{ height: 220 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.salaryBand} layout="vertical" margin={{ top: 0, right: 8, left: 0, bottom: 0 }}>
                    <XAxis type="number" tick={{ fontSize: 11, fill: 'var(--text-tertiary)' }} axisLine={false} tickLine={false} />
                    <YAxis dataKey="band" type="category" tick={{ fontSize: 11, fill: 'var(--text-secondary)' }} axisLine={false} tickLine={false} width={68} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="count" radius={[0, 4, 4, 0]} name="Students">
                      {data.salaryBand.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </Card>

          <Card title="Top Recruiters" subtitle="Companies by hiring count" elevation={2}>
            {loading ? <Skeleton height={220} /> : (
              <div style={{ height: 220 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={data.companyWise} cx="50%" cy="50%" innerRadius={55} outerRadius={85} dataKey="count" nameKey="company" paddingAngle={3}>
                      {data.companyWise.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend iconSize={10} iconType="circle" wrapperStyle={{ fontSize: 11 }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </Card>

          <Card title="Skill Demand Index" subtitle="Most sought-after skills in JDs" elevation={2}>
            {loading ? <Skeleton height={220} /> : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {data.skillDemand.map((s, i) => (
                  <div key={s.skill}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontSize: 12, fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--text-primary)' }}>{s.skill}</span>
                      <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: COLORS[i % COLORS.length], fontWeight: 700 }}>{s.demand}%</span>
                    </div>
                    <div style={{ height: 6, background: 'var(--surface-sunken)', borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${s.demand}%`, background: COLORS[i % COLORS.length], borderRadius: 3, transition: 'width 0.8s ease-out' }} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
