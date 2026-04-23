import type { AppProps } from "next/app";
import Head from "next/head";
import Layout from "@/components/Layout";
import { BRAND_MARK_SRC } from "@/lib/branding";
import { CartProvider } from "@/hooks/useCart";
import "@/styles/globals.css";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <CartProvider>
      <Head>
        <link rel="icon" href={BRAND_MARK_SRC} type="image/png" />
        <link rel="apple-touch-icon" href={BRAND_MARK_SRC} />
      </Head>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </CartProvider>
  );
}
