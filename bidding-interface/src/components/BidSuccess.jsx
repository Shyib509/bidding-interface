import { useLocation, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle, Gavel, ArrowRight } from 'lucide-react'

export default function BidSuccess() {
  const location = useLocation()
  const navigate = useNavigate()
  
  const { bidAmount, auctionId } = location.state || {}

  const handleBackToAuction = () => {
    if (auctionId) {
      navigate(`/auction/${auctionId}`)
    } else {
      navigate('/')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <div className="bg-green-100 rounded-full p-4">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-green-800">
            تم تسجيل مزايدتك بنجاح!
          </CardTitle>
          <CardDescription className="text-lg">
            شكراً لمشاركتك في المزاد
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {bidAmount && (
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="flex items-center justify-center space-x-2 space-x-reverse mb-2">
                <Gavel className="h-5 w-5 text-green-600" />
                <span className="text-sm font-medium text-green-800">مبلغ مزايدتك</span>
              </div>
              <div className="text-3xl font-bold text-green-800">
                {bidAmount} د.ك
              </div>
            </div>
          )}

          <div className="space-y-4 text-sm text-gray-600 text-right">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="font-medium text-blue-800 mb-2">ماذا يحدث الآن؟</h3>
              <ul className="space-y-2 text-blue-700">
                <li>• تم تسجيل مزايدتك في النظام</li>
                <li>• ستتلقى إشعاراً إذا تم تجاوز مزايدتك</li>
                <li>• سيتم التواصل معك عند انتهاء المزاد</li>
                <li>• يمكنك العودة لمتابعة المزاد في أي وقت</li>
              </ul>
            </div>

            <div className="p-4 bg-yellow-50 rounded-lg">
              <h3 className="font-medium text-yellow-800 mb-2">معلومات مهمة</h3>
              <ul className="space-y-2 text-yellow-700">
                <li>• تأكد من صحة رقم هاتفك للتواصل</li>
                <li>• يمكنك زيادة مزايدتك في أي وقت</li>
                <li>• المزايدة ملزمة عند الفوز</li>
              </ul>
            </div>
          </div>

          <div className="space-y-3">
            <Button 
              onClick={handleBackToAuction} 
              className="w-full"
              size="lg"
            >
              <ArrowRight className="ml-2 h-4 w-4" />
              العودة للمزاد
            </Button>
            
            <p className="text-xs text-gray-500">
              احتفظ برقم المزاد للمراجعة: #{auctionId?.slice(0, 8)}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

