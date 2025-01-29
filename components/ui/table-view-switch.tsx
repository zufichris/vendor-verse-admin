import { LayoutGrid, LayoutList } from "lucide-react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface ViewSwitcherProps {
    readonly view: "table" | "grid"
    readonly onViewChange: (view: "table" | "grid") => void
}

export function ViewSwitcher({ view, onViewChange }: ViewSwitcherProps) {
    return (
        <Tabs value={view} onValueChange={(value) => onViewChange(value as "table" | "grid")}>
            <TabsList className="grid w-20 grid-cols-2">
                <TabsTrigger value="grid">
                    <LayoutGrid className="h-4 w-4" />
                </TabsTrigger>
                <TabsTrigger value="table">
                    <LayoutList className="h-4 w-4" />
                </TabsTrigger>
            </TabsList>
        </Tabs>
    )
}

