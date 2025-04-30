// Generic type for MDX component props
export type ComponentProps = {
  children: React.ReactNode;
};

export type ComponetAnchorProps = ComponentProps & {
  href: string;
};

export type ComponentImageProps = ComponentProps & {
  src: string;
  alt: string;
};