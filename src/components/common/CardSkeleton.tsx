import { Card, CardContent, CardFooter, CardHeader } from '@/components/common/Card'

export default function CardSkeleton() {
  return (
    <Card className="w-full skeleton mt-4">
      <CardHeader className="p-5 pb-0 ">
        <span className="px-60 bg-muted/50 rounded-[14px]"></span>
      </CardHeader>
      <CardContent className="mt-0.5 px-5 py-3 ">
        <span className="mr-2 pb-0.5 px-6.25 bg-muted/50 rounded-[14px]"></span>
        <span className="mr-2 pb-0.5 px-6.25 bg-muted/50 rounded-[14px]"></span>
        <span className="mr-2 pb-0.5 px-6.25 bg-muted/50 rounded-[14px]"></span>
      </CardContent>
      <CardFooter className="mt-[-25] px-5 text-muted-foreground text-sm">
        <div className="w-full flex justify-between">
          <div className="h-5 px-4 bg-muted/50 rounded-[14px]"></div>
          <div className="flex gap-4">
            <div className="mr-[-1] h-5 px-3 bg-muted/50 rounded-[14px]"></div>
            <div className="h-5 px-[18px] bg-muted/50 rounded-[14px]"></div>
            <div className="h-5 px-[18px] bg-muted/50 rounded-[14px]"></div>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}
