import { ReactNode } from "react";
import Footer from "@/components/Footer";
import FloatingCart from "@/components/FloatingCart";
import Header from "@/components/Header";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen">
      <Header />
      <main>{children}</main>
      <Footer />
      <FloatingCart />
    </div>
  );
}
