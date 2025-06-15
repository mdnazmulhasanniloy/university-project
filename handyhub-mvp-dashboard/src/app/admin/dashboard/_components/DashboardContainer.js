"use client";

import { useGetDashboardDataQuery } from "@/redux/api/income.api";
import EarningChart from "./EarningChart";
import RecentUserTable from "./RecentUserTable";
import UsersChart from "./UsersChart";
import CustomCountUp from "@/components/CustomCountUp/CustomCountUp";
import { useEffect, useState } from "react";
import moment from "moment";
import { ErrorModal } from "@/utils/modalHook";

// Dummy Data
const icons = {
  icon1: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="58"
      height="58"
      fill="none"
      viewBox="0 0 58 58"
    >
      <mask
        id="mask0_86_2692"
        width="58"
        height="58"
        x="0"
        y="0"
        maskUnits="userSpaceOnUse"
        style={{ maskType: "alpha" }}
      >
        <path fill="#D9D9D9" d="M0 0h58v58H0z"></path>
      </mask>
      <g mask="url(#mask0_86_2692)">
        <path
          fill="#fff"
          d="M2.417 48.333v-6.766q0-2.055 1.057-3.776a7.05 7.05 0 0 1 2.81-2.628 36 36 0 0 1 7.612-2.81 33.3 33.3 0 0 1 7.854-.936q3.987 0 7.854.936a36 36 0 0 1 7.613 2.81 7.05 7.05 0 0 1 2.809 2.628 7.1 7.1 0 0 1 1.057 3.776v6.766zm43.5 0v-7.25q0-2.658-1.48-5.105-1.48-2.446-4.2-4.199 3.082.363 5.8 1.239a30 30 0 0 1 5.075 2.145q2.175 1.208 3.323 2.688t1.148 3.232v7.25zM21.75 29q-3.987 0-6.827-2.84t-2.84-6.827 2.84-6.827 6.827-2.84 6.827 2.84 2.84 6.827-2.84 6.827T21.75 29m24.167-9.667q0 3.988-2.84 6.827T36.25 29q-.664 0-1.692-.151-1.026-.151-1.691-.332a14.4 14.4 0 0 0 2.507-4.29q.876-2.356.876-4.894 0-2.537-.876-4.893t-2.507-4.29a7.3 7.3 0 0 1 1.691-.393q.846-.09 1.692-.09 3.987 0 6.827 2.84 2.84 2.838 2.84 6.826"
        ></path>
      </g>
    </svg>
  ),
  icon2: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="58"
      height="58"
      fill="none"
      viewBox="0 0 58 58"
    >
      <mask
        id="mask0_86_2723"
        width="58"
        height="58"
        x="0"
        y="0"
        maskUnits="userSpaceOnUse"
        style={{ maskType: "alpha" }}
      >
        <path fill="#D9D9D9" d="M0 0h58v58H0z"></path>
      </mask>
      <g mask="url(#mask0_86_2723)">
        <path
          fill="#fff"
          d="M30.208 28.88a13.7 13.7 0 0 0 2.689-4.411q.936-2.478.936-5.136t-.936-5.135a13.7 13.7 0 0 0-2.689-4.41q3.625.483 6.042 3.201 2.417 2.72 2.417 6.344 0 3.626-2.417 6.344-2.416 2.72-6.042 3.202M43.5 48.332v-7.25a9.25 9.25 0 0 0-.967-4.138 12.4 12.4 0 0 0-2.537-3.474 26.4 26.4 0 0 1 5.71 2.81q2.627 1.72 2.627 4.802v7.25zm4.833-16.916v-4.834H43.5V21.75h4.833v-4.833h4.834v4.833H58v4.833h-4.833v4.834zm-29-2.417q-3.987 0-6.827-2.84t-2.84-6.827 2.84-6.827 6.827-2.84 6.827 2.84T29 19.333t-2.84 6.827T19.333 29M0 48.333v-6.766q0-2.055 1.057-3.776a7.05 7.05 0 0 1 2.81-2.628 36 36 0 0 1 7.612-2.81 33.3 33.3 0 0 1 7.854-.936q3.988 0 7.855.936a36 36 0 0 1 7.612 2.81 7.05 7.05 0 0 1 2.81 2.628 7.1 7.1 0 0 1 1.057 3.776v6.766z"
        ></path>
      </g>
    </svg>
  ),
  icon3: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="58"
      height="58"
      fill="none"
      viewBox="0 0 58 58"
    >
      <mask
        id="mask0_92_3017"
        width="58"
        height="58"
        x="0"
        y="0"
        maskUnits="userSpaceOnUse"
        style={{ maskType: "alpha" }}
      >
        <path fill="#D9D9D9" d="M0 0h58v58H0z"></path>
      </mask>
      <g mask="url(#mask0_92_3017)">
        <path
          fill="#fff"
          d="M9.667 48.333V29h9.666v19.333zm14.5 0V9.667h9.666v38.666zm14.5 0V21.75h9.666v26.583z"
        ></path>
      </g>
    </svg>
  ),
  icon4: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="58"
      height="58"
      fill="none"
      viewBox="0 0 58 58"
    >
      <mask
        id="mask0_92_3013"
        width="58"
        height="58"
        x="0"
        y="0"
        maskUnits="userSpaceOnUse"
        style={{ maskType: "alpha" }}
      >
        <path fill="#D9D9D9" d="M0 0h58v58H0z"></path>
      </mask>
      <g mask="url(#mask0_92_3013)">
        <path
          fill="#fff"
          d="M26.825 45.917h4.23v-3.021q3.02-.544 5.195-2.356 2.175-1.813 2.175-5.377a8.05 8.05 0 0 0-1.45-4.652q-1.45-2.115-5.8-3.686-3.625-1.208-5.015-2.114-1.39-.907-1.39-2.478 0-1.57 1.119-2.477 1.117-.906 3.232-.906 1.934 0 3.02.936a5.3 5.3 0 0 1 1.572 2.326l3.866-1.57q-.664-2.115-2.447-3.686t-3.957-1.752v-3.02h-4.23v3.02q-3.02.665-4.712 2.659t-1.691 4.47q0 2.84 1.661 4.592t5.226 3.02q3.807 1.39 5.287 2.478t1.48 2.84q0 1.993-1.42 2.93-1.42.936-3.414.936a5.48 5.48 0 0 1-3.534-1.238q-1.54-1.24-2.265-3.716l-3.988 1.57q.846 2.901 2.628 4.683t4.622 2.447zM29 53.167q-5.015 0-9.425-1.903t-7.673-5.166-5.166-7.673T4.833 29t1.903-9.425 5.166-7.673 7.673-5.165T29 4.833t9.425 1.904q4.41 1.902 7.673 5.165t5.166 7.673T53.167 29t-1.904 9.425q-1.902 4.41-5.165 7.673t-7.673 5.166T29 53.167"
        ></path>
      </g>
    </svg>
  ),
};

