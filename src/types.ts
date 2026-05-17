export type NavItem = {
  id: string;
  label: string;
  href: string;
};

export type FeatureCard = {
  id: string;
  title: string;
  subtitle: string;
  action: string;
  href: string;
  image?: string;
};

export type VideoItem = {
  id: string;
  title: string;
  duration: string;
  href: string;
  image?: string;
};

export type GalleryItem = {
  id: string;
  title: string;
  kind: "image" | "video";
  summary: string;
  date: string;
  image?: string;
};

export type HomePageData = {
  navItems: NavItem[];
  featureCards: FeatureCard[];
  videos: VideoItem[];
  documentary: VideoItem[];
  gallery: GalleryItem[];
};
