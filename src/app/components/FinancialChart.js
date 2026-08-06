"use client";

import { useId, useSyncExternalStore } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import styles from "./FinancialChart.module.css";

const tones = {
  positive: { line: "#16a375" },
  negative: { line: "#e0484f" },
  brand: { line: "#7c3aed" },
};

const subscribeToHydration = () => () => {};

const gridCoordinates = ({ height, offset }) => {
  const top = offset?.top ?? 0;
  const drawableHeight = Math.max(height - top - (offset?.bottom ?? 0), 0);

  return [0.2, 0.47, 0.74, 1].map(
    (position) => top + drawableHeight * position,
  );
};

function toChartData(points, valueRange) {
  const coordinates = points.trim().split(/\s+/).map((point) => {
    const [x, y] = point.split(",").map(Number);
    return { x, y };
  });
  const minimumY = Math.min(...coordinates.map(({ y }) => y));
  const maximumY = Math.max(...coordinates.map(({ y }) => y));
  const [minimumValue, maximumValue] = valueRange ?? [32, 72];
  const span = Math.max(maximumY - minimumY, 1);

  return coordinates.map(({ x, y }, index) => ({
    x,
    index,
    value:
      minimumValue +
      ((maximumY - y) / span) * (maximumValue - minimumValue),
  }));
}

function ReferenceTooltip({ active, payload, valuePrefix, valueSuffix }) {
  if (!active || !payload?.length) return null;
  const value = Number(payload[0].value);

  return (
    <div className={styles.tooltip}>
      <strong>
        {valuePrefix}
        {value.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
        {valueSuffix}
      </strong>
      <span>Market trend</span>
    </div>
  );
}

export default function FinancialChart({
  points,
  tone = "brand",
  label,
  className = "",
  width = 100,
  height = 50,
  area = false,
  grid = false,
  showYAxis = false,
  yTicks,
  valueRange,
  domainRange,
  valuePrefix = "",
  valueSuffix = "",
  tooltip = true,
}) {
  const mounted = useSyncExternalStore(
    subscribeToHydration,
    () => true,
    () => false,
  );
  const gradientId = `financial-chart-${useId().replaceAll(":", "")}`;
  const palette = tones[tone];
  const data = toChartData(points, valueRange);
  const domain = domainRange ?? valueRange ?? [0, 100];
  const spacious = width >= 300;
  const chartMargin = spacious
    ? { top: 32, right: showYAxis ? 42 : 24, bottom: 24, left: 24 }
    : { top: 8, right: showYAxis ? 34 : 6, bottom: 6, left: 6 };

  const activeDot = ({ cx, cy }) => (
    <circle
      className={styles.hoverPoint}
      cx={cx}
      cy={cy}
      r={3}
      fill={palette.line}
      stroke="#fff"
      strokeWidth={1.5}
    />
  );

  return (
    <div
      className={`${styles.chart} ${className}`.trim()}
      data-financial-chart="true"
      data-chart-engine="recharts"
      data-chart-tone={tone}
      data-chart-mounted={mounted ? "true" : "false"}
      role="img"
      aria-label={label}
    >
      <AreaChart
        width={width}
        height={height}
        data={data}
        margin={chartMargin}
        accessibilityLayer
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={palette.line} stopOpacity={0.18} />
            <stop offset="58%" stopColor={palette.line} stopOpacity={0.06} />
            <stop offset="100%" stopColor={palette.line} stopOpacity={0} />
          </linearGradient>
        </defs>
        {grid && (
          <CartesianGrid
            vertical={false}
            horizontalCoordinatesGenerator={gridCoordinates}
            stroke="#f3f4f6"
            strokeOpacity={0.05}
            strokeWidth={1}
          />
        )}
        <XAxis
          type="number"
          dataKey="index"
          domain={[0, data.length - 1]}
          axisLine={false}
          tickLine={false}
          tick={{
            fill: "#8b8fa3",
            fontFamily: "var(--font-sans)",
            fontSize: 12,
            fontWeight: 500,
          }}
          hide
        />
        <YAxis
          type="number"
          orientation="right"
          domain={domain}
          ticks={yTicks}
          hide={!showYAxis}
          axisLine={false}
          tickLine={false}
          width={spacious ? 44 : 28}
          tickMargin={spacious ? 10 : 5}
          tick={{
            fill: "#8b8fa3",
            fontFamily: "var(--font-sans)",
            fontSize: spacious ? 12 : 7,
            fontWeight: 600,
          }}
        />
        {tooltip && (
          <Tooltip
            content={
              <ReferenceTooltip
                valuePrefix={valuePrefix}
                valueSuffix={valueSuffix}
              />
            }
            cursor={false}
            isAnimationActive
            animationDuration={180}
            animationEasing="ease-out"
            offset={14}
            allowEscapeViewBox={{ x: true, y: true }}
          />
        )}
        <Area
          type="monotone"
          dataKey="value"
          stroke={palette.line}
          strokeWidth={2.75}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill={area ? `url(#${gradientId})` : "transparent"}
          fillOpacity={area ? 1 : 0}
          dot={false}
          activeDot={activeDot}
          isAnimationActive={mounted}
          animationDuration={700}
          animationEasing="ease-out"
        />
      </AreaChart>
    </div>
  );
}
