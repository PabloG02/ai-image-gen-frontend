import { useState } from "react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import {ArrowUpRight, ArrowUp, RefreshCw, Loader, Settings2} from "lucide-react";
import { getRandomSuggestions, type Suggestion } from "@/lib/suggestions";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface PromptInputProps {
    onSubmit: (prompt: string, size: string) => void;
    isLoading?: boolean;
    suggestions: Suggestion[];
}

export function PromptInput({
                                suggestions: initSuggestions,
                                isLoading,
                                onSubmit,
                            }: PromptInputProps) {
    const [input, setInput] = useState("");
    const [suggestions, setSuggestions] = useState<Suggestion[]>(initSuggestions);
    const [size, setSize] = useState("1024x1024");

    const updateSuggestions = () => {
        setSuggestions(getRandomSuggestions());
    };
    const handleSuggestionSelect = (prompt: string) => {
        setInput(prompt);
        onSubmit(prompt, size);
    };

    const handleSubmit = () => {
        if (!isLoading && input.trim()) {
            onSubmit(input, size);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            if (!isLoading && input.trim()) {
                onSubmit(input, size);
            }
        }
    };

    return (
        <div className="w-full mb-8">
            <div className="bg-zinc-50 rounded-xl p-4">
                <div className="flex flex-col gap-3">
                    <Textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Enter your prompt here"
                        rows={3}
                        className="text-base bg-transparent border-none shadow-none p-0 resize-none placeholder:text-zinc-500 text-[#111111] focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                    <div className="flex items-center justify-between pt-1">
                        <div className="flex items-center justify-between space-x-2">
                            <button
                                onClick={updateSuggestions}
                                className="flex items-center justify-between px-2 rounded-lg py-1 bg-background text-sm hover:opacity-70 group transition-opacity duration-200"
                            >
                                <RefreshCw className="w-4 h-4 text-zinc-500 group-hover:opacity-70" />
                            </button>
                            {suggestions.map((suggestion, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleSuggestionSelect(suggestion.prompt)}
                                    className={cn(
                                        "flex items-center justify-between px-2 rounded-lg py-1 bg-background text-sm hover:opacity-70 group transition-opacity duration-200",
                                        index > 2
                                            ? "hidden md:flex"
                                            : index > 1
                                                ? "hidden sm:flex"
                                                : "",
                                    )}
                                >
                                    <span>
                                      <span className="text-black text-xs sm:text-sm">
                                        {suggestion.text.toLowerCase()}
                                      </span>
                                    </span>
                                    <ArrowUpRight className="ml-1 h-2 w-2 sm:h-3 sm:w-3 text-zinc-500 group-hover:opacity-70" />
                                </button>
                            ))}
                        </div>
                        <div className="flex items-center space-x-2">
                            <Popover>
                                <PopoverTrigger asChild>
                                    <button className="h-8 w-8 rounded-full bg-background flex items-center justify-center hover:opacity-70">
                                        <Settings2 className="w-4 h-4" />
                                    </button>
                                </PopoverTrigger>
                                <PopoverContent>
                                    <div className="flex flex-col space-y-2">
                                        <label className="text-sm font-medium">Image Size</label>
                                        <Select onValueChange={setSize} defaultValue={size}>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder={size} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {['256x256','512x512','1024x1024'].map(sz => (
                                                    <SelectItem key={sz} value={sz}>{sz}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </PopoverContent>
                            </Popover>
                            <button
                                onClick={handleSubmit}
                                disabled={isLoading || !input.trim()}
                                className="h-8 w-8 rounded-full bg-black flex items-center justify-center disabled:opacity-50"
                            >
                                {isLoading ? (
                                    <Loader className="w-5 h-5 text-white" />
                                ) : (
                                    <ArrowUp className="w-5 h-5 text-white" />
                                )}
                            </button>
                        </div>
                     </div>
                </div>
            </div>
        </div>
    );
}