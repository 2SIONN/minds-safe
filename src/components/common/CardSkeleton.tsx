import { Card, CardContent, CardFooter, CardHeader } from '@/components/common/Card'

export default function CardSkeleton() {
  return (
    <Card className="w-full skeleton mt-4">
      <CardHeader className="p-5 pt-5 pb-1">
        <div className="card-header"></div>
      </CardHeader>
      <CardContent className="mt-0.5 px-5 py-3 ">
        <span className="card-tags"></span>
        <span className="card-tags"></span>
        <span className="invisible sm:visible card-tags"></span>
      </CardContent>
      <CardFooter className="pt-3 mb-0.25 px-5 text-muted-foreground text-sm">
        <div className="w-full flex justify-between">
          <div className="card-footer w-14"></div>
          <div className="flex gap-4">
            <div className="card-footer w-6 sm:w-10"></div>
            <div className="card-footer w-6 sm:w-10"></div>
            <div className="card-footer w-8 sm:w-12"></div>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}
