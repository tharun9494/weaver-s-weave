import bridal from "@/assets/product-bridal.jpg";
import banarasi from "@/assets/product-banarasi.jpg";
import softSilk from "@/assets/product-soft-silk.jpg";
import designer from "@/assets/product-designer.jpg";

export type Product = {
  id: string;
  name: string;
  weave: string;
  price: number;
  compareAt?: number;
  image: string;
  origin: string;
  weaver: string;
  occasion: string;
  badge?: string;
};

export const products: Product[] = [
  {
    id: "kanchi-rani",
    name: "Rani Kanchipuram",
    weave: "Pure Kanchipuram Silk",
    price: 42800,
    compareAt: 51500,
    image: bridal,
    origin: "Kanchipuram, Tamil Nadu",
    weaver: "Woven by Murugan & family",
    occasion: "Bridal",
    badge: "Bridal Icon",
  },
  {
    id: "banarasi-champagne",
    name: "Champagne Banarasi",
    weave: "Katan Silk Brocade",
    price: 36400,
    image: banarasi,
    origin: "Varanasi, Uttar Pradesh",
    weaver: "Woven by Iqbal Ansari",
    occasion: "Wedding",
    badge: "New Arrival",
  },
  {
    id: "burgundy-soft-silk",
    name: "Burgundy Mysore Soft Silk",
    weave: "Soft Silk, Rose Gold Zari",
    price: 18900,
    compareAt: 22400,
    image: softSilk,
    origin: "Mysore, Karnataka",
    weaver: "Woven by Lakshmi Devi",
    occasion: "Festival",
  },
  {
    id: "designer-tussar",
    name: "Aranya Designer Tussar",
    weave: "Hand-painted Tussar Silk",
    price: 24500,
    image: designer,
    origin: "Bhagalpur, Bihar",
    weaver: "Woven by Sunil Kumar",
    occasion: "Reception",
    badge: "Limited",
  },
];

export const categories = [
  { name: "Bridal Silk", count: 42, image: bridal },
  { name: "Kanchipuram", count: 128, image: softSilk },
  { name: "Banarasi", count: 96, image: banarasi },
  { name: "Soft Silk", count: 74, image: softSilk },
  { name: "Designer Sarees", count: 51, image: designer },
  { name: "Festival Collection", count: 63, image: banarasi },
];

export const formatINR = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
