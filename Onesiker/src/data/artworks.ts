export interface ArtworkImage {
    src: string;
    title: string;
    visible?: boolean;
}

export interface ArtworkData {
    id: number;
    name?: string;
    images: ArtworkImage[];
}
