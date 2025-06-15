"use client";

import { AntdRegistry } from "@ant-design/nextjs-registry";
import { ConfigProvider } from "antd";
import { mainTheme } from "../theme/mainTheme";
import NextTopLoader from "nextjs-toploader";
import { Toaster } from "react-hot-toast";
import { Provider as ReduxProvider } from "react-redux";
import { store } from "@/redux/store";

export default function Providers({ children }) {
  return (
    <ReduxProvider store={store}>
      <AntdRegistry>
        <ConfigProvider theme={mainTheme}>{children}</ConfigProvider>

        <NextTopLoader color="var(--primary-orange)" />

        <Toaster />
      </AntdRegistry>
    </ReduxProvider>
  );
}
