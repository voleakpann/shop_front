// -----------------------------------------------------------------------------
// Mock data for the MiniStore template.
// Swap `image` values for real photos in /public when available.
// -----------------------------------------------------------------------------

export type Product = {
  slug: string;
  name: string;
  price: number;
  category: "Phones" | "Watches" | "Accessories" | "Tablets";
  tags: string[];
  brand: "Apple" | "Samsung" | "Green";
  image: string; // path under /public, or "" to use the styled placeholder
  featured?: boolean;
};

export const products: Product[] = [
  { slug: "iphone-10", name: "iPhone 10", price: 980, category: "Phones", tags: ["White", "Modern"], brand: "Apple", image: "/images/product-item1.jpg", featured: true },
  { slug: "iphone-11", name: "iPhone 12", price: 1100, category: "Phones", tags: ["White", "Modern"], brand: "Apple", image: "/images/iphone12.jpg" },
  { slug: "iphone-16", name: "iPhone 16", price: 780, category: "Phones", tags: ["White", "Cheap"], brand: "Apple", image: "/images/iphone_.jpg" },
  { slug: "pink-watch", name: "Pink Watch", price: 870, category: "Watches", tags: ["Classic", "Modern"], brand: "Apple", image: "/images/product-item6.jpg", featured: true },
  { slug: "heavy-watch", name: "Heavy Watch", price: 680, category: "Watches", tags: ["Modern"], brand: "Samsung", image: "/images/product-item7.jpg" },
  { slug: "spotted-watch", name: "Spotted Watch", price: 750, category: "Watches", tags: ["Classic"], brand: "Green", image: "/images/product-item8.jpg" },
  { slug: "spotted-watch-2", name: "Spotted Watch", price: 750, category: "Watches", tags: ["Classic"], brand: "Green", image: "/images/product-item9.jpg" },
  { slug: "black-watch", name: "Black Watch", price: 450, category: "Watches", tags: ["Modern"], brand: "Samsung", image: "/images/product-item10.jpg" },
  { slug: "iphone-13", name: "iPhone 13", price: 1500, category: "Phones", tags: ["Modern", "White"], brand: "Apple", image: "/images/product-item4.jpg", featured: true },
  { slug: "iphone-12", name: "iPhone 12", price: 1300, category: "Phones", tags: ["Modern"], brand: "Apple", image: "/images/product-item5.jpg" },
];

// Standalone hero / marketing imagery
export const heroImage = "/images/banner-image1.png";
export const saleImage = "/images/single-image1.png";
export const aboutImage = "/images/single-image2.jpg";
export const blogDetailImage = "/images/single-image3.jpg";
export const blogInlineImage = "/images/product-item6.jpg";
export const instaImages = [
  "/images/insta-item1.jpg",
  "/images/insta-item2.jpg",
  "/images/insta-item3.jpg",
  "/images/insta-item4.jpg",
  "/images/insta-item5.jpg",
];
export const blogGridImages = Array.from(
  { length: 9 },
  (_, i) => `/images/post-item${i + 1}.jpg`
);
export const commentAvatars = [
  "/images/commentor-item1.jpg",
  "/images/commentor-item2.jpg",
  "/images/commentor-item3.jpg",
];

export const getProduct = (slug: string) =>
  products.find((p) => p.slug === slug);

export const categories = ["All", "Phones", "Accessories", "Tablets", "Watches"];
export const productTags = ["White", "Cheap", "Mobile", "Modern"];
export const brands = ["Apple", "Samsung", "Green"];
export const priceRanges = ["Less than $10", "$10 - $20", "$20 - $30", "$30 - $40", "$40 - $50"];

// -----------------------------------------------------------------------------

export type Post = {
  slug: string;
  title: string;
  date: string;
  category: string;
  excerpt: string;
  image: string;
};

export const posts: Post[] = [
  {
    slug: "get-some-cool-gadgets-in-2023",
    title: "Get Some Cool Gadgets In 2023",
    date: "Feb 22, 2023",
    category: "Gadgets",
    excerpt:
      "From smart home hubs to wireless chargers, here are the gadgets worth adding to your setup this year.",
    image: "/images/post-item1.jpg",
  },
  {
    slug: "technology-hack-you-wont-get",
    title: "Technology Hack You Won't Get",
    date: "Feb 22, 2023",
    category: "Technology",
    excerpt:
      "A few lesser-known tricks buried in your devices' settings that can genuinely improve daily use.",
    image: "/images/post-item2.jpg",
  },
  {
    slug: "top-10-small-camera-in-the-world",
    title: "Top 10 Small Camera In The World",
    date: "Feb 22, 2023",
    category: "Camera",
    excerpt:
      "Compact doesn't mean low quality — these tiny cameras pack surprisingly sharp results.",
    image: "/images/post-item3.jpg",
  },
];

export const getPost = (slug: string) => posts.find((p) => p.slug === slug);

// -----------------------------------------------------------------------------

export type Testimonial = {
  quote: string;
  name: string;
  rating: number; // supports halves, e.g. 3.5
};

export const testimonials: Testimonial[] = [
  {
    quote:
      "Shopping here was effortless from start to finish. The product arrived a day early, beautifully packaged, and looked exactly like the photos. I'll definitely be coming back for my next upgrade.",
    name: "Emma Chamberlin",
    rating: 3.5,
  },
  {
    quote:
      "Great prices and even better service. I had a question before ordering and the team replied within minutes. The watch I bought feels premium and works flawlessly — highly recommended.",
    name: "Jennie Rose",
    rating: 3.5,
  },
  {
    quote:
      "I've ordered from this store multiple times now and every experience has been great. Shipping is quick, everything arrives well packaged, and the quality always exceeds the price.",
    name: "Marlon Kelly",
    rating: 4.5,
  },
];

// Items shown in the "Shop our Insta" strip
export const instaItems = Array.from({ length: 5 }, (_, i) => ({ id: i }));

// Cart line items (mock)
export const cartItems = [
  { ...products.find((p) => p.slug === "iphone-13")!, qty: 1 },
  { ...products.find((p) => p.slug === "pink-watch")!, qty: 1 },
];
