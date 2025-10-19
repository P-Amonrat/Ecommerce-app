export const campaignData = [
  {
    id: 1,
    name: 'Coupon',
    type: [
      { id: 1, name: 'Fixed Amount Discount', parameter: "Amount", unit: "THB" },
      { id: 2, name: 'Percentage Discount', parameter: "Percentage", unit: "%" },
    ]
  },
  {
    id: 2,
    name: 'On Top',
    type: [
      { id: 1, name: 'Discount by points', parameter: "Points", unit: "Points" },
      {
        id: 2, name: 'Percentage discount by item category', parameter: "Percentage", unit: "%",
        category: ["Electronics", "Accessories", "Clothing"]
      }
    ]
  },
  {
    id: 3,
    name: 'Seasonal',
    type: [
      { id: 1, name: 'Special campaigns', parameter: "Seasonal", unit: "THB" },
    ]
  }
];

export enum CampaignTypes {
  coupon = "Coupon",
  onTop = "On Top",
  seasonal = "Seasonal"
}

export enum DiscountTypes {
  fixed = 1,
  percent = 2,
  points = 3
}