import { useState, useEffect } from "react";
import { ModelSelect } from "@/components/ModelSelect";
import { PromptInput } from "@/components/PromptInput";
import {
    MODELS,
    getModelById,
    fetchModels,
} from "@/lib/model-config";
import type {Suggestion} from "@/lib/suggestions";
import { useImageGeneration } from "@/hooks/use-image-generation";

export function ImagePlayground({
                                    suggestions,
                                }: {
    suggestions: Suggestion[];
}) {
    const {
        images,
        timings,
        failedModels,
        isLoading,
        startGeneration,
        activePrompt,
    } = useImageGeneration();
    
    // Track if models are loading
    const [isLoadingModels, setIsLoadingModels] = useState(true);

    // Instead of showing all models at once, we now manage a list of selected models
    const [selectedModelIds, setSelectedModelIds] = useState<string[]>([]);

    // Fetch models from the backend on component mount
    useEffect(() => {
        async function loadModels() {
            setIsLoadingModels(true);
            try {
                const fetchedModels = await fetchModels();
                // Set the first model as selected by default once models are loaded
                if (fetchedModels.length > 0) {
                    setSelectedModelIds([fetchedModels[0].id]);
                }
            } catch (error) {
                console.error("Failed to load models:", error);
                // If there are models in the MODELS array, select the first one
                if (MODELS.length > 0) {
                    setSelectedModelIds([MODELS[0].id]);
                }
            } finally {
                setIsLoadingModels(false);
            }
        }
        
        loadModels();
    }, []);

    const handleAddModel = () => {
        // Find a model that's not already selected
        const availableModels = MODELS.filter(
            model => !selectedModelIds.includes(model.id)
        );

        if (availableModels.length > 0) {
            setSelectedModelIds(prev => [...prev, availableModels[0].id]);
        }
    };

    const handleRemoveModel = (modelId: string) => {
        setSelectedModelIds(prev => prev.filter(id => id !== modelId));
    };

    const handleModelChange = (oldModelId: string, newModelId: string) => {
        setSelectedModelIds(prev =>
            prev.map(id => id === oldModelId ? newModelId : id)
        );
    };

    const handlePromptSubmit = (newPrompt: string, size: string) => {
        if (selectedModelIds.length > 0) {
            startGeneration(newPrompt, selectedModelIds, size);
        }
    };

    return (
        <>
            <PromptInput
                onSubmit={handlePromptSubmit}
                isLoading={isLoading}
                suggestions={suggestions}
            />
            <>
                {isLoadingModels ? (
                    <div className="flex justify-center my-8">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
                            <p className="mt-4 text-muted-foreground">Loading models...</p>
                        </div>
                    </div>
                ) : (
                    (() => {
                        const getModelProps = () =>
                            selectedModelIds.map(modelId => {
                                const model = getModelById(modelId);
                                const imageItem = images.find(img => img.modelId === modelId);
                                const imageData = imageItem?.image;
                                const timing = timings[modelId];

                                return {
                                    model: model!,
                                    onChange: (newModelId: string) =>
                                        handleModelChange(modelId, newModelId),
                                    onRemove: () => handleRemoveModel(modelId),
                                    image: imageData,
                                    timing,
                                    failed: failedModels.includes(modelId),
                                };
                            });

                        return (
                            <>
                                {activePrompt && activePrompt.length > 0 && (
                                    <div className="text-center mb-8 text-muted-foreground">
                                        {activePrompt}
                                    </div>
                                )}

                                <div className="md:grid md:grid-cols-2 gap-8">
                                    {getModelProps().map((props) => (
                                        <ModelSelect key={props.model?.id} {...props} />
                                    ))}
                                </div>

                                {/* Add model button */}
                                {selectedModelIds.length < MODELS.length && (
                                    <div className="flex justify-center mt-4">
                                        <button
                                            className="px-4 py-2 bg-primary text-white rounded-md"
                                            onClick={handleAddModel}
                                        >
                                            Add another model
                                        </button>
                                    </div>
                                )}
                            </>
                        );
                    })()
                )}
            </>
        </>
    );
}