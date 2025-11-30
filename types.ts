
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
  id?: number | string;
  title: string;
  category: string;
  subcategory?: string;
  duration: string;
  imageUrl: string;
  videoUrl: string;
  description: string;
}

export interface Article {
  id?: number | string;
  title: string;
  summary: string;
  content?: string;
  date: string;
  imageUrl: string;
  linkUrl?: string;
  category?: string;
}

export interface Partner {
  id?: number | string;
  name: string;
  role?: string;
  category?: string;
  description?: string;
  imageUrl: string;
  websiteUrl: string;
}