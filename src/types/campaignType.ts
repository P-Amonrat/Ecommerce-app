export interface DiscountTotal {
  coupon: {
    type: string
    amount: number
  }
  onTop: {
    type: string
    category: string
    amount: number
  }
  seasonal: {
    type: string
    everyAmount: number
    discountAmount: number
  }
}


export interface CampaignTypeItem {
  id: number
  name: string
  type: {
    id: number
    name: string
    parameter?: string
    unit?: string
    category?: string[]
  }[]
}