export type Category = "dog-bed" | "bowl" | "dog-food" | "treat";

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: Category;
  price: string;
  image: string;
  images?: string[];
  shortDescription: string;
  details: string;
  specs: string[];
  fitFor: string;
}
