export interface ArtworkImage {
    src: string;
    title: string;
    alt_fr?: string;
    alt_en?: string;
    visible?: boolean;
}

export interface ArtworkData {
    id: number;
    name?: string;
    images: ArtworkImage[];
}
