const API_BASE_URL = 'http://localhost:5001/api'

class BiddingApiClient {
  constructor() {
    this.baseURL = API_BASE_URL
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`
    const config = {
      headers: {
        'Content-Type': 'application/json'
      },
      ...options
    }

    try {
      const response = await fetch(url, config)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'حدث خطأ في الطلب')
      }

      return data
    } catch (error) {
      console.error('API Error:', error)
      throw error
    }
  }

  // Get auction details
  async getAuction(auctionId) {
    return this.request(`/auctions/${auctionId}`)
  }

  // Place a bid
  async placeBid(auctionId, bidData) {
    return this.request(`/auctions/${auctionId}/bid`, {
      method: 'POST',
      body: JSON.stringify(bidData)
    })
  }

  // Get auction bids (for real-time updates)
  async getAuctionBids(auctionId) {
    return this.request(`/auctions/${auctionId}/bids`)
  }
}

export const biddingApi = new BiddingApiClient()
export default biddingApi

