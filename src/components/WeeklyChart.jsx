import { useState } from "react";
import { motion } from "framer-motion";
import { BarChart3 } from "lucide-react";
import { weeklyBuckets } from "../lib/utils";

const W = 560;
const H = 190;
const PAD_L = 8;
const PAD_B = 26;
const PAD_T = 14;

export default function WeeklyChart({ applications }) {
  const [hover, setHover] = useState(null);
  const buckets = weeklyBuckets(applications, 8);
  const max = Math.max(1, ...buckets.map((b) => b.count));

  const slot = (W - PAD_L * 2) / buckets.length;
  const barW = Math.min(34, slot * 0.52);
  const chartH = H - PAD_T - PAD_B;

  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]"
    >
      <div className="mb-1 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-emerald-600" />
          <h2 className="text-[13px] font-bold uppercase tracking-wider text-slate-500">
            Applications per week
          </h2>
        </div>
        <p className="text-[11.5px] font-medium text-slate-400">Last 8 weeks</p>
      </div>

      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        role="img"
        aria-label="Bar chart of applications per week"
        onMouseLeave={() => setHover(null)}
      >
        {[0.25, 0.5, 0.75, 1].map((f) => {
          const y = PAD_T + chartH * (1 - f);
          return (
            <line
              key={f}
              x1={PAD_L}
              x2={W - PAD_L}
              y1={y}
              y2={y}
              stroke="#f1f5f9"
              strokeWidth="1"
            />
          );
        })}

        {buckets.map((b, i) => {
          const h = Math.max(b.count > 0 ? 6 : 0, (b.count / max) * chartH);
          const x = PAD_L + slot * i + (slot - barW) / 2;
          const y = PAD_T + chartH - h;
          const isHover = hover === i;
          return (
            <g key={i} onMouseEnter={() => setHover(i)} className="cursor-default">
              <rect
                x={x - (slot - barW) / 2}
                y={PAD_T}
                width={slot}
                height={chartH}
                fill="transparent"
              />
              <motion.rect
                x={x}
                y={y}
                width={barW}
                height={h}
                rx={5}
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ delay: 0.3 + i * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                style={{ transformOrigin: `${x + barW / 2}px ${PAD_T + chartH}px` }}
                fill={isHover ? "#059669" : b.count === 0 ? "#e2e8f0" : "#a7f3d0"}
                stroke={isHover ? "#047857" : "none"}
                strokeWidth="1.5"
              />
              {isHover && b.count > 0 && (
                <g>
                  <rect
                    x={x + barW / 2 - 34}
                    y={Math.max(2, y - 30)}
                    width="68"
                    height="22"
                    rx="7"
                    fill="#0f172a"
                  />
                  <text
                    x={x + barW / 2}
                    y={Math.max(2, y - 30) + 15}
                    textAnchor="middle"
                    fontSize="11"
                    fontWeight="700"
                    fill="#fff"
                  >
                    {b.count} applied
                  </text>
                </g>
              )}
              <text
                x={x + barW / 2}
                y={H - 8}
                textAnchor="middle"
                fontSize="10.5"
                fontWeight={isHover ? "700" : "500"}
                fill={isHover ? "#0f172a" : "#94a3b8"}
              >
                {b.label}
              </text>
            </g>
          );
        })}
      </svg>
    </motion.section>
  );
}
