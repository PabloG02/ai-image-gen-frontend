export type ModelInfo = {
    publisher: string;
    family: string;
    version: string;
    id: string;
};

// Default fallback models in case the API call fails
const defaultModels: ModelInfo[] = [
    {
        publisher: "dummy",
        family: "dummy",
        version: "dummy",
        id: "dummy/dummy",
    }
];

// Initially set to default models, will be replaced when API data loads
export let MODELS: ModelInfo[] = [...defaultModels];

// Function to fetch models from the backend
export const fetchModels = async (): Promise<ModelInfo[]> => {
    try {
        const response = await fetch('http://localhost:8000/v1/models');
        if (!response.ok) {
            throw new Error(`Failed to fetch models: ${response.statusText}`);
        }
        
        const data = await response.json();
        // Parse the response based on your API structure
        // Assuming the API returns an array of model objects with the required fields
        const fetchedModels: ModelInfo[] = data.models.map((model: any) => ({
            publisher: model.publisher || 'Unknown',
            family: model.family || 'Unknown',
            version: model.version || 'Unknown',
            id: model.id
        }));
        
        // Update the models array
        MODELS = fetchedModels.length > 0 ? fetchedModels : defaultModels;
        return MODELS;
    } catch (error) {
        console.error('Error fetching models:', error);
        // Return default models if fetch fails
        return defaultModels;
    }
};

// Helper methods
export const getModelById = (modelId: string): ModelInfo | undefined => {
    return MODELS.find(model => model.id === modelId);
};

export const getModelsByPublisher = (publisher: string): ModelInfo[] => {
    return MODELS.filter(model => model.publisher === publisher);
};

export const getAllModelIds = (): string[] => {
    return MODELS.map(model => model.id);
};

export const initializeModelRecord = <T>(defaultValue?: T) =>
    Object.fromEntries(
        MODELS.map((model) => [model.id, defaultValue])
    ) as Record<string, T>;

// Hook for initializing models in the main app
export const initializeModelsFromApi = async (): Promise<void> => {
    try {
        await fetchModels();
        console.log('Models initialized successfully from API');
    } catch (error) {
        console.error('Failed to initialize models from API:', error);
    }
};