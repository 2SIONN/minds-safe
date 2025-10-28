import { Card, CardContent, CardFooter, CardHeader } from '@/components/common/Card'

export default function CardSkeleton() {
  return (
    <Card className="backdrop-blur-xl w-full skeleton mb-4">
      <CardHeader className="mt-1.5 px-5 py-4">
        <span className="px-60 max-[600px]:px-30 bg-muted/50 rounded-[14px]"></span>
      </CardHeader>
      <CardContent className="mt-[-24] px-5">
        <span className="mr-2 pb-0.5 px-6.25 bg-muted/50 rounded-[14px]"></span>
        <span className="mr-2 pb-0.5 px-6.25 bg-muted/50 rounded-[14px]"></span>
        <span className="mr-2 pb-0.5 px-6.25 bg-muted/50 rounded-[14px]"></span>
      </CardContent>
      <CardFooter className="mt-[-25] px-5 text-muted-foreground text-sm">
        <div className="w-full flex justify-between">
          <div className="h-5.5 px-5 bg-muted/50 rounded-[14px]"></div>
          <div className="flex gap-3.5">
            <div className="mr-[-1] h-5 px-5 bg-muted/50 rounded-[14px]"></div>
            <div className="h-5 px-5 bg-muted/50 rounded-[14px]"></div>
            <div className="h-5 px-5 bg-muted/50 rounded-[14px]"></div>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}
