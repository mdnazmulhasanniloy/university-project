"use client";

import { ConfigProvider, Table } from "antd";
import clsx from "clsx";
import { ArrowRightLeft } from "lucide-react";
import userImage from "@/assets/images/user-avatar-lg.png";
import Image from "next/image";
import { Filter } from "lucide-react";
import { Tooltip } from "antd";
import { Eye } from "lucide-react";
import { useState } from "react";
import { Tag } from "antd";
import EarningModal from "./EarningModal";
import { useAllEarningsQuery } from "@/redux/api/income.api";
import moment from "moment";

export default function EarningsTable() {
  const [showEarningModal, setShowEarningModal] = useState(false);
  const [modalData, setModalData] = useState(null);
  const { data: earningsRes, isFetching, isLoading } = useAllEarningsQuery();

  const earningsData = earningsRes?.data || [];

  // ================== Table Columns ================
  const columns = [
    {
      title: "Name",
      dataIndex: "user",
      render: (value) => (value?.name ? value?.name : "N/A"),
    },
    {
      title: "Email",
      dataIndex: "user",
      render: (value) => (value?.email ? value?.email : "N/A"),
    },
    {
      title: "Contact",
      dataIndex: "user",
      render: (value) => (value?.phoneNumber ? value?.phoneNumber : "N/A"),
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      render: (value) => moment(value).format("ll"),
    },

    {
      title: "Amount",
      dataIndex: "amount",
      render: (value) => (
        <Tag color="blue" className="font-semibold">
          ${value}
        </Tag>
      ),
    },

    {
      title: "Tnx ID",
      dataIndex: "tranId",
      render: (value) => (
        <Tag color="green" className="font-semibold">
          #{value}
        </Tag>
      ),
    },
    {
      title: "Action",
      render: (value) => (
        <Tooltip title="Show Details">
          <button
            onClick={() => {
              setShowEarningModal(true), setModalData(value);
            }}
          >
            <Eye color="#1B70A6" size={22} />
          </button>
        </Tooltip>
      ),
    },
  ];

  // Dummy data
  const earningStats = [
    {
      key: "today",
      title: "Today's Earning",
      amount: earningsData?.todayEarnings,
    },

    {
      key: "total",
      title: "Total Earnings",
      amount: earningsData?.totalEarnings,
    },
  ];
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#1B70A6",
          colorInfo: "#1B70A6",
        },
      }}
    >
      {/* Earning stats */}
      <section className="grid grid-cols-2 gap-5 md:grid-cols-3 xl:grid-cols-4">
        {earningStats?.map((stat) => (
          <div
            key={stat.key}
            className={clsx(
              "flex-center-start gap-x-4 rounded-lg px-5 py-4 text-lg text-white",
              stat.key === "today" ? "bg-primary-orange" : "bg-primary-blue",
            )}
          >
            <ArrowRightLeft size={24} />
            <p>
              {stat.title}
              <span className="pl-3 text-xl font-semibold">${stat.amount}</span>
            </p>
          </div>
        ))}
      </section>

      {/* Earning table */}
      <section className="my-10">
        <Table
          loading={isLoading ?? isFetching}
          style={{ overflowX: "auto" }}
          columns={columns}
          dataSource={earningsData?.allData}
          scroll={{ x: "100%" }}
          pagination
        ></Table>
      </section>

      {/* Show earning modal */}
      <EarningModal
        modalData={modalData}
        setModalData={setModalData}
        open={showEarningModal}
        setOpen={setShowEarningModal}
      />
    </ConfigProvider>
  );
}
