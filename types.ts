
export interface Video {
  id: string;
  title: string;
  category: string;
  duration: string;
  imageUrl: string;
  videoUrl: string;
}

export interface Article {
  id: string;
  title: string;
  summary: string;
  date: string;
  imageUrl: string;
}

export interface Partner {
  id: string;
  name: string;
  role: string;
  imageUrl: string;
}
