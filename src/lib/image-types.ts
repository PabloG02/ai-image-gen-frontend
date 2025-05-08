export interface GeneratedImage {
    image: string | null;
    modelId?: string;
}

export interface ImageResult {
    modelId?: string;
    image: string | null;
}

export interface ImageError {
    modelId: string;
    message: string;
}

export interface ModelTiming {
    startTime?: number;
    completionTime?: number;
    elapsed?: number;
}