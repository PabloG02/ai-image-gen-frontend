import { createFileRoute } from '@tanstack/react-router'
import {ImagePlayground} from "@/components/ImagePlayground.tsx";
import {getRandomSuggestions} from "@/lib/suggestions.ts";

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  return (
    <ImagePlayground suggestions={getRandomSuggestions()} />
  )
}
