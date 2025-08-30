import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  Gavel, 
  Clock, 
  Users, 
  TrendingUp, 
  Phone, 
  User, 
  DollarSign,
  Loader2,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import biddingApi from '../lib/api'

export default function AuctionView() {
  const { auctionId } = useParams()
  const navigate = useNavigate()
  
  const [auction, setAuction] = useState(null)
  const [bids, setBids] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  const [bidForm, setBidForm] = useState({
    bidder_name: '',
    bidder_phone: '',
    bid_amount: ''
  })

  useEffect(() => {
    fetchAuctionData()
    // تحديث البيانات كل 10 ثوان
    const interval = setInterval(fetchAuctionData, 10000)
    return () => clearInterval(interval)
  }, [auctionId])

  const fetchAuctionData = async () => {
    try {
      const auctionData = await biddingApi.getAuction(auctionId)
      setAuction(auctionData)
      
      if (auctionData.bids) {
        setBids(auctionData.bids.sort((a, b) => new Date(b.bid_time) - new Date(a.bid_time)))
      }
    } catch (error) {
      console.error('Error fetching auction:', error)
      setError('فشل في جلب بيانات المزاد')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    setBidForm({
      ...bidForm,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmitBid = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    setSuccess('')

    // التحقق من صحة البيانات
    const bidAmount = parseFloat(bidForm.bid_amount)
    const minBid = auction.current_highest_bid 
      ? auction.current_highest_bid + 1 
      : auction.starting_price

    if (bidAmount < minBid) {
      setError(`يجب أن تكون المزايدة أكبر من ${minBid} د.ك`)
      setSubmitting(false)
      return
    }

    try {
      await biddingApi.placeBid(auctionId, {
        ...bidForm,
        bid_amount: bidAmount
      })
      
      setSuccess('تم تسجيل مزايدتك بنجاح!')
      setBidForm({ bidder_name: '', bidder_phone: '', bid_amount: '' })
      
      // تحديث البيانات
      await fetchAuctionData()
      
      // الانتقال لصفحة النجاح بعد 2 ثانية
      setTimeout(() => {
        navigate('/success', { 
          state: { 
            bidAmount: bidAmount,
            auctionId: auctionId 
          }
        })
      }, 2000)
      
    } catch (error) {
      setError(error.message)
    } finally {
      setSubmitting(false)
    }
  }

  const getStatusBadge = (status) => {
    const statusMap = {
      'active': { label: 'نشط', variant: 'default', color: 'bg-green-100 text-green-800' },
      'ended': { label: 'منتهي', variant: 'secondary', color: 'bg-gray-100 text-gray-800' },
      'pending': { label: 'في الانتظار', variant: 'outline', color: 'bg-yellow-100 text-yellow-800' }
    }
    
    const statusInfo = statusMap[status] || { label: status, variant: 'outline' }
    return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
  }

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleString('ar', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-gray-600">جاري تحميل بيانات المزاد...</p>
        </div>
      </div>
    )
  }

  if (!auction) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="p-8">
            <AlertCircle className="h-16 w-16 mx-auto mb-4 text-red-500" />
            <h2 className="text-xl font-bold mb-2">المزاد غير موجود</h2>
            <p className="text-gray-600">لم يتم العثور على المزاد المطلوب</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const isAuctionActive = auction.status === 'active'
  const currentHighestBid = auction.current_highest_bid || auction.starting_price
  const minNextBid = currentHighestBid + 1

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center space-x-3 space-x-reverse mb-4">
          <div className="bg-primary rounded-full p-3">
            <Gavel className="h-8 w-8 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">مزادي</h1>
            <p className="text-gray-600">منصة المزادات المباشرة</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Auction Info */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-xl">معلومات المزاد</CardTitle>
                <CardDescription>مزاد #{auction.id.slice(0, 8)}</CardDescription>
              </div>
              {getStatusBadge(auction.status)}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Current Bid */}
            <div className="text-center p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
              <div className="flex items-center justify-center space-x-2 space-x-reverse mb-2">
                <TrendingUp className="h-6 w-6 text-primary" />
                <span className="text-lg font-medium text-gray-700">أعلى مزايدة حالية</span>
              </div>
              <div className="text-4xl font-bold text-primary mb-2">
                {currentHighestBid} د.ك
              </div>
              {auction.current_highest_bid && (
                <p className="text-sm text-gray-600">
                  زيادة عن سعر البداية: +{(auction.current_highest_bid - auction.starting_price).toFixed(2)} د.ك
                </p>
              )}
            </div>

            {/* Auction Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-center space-x-1 space-x-reverse mb-2">
                  <DollarSign className="h-5 w-5 text-gray-600" />
                  <span className="text-sm text-gray-600">سعر البداية</span>
                </div>
                <div className="text-xl font-bold text-gray-900">
                  {auction.starting_price} د.ك
                </div>
              </div>
              
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-center space-x-1 space-x-reverse mb-2">
                  <Users className="h-5 w-5 text-gray-600" />
                  <span className="text-sm text-gray-600">عدد المزايدات</span>
                </div>
                <div className="text-xl font-bold text-gray-900">
                  {auction.total_bids}
                </div>
              </div>
            </div>

            {/* Timing */}
            {auction.start_time && (
              <div className="flex items-center space-x-2 space-x-reverse text-sm text-gray-600">
                <Clock className="h-4 w-4" />
                <span>بدء المزاد: {formatTime(auction.start_time)}</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Bidding Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 space-x-reverse">
              <Gavel className="h-5 w-5" />
              <span>شارك في المزايدة</span>
            </CardTitle>
            <CardDescription>
              {isAuctionActive 
                ? `الحد الأدنى للمزايدة التالية: ${minNextBid} د.ك`
                : 'هذا المزاد غير نشط حالياً'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isAuctionActive ? (
              <form onSubmit={handleSubmitBid} className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                
                {success && (
                  <Alert className="border-green-200 bg-green-50">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800">{success}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="bidder_name" className="flex items-center space-x-2 space-x-reverse">
                    <User className="h-4 w-4" />
                    <span>الاسم الكامل</span>
                  </Label>
                  <Input
                    id="bidder_name"
                    name="bidder_name"
                    type="text"
                    value={bidForm.bidder_name}
                    onChange={handleInputChange}
                    required
                    disabled={submitting}
                    className="text-right"
                    dir="rtl"
                    placeholder="أدخل اسمك الكامل"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bidder_phone" className="flex items-center space-x-2 space-x-reverse">
                    <Phone className="h-4 w-4" />
                    <span>رقم الهاتف</span>
                  </Label>
                  <Input
                    id="bidder_phone"
                    name="bidder_phone"
                    type="tel"
                    value={bidForm.bidder_phone}
                    onChange={handleInputChange}
                    required
                    disabled={submitting}
                    className="text-right"
                    dir="rtl"
                    placeholder="مثال: 99887766"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bid_amount" className="flex items-center space-x-2 space-x-reverse">
                    <DollarSign className="h-4 w-4" />
                    <span>مبلغ المزايدة (د.ك)</span>
                  </Label>
                  <Input
                    id="bid_amount"
                    name="bid_amount"
                    type="number"
                    step="0.01"
                    min={minNextBid}
                    value={bidForm.bid_amount}
                    onChange={handleInputChange}
                    required
                    disabled={submitting}
                    className="text-right"
                    dir="rtl"
                    placeholder={`الحد الأدنى: ${minNextBid}`}
                  />
                </div>

                <Button type="submit" className="w-full" disabled={submitting} size="lg">
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      جاري تسجيل المزايدة...
                    </>
                  ) : (
                    <>
                      <Gavel className="mr-2 h-4 w-4" />
                      تسجيل المزايدة
                    </>
                  )}
                </Button>
              </form>
            ) : (
              <div className="text-center py-8">
                <AlertCircle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">المزاد غير نشط</h3>
                <p className="text-gray-600">
                  {auction.status === 'ended' 
                    ? 'انتهى هذا المزاد' 
                    : 'لم يبدأ هذا المزاد بعد'
                  }
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Bids */}
      {bids.length > 0 && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 space-x-reverse">
              <Users className="h-5 w-5" />
              <span>المزايدات الأخيرة ({bids.length})</span>
            </CardTitle>
            <CardDescription>
              آخر المزايدات المسجلة في هذا المزاد
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {bids.map((bid, index) => (
                <div key={bid.id}>
                  <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3 space-x-reverse">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        index === 0 ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-200 text-gray-600'
                      }`}>
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{bid.bidder_name}</p>
                        <p className="text-sm text-gray-600">{bid.bidder_phone}</p>
                      </div>
                    </div>
                    <div className="text-left">
                      <div className="flex items-center space-x-1 space-x-reverse">
                        <span className="text-xl font-bold text-primary">{bid.bid_amount} د.ك</span>
                        {index === 0 && (
                          <Badge variant="default" className="text-xs">الأعلى</Badge>
                        )}
                      </div>
                      <p className="text-xs text-gray-500">
                        {formatTime(bid.bid_time)}
                      </p>
                    </div>
                  </div>
                  {index < bids.length - 1 && <Separator className="my-2" />}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

