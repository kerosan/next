import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { Navigation } from "@/components/Navigation/Navigation";
import { Layout } from "antd";
import { ApolloWrapper } from "@/components/ApolloWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ApolloWrapper>
          <AntdRegistry>
            <Layout style={{ minHeight: "100vh", flexDirection: "row" }}>
              <Navigation />
              <div className="w-full">{children}</div>
            </Layout>
          </AntdRegistry>
        </ApolloWrapper>
      </body>
    </html>
  );
}
