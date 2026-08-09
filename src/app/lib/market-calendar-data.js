export const CALENDAR_DAYS = [
  { weekday: "Mon", day: 12, month: "May" },
  { weekday: "Tue", day: 13, month: "May" },
  { weekday: "Wed", day: 14, month: "May" },
  { weekday: "Today", day: 15, month: "May", current: true },
  { weekday: "Fri", day: 16, month: "May" },
  { weekday: "Sat", day: 17, month: "May" },
  { weekday: "Sun", day: 18, month: "May" },
];

export const ECONOMIC_CALENDAR_GROUPS = [
  {
    label: "Thursday, 15 May 2025",
    events: [
      { time: "08:00 AM", event: "WPI Inflation (YoY)", period: "Apr 2025", impact: "High", actual: "0.85%", forecast: "1.20%", previous: "0.26%" },
      { time: "11:30 AM", event: "CPI Inflation (YoY)", period: "Apr 2025", impact: "High", actual: "4.83%", forecast: "4.90%", previous: "4.85%" },
      { time: "01:00 PM", event: "Industrial Production (YoY)", period: "Mar 2025", impact: "Medium", actual: "5.2%", forecast: "4.3%", previous: "5.0%" },
      { time: "04:00 PM", event: "RBI Monetary Policy Meeting Minutes", period: "May 2025", impact: "High", actual: "—", forecast: "—", previous: "—" },
    ],
  },
  {
    label: "Friday, 16 May 2025",
    events: [
      { time: "08:00 AM", event: "Trade Balance", period: "Apr 2025", impact: "Medium", actual: "—", forecast: "-$22.50B", previous: "-$21.54B" },
      { time: "05:00 PM", event: "Forex Reserves", period: "May 09, 2025", impact: "Low", actual: "—", forecast: "—", previous: "$641.48B" },
    ],
  },
  {
    label: "Monday, 19 May 2025",
    events: [
      { time: "10:00 AM", event: "GDP Growth Rate (YoY)", period: "Q4 2024-25", impact: "High", actual: "—", forecast: "6.6%", previous: "6.2%" },
    ],
  },
];

export function moveCalendarSelection(currentIndex, direction) {
  return Math.max(0, Math.min(CALENDAR_DAYS.length - 1, currentIndex + direction));
}
