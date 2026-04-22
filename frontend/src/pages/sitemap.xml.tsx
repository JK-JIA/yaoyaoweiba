import { GetServerSideProps } from "next";
import { getServerApiBase } from "@/lib/api";
import { Product } from "@/types/product";

const BASE_URL = "https://www.yaoyaoweiba.com";

function buildSitemap(products: Product[]) {
  const staticRoutes = ["", "/about", "/contact", "/category/dog-bed", "/category/bowl", "/category/dog-food", "/category/treat"];
  const productRoutes = products.map((p) => `/products/${p.slug}`);
  const allRoutes = [...staticRoutes, ...productRoutes];

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allRoutes
  .map(
    (route) => `<url>
  <loc>${BASE_URL}${route}</loc>
</url>`
  )
  .join("\n")}
</urlset>`;
}

function SiteMap() {
  return null;
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const base = getServerApiBase();
  let products: Product[] = [];
  try {
    const response = await fetch(`${base}/api/products`);
    if (response.ok) {
      products = (await response.json()) as Product[];
    }
  } catch {
    products = [];
  }
  const sitemap = buildSitemap(products);
  res.setHeader("Content-Type", "text/xml");
  res.write(sitemap);
  res.end();

  return {
    props: {}
  };
};

export default SiteMap;
