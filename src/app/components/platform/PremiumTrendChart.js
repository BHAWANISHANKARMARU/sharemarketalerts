"use client";

import { Area, AreaChart, CartesianGrid, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useId } from "react";
import s from "./PremiumTrendChart.module.css";

const tones = {
  purple: "#7c3aed",
  green: "#16a375",
  red: "#e0484f",
};

function ChartTooltip({ active, payload, label, prefix = "" }) {
  if (!active || !payload?.length) return null;
  const point = payload[0].payload;
  return (
    <div className={s.chartTooltip}>
      <strong>{prefix}{Number(point.value).toLocaleString("en-IN", { maximumFractionDigits: 2 })}</strong>
      <span>{point.time || label}</span>
    </div>
  );
}

function RuleLevelLabel({ viewBox, value, prefix }) {
  if (!viewBox || !Number.isFinite(value)) return null;
  return (
    <g className={s.ruleLevelLabel} transform={`translate(${viewBox.x}, ${viewBox.y - 9})`}>
      <rect width="46" height="18" rx="4" />
      <text x="23" y="12" textAnchor="middle">{prefix}{Math.round(value)}</text>
    </g>
  );
}

export default function PremiumTrendChart({ data, label, tone = "purple", prefix = "", referenceValue = null }) {
  const id = `premium-${useId().replaceAll(":", "")}`;
  const color = tones[tone] || tones.purple;
  const values = data.map((point) => Number(point.value)).filter(Number.isFinite);
  const numericReference = Number(referenceValue);
  const hasReference = Number.isFinite(numericReference);
  const domainValues = hasReference ? [...values, numericReference] : values;
  const min = domainValues.length ? Math.min(...domainValues) : 0;
  const max = domainValues.length ? Math.max(...domainValues) : 100;
  const pad = Math.max((max - min) * 0.28, max * 0.0015, 1);
  const chartData = data.map((point, index) => ({
    ...point,
    index,
    time: point.timestamp
      ? new Intl.DateTimeFormat("en-IN", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Kolkata" }).format(new Date(point.timestamp))
      : point.time,
  }));

  return (
    <div className={s.premiumChart} role="img" aria-label={label} data-chart-engine="recharts">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 28, right: 10, bottom: 10, left: 4 }}>
          <defs>
            <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.18} />
              <stop offset="58%" stopColor={color} stopOpacity={0.055} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} horizontalPoints={[76, 148, 220]} stroke="#f3f4f6" strokeOpacity={0.05} />
          <XAxis dataKey="index" hide axisLine={false} tickLine={false} />
          <YAxis domain={[min - pad, max + pad]} hide axisLine={false} tickLine={false} />
          <Tooltip content={<ChartTooltip label={label} prefix={prefix} />} cursor={false} animationDuration={180} />
          {hasReference && (
            <ReferenceLine
              y={numericReference}
              stroke={color}
              strokeWidth={1.25}
              strokeDasharray="4 4"
              ifOverflow="extendDomain"
              label={<RuleLevelLabel value={numericReference} prefix={prefix} />}
            />
          )}
          <Area
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2.75}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill={`url(#${id})`}
            dot={false}
            activeDot={{ r: 3, fill: color, stroke: "#fff", strokeWidth: 1.5 }}
            isAnimationActive
            animationDuration={700}
            animationEasing="ease-out"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
