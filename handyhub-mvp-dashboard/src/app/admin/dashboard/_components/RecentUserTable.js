"use client";

import { ConfigProvider } from "antd";
import { Table } from "antd";
import { Filter } from "lucide-react";
import { Tag } from "antd";
import { useState } from "react";
import ProfileModal from "@/components/SharedModals/ProfileModal";
import moment from "moment";

const RecentUserTable = ({ userDetails }) => {
  const [showProfileModal, setShowProfileModal] = useState(false);

  // =============== Table columns ===============
  const columns = [
    {
      title: "SL",
      dataIndex: "key",
      key: "_id",
      render: (value, record, indexOf) => `#${indexOf + 1}`,
    },
    {
      title: "Name",
      dataIndex: "name",
      render: (value, record) => (value ? value : "N/A"),
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Contact",
      dataIndex: "phoneNumber",
      render: (value, record) => (value ? value : "--"),
    },
    {
      title: "Join Date",
      dataIndex: "createdAt",
      render: (value) => moment(value).format("LL"),
    },
    {
      title: "Account Type",
      dataIndex: "role",

      filters: [
        {
          text: "Customer",
          value: "customer",
        },
        {
          text: "Service Provider",
          value: "seller",
        },
      ],
      filterIcon: () => (
        <Filter
          size={18}
          color="#fff"
          className="flex items-start justify-start"
        />
      ),
      onFilter: (value, record) => record.role.indexOf(value) === 0,

      render: (value) => {
        return (
          <Tag
            color={value === "customer" ? "blue" : "cyan"}
            className="!text-sm"
          >
            {value === "customer" ? "Customer" : "Service Provider"}
          </Tag>
        );
      },
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
      <h4 className="text-2xl font-semibold">Recently Joined Users</h4>

      <div className="my-5">
        <Table
          style={{ overflowX: "auto" }}
          columns={columns}
          dataSource={userDetails}
          scroll={{ x: "100%" }}
        ></Table>
      </div>

      {/* Profile Modal */}
      <ProfileModal open={showProfileModal} setOpen={setShowProfileModal} />
    </ConfigProvider>
  );
};

export default RecentUserTable;
