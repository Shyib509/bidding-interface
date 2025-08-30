import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle, Home } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <div className="bg-red-100 rounded-full p-4">
              <AlertCircle className="h-12 w-12 text-red-600" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            الصفحة غير موجودة
          </CardTitle>
          <CardDescription className="text-lg">
            لم يتم العثور على الصفحة المطلوبة
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="p-4 bg-gray-50 rounded-lg text-sm text-gray-600">
            <p className="mb-2">قد يكون السبب:</p>
            <ul className="space-y-1 text-right">
              <li>• الرابط غير صحيح</li>
              <li>• المزاد غير موجود</li>
              <li>• انتهت صلاحية الرابط</li>
            </ul>
          </div>

          <div className="space-y-3">
            <Button 
              onClick={() => window.location.href = '/'} 
              className="w-full"
              size="lg"
            >
              <Home className="ml-2 h-4 w-4" />
              الصفحة الرئيسية
            </Button>
            
            <p className="text-xs text-gray-500">
              للحصول على رابط المزاد الصحيح، تواصل مع التاجر
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

