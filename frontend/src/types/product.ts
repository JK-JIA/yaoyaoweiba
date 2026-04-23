export type Category = "dog-bed" | "bowl" | "dog-food" | "treat";

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: Category;
  price: string;
  /** Cover / first image; always in sync with the first entry of `images` when that array is set. */
  image: string;
  /** Full gallery when more than one image exists (order = display order). */
  images?: string[];
  shortDescription: string;
  details: string;
  specs: string[];
  fitFor: string;
}
