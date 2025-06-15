"use client";
import { logout } from "@/redux/features/authSlice";
import { SuccessModal } from "@/utils/modalHook";
import { Button } from "antd";
import { useRouter } from "next/navigation";
import React from "react";
import { useDispatch } from "react-redux";
const Unauthorized = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    router.push("/");
    SuccessModal("You are not authorized. Logging out...");
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#f8f9fa",
      }}
    >
      <h1 style={{ fontSize: "2rem", marginBottom: "1rem", color: "#dc3545" }}>
        403 - Unauthorized
      </h1>
      <p
        style={{
          fontSize: "1.2rem",
          marginBottom: "2rem",
          textAlign: "center",
        }}
      >
        You do not have permission to access this page.
      </p>
      <Button
        onClick={handleLogout}
        type="primary"
        className="!h-10 !font-semibold"
      >
        Logout
      </Button>
    </div>
  );
};

export default Unauthorized;
