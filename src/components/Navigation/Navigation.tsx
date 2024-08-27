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
        <Link href="/user" className="link">
          User
        </Link>
        <Link href="/address" className="link">
          Address
        </Link>
        <Link href="/device" className="link">
          Device
        </Link>
        <Link href="/billing" className="link">
          Billing
        </Link>
        <hr />
        <Link href="/settings" className="link justify-end">
          Settings
        </Link>
      </div>
    </Sider>
  );
};
