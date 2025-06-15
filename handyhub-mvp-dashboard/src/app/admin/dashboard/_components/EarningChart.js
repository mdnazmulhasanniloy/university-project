"use client";
import { DatePicker, Select } from "antd";
import dayjs from "dayjs";
import moment from "moment";
import { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const data = [
  { month: "Jan", earning: 1200 },
  { month: "Feb", earning: 1402 },
  { month: "Mar", earning: 1525 },
  { month: "Apr", earning: 1222 },
  { month: "May", earning: 1553 },
  { month: "Jun", earning: 1634 },
  { month: "Jul", earning: 1923 },
  { month: "Aug", earning: 1324 },
  { month: "Sep", earning: 1834 },
  { month: "Oct", earning: 1256 },
  { month: "Nov", earning: 1634 },
  { month: "Dec", earning: 2105 },
];

const EarningChart = ({ monthlyIncome, setIncomeYear }) => {
  return (
    <div className="bg-primary-orange/10 w-full rounded-xl p-6 xl:w-1/2">
      <div className="mb-10 flex items-center justify-between">
        <h1 className="text-xl font-medium">Earning Overview</h1>

        <div className="flex-center-start gap-x-4">
          {/* <h1 className="font-medium bg-white rounded-lg px-3 py-1.5 text-sm border">
            Monthly Growth: <span className="ml-2 font-semibold">35.80%</span>
          </h1> */}
          <DatePicker
            onChange={(date, dateString) =>
              setIncomeYear(moment(dateString).format("YYYY"))
            }
            picker="year"
            defaultValue={dayjs()}
          />
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <AreaChart
          data={monthlyIncome}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="color" x1="0" y1="0" x2="0" y2="1">
              <stop offset="30%" stopColor="#080E0E" stopOpacity={1} />
              <stop offset="100%" stopColor="#22804C" stopOpacity={0.4} />
            </linearGradient>
          </defs>

          <XAxis
            tickMargin={10}
            axisLine={false}
            tickLine={false}
            dataKey="month"
          />

          <YAxis tickMargin={20} axisLine={false} tickLine={false} />

          <CartesianGrid
            opacity={0.19}
            stroke="#080E0E"
            strokeDasharray="3 3"
          />

          <Tooltip
            formatter={(value) => [`Monthly Earning: $${value}`]}
            contentStyle={{
              fontWeight: "500",
              borderRadius: "5px",
              border: "0",
            }}
            itemStyle={{ color: "var(--primary-orange)" }}
          />

          <Area
            activeDot={{ fill: "var(--primary-orange)" }}
            type="monotone"
            dataKey="income"
            strokeWidth={0}
            stroke="blue"
            fill="var(--primary-orange)"
            fillOpacity={1}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default EarningChart;
