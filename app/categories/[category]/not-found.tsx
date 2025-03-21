import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { FolderX, ArrowLeft } from 'lucide-react'

export default function CategoryNotFound() {
  return (
    <div className="flex items-center justify-center min-h-[60vh] px-4">
      <Card className="w-full max-w-md p-6 text-center">
        <div className="flex justify-center mb-6">
          <div className="bg-primary/10 p-4 rounded-full">
            <FolderX className="h-12 w-12 text-primary" />
          </div>
        </div>

        <h1 className="text-2xl font-bold mb-2">Category Not Found</h1>

        <p className="text-muted-foreground mb-6">
          The joke category you&apos;re looking for doesn&apos;t exist. Check out our other
          categories for some laughs!
        </p>

        <Link href="/categories">
          <Button className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Browse Categories
          </Button>
        </Link>
      </Card>
    </div>
  )
}
