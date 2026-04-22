import type { AppProps } from "next/app";
import Layout from "@/components/Layout";
import { CartProvider } from "@/hooks/useCart";
import "@/styles/globals.css";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <CartProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </CartProvider>
  );
}