export default function DashboardContainer() {
  const [incomeYear, setIncomeYear] = useState(moment().format("yyyy"));
  const [role, setRole] = useState("customer");
  const [JoinYear, setJoinYear] = useState(moment().format("yyyy"));

  console.log(role);

  const query = {};
  if (incomeYear) query["incomeYear"] = incomeYear;
  if (JoinYear) query["JoinYear"] = JoinYear;
  if (role) query["role"] = role;
  const { data: dashboardRes, isLoading } = useGetDashboardDataQuery(query);

  const dashboardData = {
    monthlyIncome: dashboardRes?.data?.monthlyIncome || 0,
    monthlyUsers: dashboardRes?.data?.monthlyUsers || 0,
    toDayIncome: dashboardRes?.data?.toDayIncome || 0,
    totalIncome: dashboardRes?.data?.totalIncome || 0,
    totalServiceProvider: dashboardRes?.data?.totalServiceProvider || 0,
    totalCustomer: dashboardRes?.data?.totalCustomer || 0,
    totalUsers: dashboardRes?.data?.totalUsers || 0,
    userDetails: dashboardRes?.data?.userDetails || [],
  };

  const userStats = [
    {
      key: "users",
      title: "Total Users",
      icon: icons?.icon1,
      count: dashboardData?.totalUsers,
    },
    {
      key: "customers",
      title: "Total Customers",
      icon: icons?.icon2,
      count: dashboardData?.totalCustomer,
    },
    {
      key: "service-providers",
      title: "Total Service Providers",
      icon: icons?.icon3,
      count: dashboardData?.totalServiceProvider,
    },
    {
      key: "earning",
      title: "Total Earning",
      icon: icons?.icon4,
      count: dashboardData?.totalIncome,
    },
  ];

  return (
    <div className="space-y-20">
      {/* User Stats Section */}
      <section className="grid grid-cols-2 gap-5 md:grid-cols-3 2xl:grid-cols-4">
        {userStats?.map((stat) => (
          <div key={stat.key} className="flex-center-start gap-x-4">
            <div className="flex-center rounded-xl bg-primary-orange p-3">
              {stat.icon}
            </div>

            <div>
              <p className="font-dmSans text-lg font-medium">{stat.title}</p>
              <h5 className="mt-0.5 text-3xl font-semibold text-primary-orange">
                {stat.key !== "earning" ? (
                  <CustomCountUp end={stat.count} />
                ) : (
                  <span>
                    $<CustomCountUp end={stat.count} />
                  </span>
                )}
              </h5>
            </div>
          </div>
        ))}
      </section>

      {/* Charts */}
      <section className="flex-center-between flex-col gap-10 xl:flex-row">
        <UsersChart
          setRole={setRole}
          role={role}
          setJoinYear={setJoinYear}
          monthlyUsers={dashboardData?.monthlyUsers}
        />

        <EarningChart
          monthlyIncome={dashboardData?.monthlyIncome}
          setIncomeYear={setIncomeYear}
        />
      </section>

      {/* Recent Users Table */}
      <section>
        <RecentUserTable userDetails={dashboardData?.userDetails} />
      </section>
    </div>
  );
}
