import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {type ModelInfo, MODELS} from "@/lib/model-config";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import type {ModelTiming} from "@/lib/image-types";
import { ImageDisplay } from "./ImageDisplay";
import { X } from "lucide-react";

interface ModelSelectProps {
    model: ModelInfo,
    onChange: (newModelId: string) => void;
    onRemove: () => void;
    image: string | null | undefined;
    timing?: ModelTiming;
    failed?: boolean;
}

export function ModelSelect({
                                model,
                                onChange,
                                onRemove,
                                image,
                                timing,
                                failed,
                            }: ModelSelectProps) {
    return (
        <Card className="w-full">
            <CardContent className="h-full">
                <div className="flex items-center justify-between gap-2 mb-4">
                    <div className="flex items-center gap-2 w-full">
                        <div className="flex flex-col w-full">
                            <div className="flex items-start justify-between w-full">
                                <div className="flex flex-row flex-wrap gap-2">
                                    {/* Publisher select */}
                                    <div className="flex flex-col space-y-2">
                                        <Label htmlFor="publisher">Publisher</Label>
                                        <Select
                                            value={model.publisher}
                                            onValueChange={(newPublisher) => {
                                                onChange(MODELS.find(m => m.publisher === newPublisher)!.id);
                                            }}
                                        >
                                            <SelectTrigger id="publisher">
                                                <SelectValue placeholder="Select publisher" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    {Array.from(new Set(MODELS.map(m => m.publisher))).map((pub) => (
                                                        <SelectItem key={pub} value={pub}>
                                                            {pub}
                                                        </SelectItem>
                                                    ))}
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Model name select */}
                                    <div className="flex flex-col space-y-2">
                                        <Label htmlFor="modelName">Family</Label>
                                        <Select
                                            value={model.family}
                                            onValueChange={(newModelName) => {
                                                onChange(MODELS.find(m => m.publisher === model.publisher && m.family === newModelName)!.id);
                                            }}
                                        >
                                            <SelectTrigger id="modelName">
                                                <SelectValue placeholder="Select model" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    {Array.from(new Set(MODELS
                                                        .filter(m => m.publisher === model.publisher)
                                                        .map(m => m.family)))
                                                        .map((name) => (
                                                            <SelectItem key={name} value={name}>
                                                                {name}
                                                            </SelectItem>
                                                        ))}
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Version select */}
                                    <div className="flex flex-col space-y-2">
                                        <Label htmlFor="version">Version</Label>
                                        <Select
                                            value={model.version}
                                            onValueChange={(newVersion) => {
                                                onChange(MODELS.find(m => m.publisher === model.publisher && m.family === model.family && m.version === newVersion)!.id);
                                            }}
                                        >
                                            <SelectTrigger id="version">
                                                <SelectValue placeholder="Select version" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    {MODELS
                                                        .filter(m =>
                                                            m.publisher === model.publisher &&
                                                            m.family === model.family
                                                        )
                                                        .map((model) => (
                                                            <SelectItem key={model.version} value={model.version}>
                                                                {model.version}
                                                            </SelectItem>
                                                        ))}
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <button
                                    className="text-gray-500 hover:text-gray-700"
                                    onClick={onRemove}
                                >
                                    <X size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <ImageDisplay
                    modelId={model.id}
                    image={image}
                    timing={timing}
                    failed={failed}
                />
            </CardContent>
        </Card>
    );
}