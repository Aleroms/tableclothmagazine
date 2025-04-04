export interface Slide {
  to: string;
  img_url: string;
  release_date: Date;
}

export interface CarouselProps {
  slides: Slide[];
}
