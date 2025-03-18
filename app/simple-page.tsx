import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function SimplePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <h1 className="text-4xl font-bold mb-4">Portfolio Website</h1>
      <p className="text-xl mb-8 max-w-md">This is a simplified page to test deployment functionality.</p>
      <div className="space-y-4">
        <div>
          <Button asChild className="mr-4">
            <Link href="/api/test">Test API</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/">Go to Main Site</Link>
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">If you're seeing this page, the basic deployment is working!</p>
      </div>
    </div>
  )
}

