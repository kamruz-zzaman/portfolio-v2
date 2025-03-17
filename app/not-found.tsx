import Link from "next/link"
import { Suspense } from "react"
import { Button } from "@/components/ui/button"

// Create a client component that uses useSearchParams
function NotFoundContent() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
      <p className="text-muted-foreground mb-8 max-w-md">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Button asChild>
        <Link href="/">Return Home</Link>
      </Button>
    </div>
  )
}

// Main component with Suspense boundary
export default function NotFound() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
          <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
          <p>Loading...</p>
        </div>
      }
    >
      <NotFoundContent />
    </Suspense>
  )
}

