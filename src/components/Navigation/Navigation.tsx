"use client";
import { Layout } from "antd";
import Link from "next/link";

import "./style.css";

const { Sider } = Layout;

export const Navigation = () => {
  return (
    <Sider>
      <div className="flex flex-col sidebar">
        <Link href="/" className="link">
          Home
        </Link>
        <hr />
        <Link href="/pages/user" className="link">
          User
        </Link>
        <Link href="/pages/address" className="link">
          Address
        </Link>
        <Link href="/pages/device" className="link">
          Device
        </Link>
        <Link href="/pages/billing" className="link">
          Billing
        </Link>
        <hr />
        <Link href="/pages/settings" className="link justify-end">
          Settings
        </Link>
      </div>
    </Sider>
  );
};
