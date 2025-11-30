
export interface StrapiResponse<T> {
  data: T[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface Video {
  id?: number;
  title: string;
  category: string;
  subcategory?: string;
  duration: string;
  imageUrl: string;
  videoUrl: string;
  description: string;
}

export interface Article {
  id?: number;
  title: string;
  summary: string;
  content?: string;
  date: string;
  imageUrl: string;
}

export interface Partner {
  id?: number;
  name: string;
  category?: string;
  description: string;
  logoUrl: string;
  websiteUrl: string;
}