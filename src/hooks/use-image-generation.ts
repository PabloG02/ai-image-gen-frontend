import { useState } from "react";
import type {ImageError, ImageResult, ModelTiming} from "@/lib/image-types";
import { initializeModelRecord } from "@/lib/model-config.ts";
import { API_URL } from "@/lib/config";

interface UseImageGenerationReturn {
    images: ImageResult[];
    errors: ImageError[];
    timings: Record<string, ModelTiming>;
    failedModels: string[];
    isLoading: boolean;
    startGeneration: (
        prompt: string,
        modelIds: string[],
        size: string
    ) => Promise<void>;
    resetState: () => void;
    activePrompt: string;
}

export function useImageGeneration(): UseImageGenerationReturn {
    const [images, setImages] = useState<ImageResult[]>([]);
    const [errors, setErrors] = useState<ImageError[]>([]);
    const [timings, setTimings] = useState<Record<string, ModelTiming>>(
        initializeModelRecord<ModelTiming>()
    );
    const [failedModels, setFailedModels] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [activePrompt, setActivePrompt] = useState("");

    const resetState = () => {
        setImages([]);
        setErrors([]);
        setTimings(initializeModelRecord<ModelTiming>());
        setFailedModels([]);
        setIsLoading(false);
    };

    const startGeneration = async (
        prompt: string,
        modelIds: string[],
        size: string
    ) => {
        setActivePrompt(prompt);
        try {
            setIsLoading(true);
            // Initialize images array with null values
            setImages(
                modelIds.map((modelId) => ({
                    modelId,
                    image: null,
                })),
            );

            // Clear previous state
            setErrors([]);
            setFailedModels([]);

            // Initialize timings with start times
            const now = Date.now();
            setTimings(
                Object.fromEntries(
                    modelIds.map((modelId) => [modelId, { startTime: now }])
                ) as Record<string, ModelTiming>
            );

            // Helper to generate image from a single model
            const generateImage = async (modelId: string) => {
                const startTime = now;
                console.log(`Generate image request [modelId=${modelId}]`);
                try {
                    const request = {
                        model: modelId,
                        prompt,
                        size,
                    };                    const response = await fetch(`${API_URL}/v1/images/generations`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(request),
                    });
                    const data = await response.json();
                    if (!response.ok) {
                        throw new Error(data.error || `Server error: ${response.status}`);
                    }

                    const completionTime = Date.now();
                    const elapsed = completionTime - startTime;
                    setTimings((prev) => ({
                        ...prev,
                        [modelId]: {
                            startTime,
                            completionTime,
                            elapsed,
                        },
                    }));

                    console.log(
                        `Successful image response [modelId=${modelId}, elapsed=${elapsed}ms]`,
                    );

                    // Update image in state
                    setImages((prevImages) =>
                        prevImages.map((item) =>
                            item.modelId === modelId
                                // ? { ...item, image: data.image ?? null, modelId }
                                ? { ...item, image: data.data[0].b64_json ?? null, modelId }
                                : item,
                        ),
                    );
                } catch (err) {
                    console.error(
                        `Error [modelId=${modelId}]:`,
                        err,
                    );
                    setFailedModels((prev) => [...prev, modelId]);
                    setErrors((prev) => [
                        ...prev,
                        {
                            modelId,
                            message:
                                err instanceof Error
                                    ? err.message
                                    : "An unexpected error occurred",
                        },
                    ]);

                    setImages((prevImages) =>
                        prevImages.map((item) =>
                            item.modelId === modelId
                                ? { ...item, image: null, modelId }
                                : item,
                        ),
                    );
                }
            };

            // Generate images for all selected models
            const fetchPromises = modelIds.map((modelId) => generateImage(modelId));

            await Promise.all(fetchPromises);
        } catch (error) {
            console.error("Error fetching images:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        images,
        errors,
        timings,
        failedModels,
        isLoading,
        startGeneration,
        resetState,
        activePrompt,
    };
}