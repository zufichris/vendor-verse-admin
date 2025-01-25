import Link from "next/link"
import { Home, MoveLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function NotFound() {
    return (
        <div className="w-full py-10 flex flex-col items-center justify-center gap-6">
            <div className="animate-bounce">
                <h1 className="font-extrabold text-4xl">404</h1>
            </div>
            <div className="space-y-2 text-center">
                <h1 className="text-1xl font-bold tracking-tight">Page Not Found</h1>
                <p className="text-muted-foreground text-sm">Sorry, we couldn&apos;t find the page you&apos;re looking for.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
                <Button asChild variant="outline" size="lg">
                    <Link href="/">
                        <MoveLeft className="mr-2 h-4 w-4" />
                        Go back
                    </Link>
                </Button>
                <Button asChild size="lg">
                    <Link href="/">
                        <Home className="mr-2 h-4 w-4" />
                        Back to Home
                    </Link>
                </Button>
            </div>
        </div>
    )
}

