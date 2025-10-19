import React from 'react'
import { campaignData, CampaignTypes, DiscountTypes } from '../mockup/campaign'
import { CampaignTypeItem, DiscountTotal } from '../types/campaignType';
import { productsList } from '../mockup/products';

interface CampaignProps {
  productsList: typeof productsList;
}

const Campaign: React.FC<CampaignProps> = ({ productsList }) => {
  const [selectedTypes, setSelectedTypes] = React.useState<Record<string, string>>({})
  const [discountTotal, setDiscountTotal] = React.useState<DiscountTotal>({
    coupon: {
      type: 'fixed',
      amount: 0
    },
    onTop: {
      type: 'fixed',
      category: 'Electronics',
      amount: 0
    },
    seasonal: {
      type: 'fixed',
      everyAmount: 0,
      discountAmount: 0,
    }
  })

  React.useEffect(() => {
    const initialSelected: Record<string, string> = {}
    campaignData.forEach(campaign => {
      if (campaign.type.length > 0) {
        initialSelected[campaign.id] = String(campaign.type[0].id)
      }
    })
    setSelectedTypes(initialSelected)
  }, [])

  const handleSelectChange = (campaignId: number, typeId: number) => {
    setSelectedTypes(prev => ({
      ...prev,
      [campaignId]: typeId,
    }))
  }

  const handleChangeCategory = (category: string) => {
    setDiscountTotal(prev => ({
      ...prev,
      onTop: {
        ...prev.onTop,
        category: category
      }
    }))
  }

  const handleInsertDiscount = (campaignName: string, typeId: number, value: number) => {

    setDiscountTotal(prev => {
      switch (campaignName) {
        case CampaignTypes.coupon:
          return {
            ...prev,
            coupon: {
              ...prev.coupon,
              type: typeId === DiscountTypes.fixed ? 'fixed' : 'percent',
              amount: value
            }
          }

        case CampaignTypes.onTop:
          return {
            ...prev,
            onTop: {
              ...prev.onTop,
              type: typeId === DiscountTypes.percent ? 'percent' : 'points',
              amount: value
            }
          }

        case CampaignTypes.seasonal:
          return {
            ...prev,
            seasonal: {
              ...prev.seasonal,
              type: 'seasonal',
              everyAmount: value,
            }
          }

        default:
          return prev
      }
    })
  }

  const handleDiscountOfSeasonal = (discountAmount: number) => {
    setDiscountTotal(prev => ({
      ...prev,
      seasonal: {
        ...prev.seasonal,
        discountAmount: discountAmount
      }
    }))
  }

  const calculateTotalDiscount = () => {
    let totalDiscount = 0;

    if (discountTotal.coupon.type === 'fixed') {
      totalDiscount += discountTotal.coupon.amount;
    } else if (discountTotal.coupon.type === 'percent') {
      const subtotal = productsList.reduce((acc, product) => acc + product.price, 0);
      totalDiscount += (subtotal * discountTotal.coupon.amount) / 100;
    }

    if (discountTotal.onTop.type === 'percent') {
      const categorySubtotal = productsList
        .filter(p => p.category === discountTotal.onTop.category)
        .reduce((acc, p) => acc + p.price, 0);
      totalDiscount += (categorySubtotal * discountTotal.onTop.amount) / 100;
    } else if (discountTotal.onTop.type === 'points') {
      const subtotal = productsList.reduce((acc, product) => acc + product.price, 0);
      const maxAllowed = subtotal * 0.2;
      const pointsDiscount = Math.min(discountTotal.onTop.amount, maxAllowed);
      totalDiscount += pointsDiscount;
    }

    if (discountTotal.seasonal.type === 'seasonal') {
      const subtotal = productsList.reduce((acc, product) => acc + product.price, 0);
      if (discountTotal.seasonal.everyAmount > 0) {
        const times = Math.floor(subtotal / discountTotal.seasonal.everyAmount);
        totalDiscount += times * discountTotal.seasonal.discountAmount;
      }
    }

    return totalDiscount;
  }

  return (
    <div className='mt-8 pt-4 border-gray-300 border p-8 rounded'>
      <h2 className='text-2xl font-bold mt-4'>Campaign</h2>

      {campaignData.map((campaign: CampaignTypeItem) => {
        const selectedId = selectedTypes[campaign.id]

        return (
          <div key={campaign.id} className='flex gap-5 mt-4 flex-wrap border-b border-gray-300 pb-4'>
            <div className="flex justify-center flex-col">
              <h3 className='text-l font-semibold mb-2'>{campaign.name}</h3>
              <select
                className='col-span-1 p-2 border border-gray-300 rounded mb-4'
                onChange={(e) => {
                  handleSelectChange(campaign.id, Number(e.target.value))
                  handleInsertDiscount(campaign.name, Number(e.target.value), 0)
                }}
                value={selectedId || ''}
              >
                {campaign.type.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              {campaign.type
                .filter((type) => type.id === Number(selectedId))
                .map((type) => (
                  <div key={type.id}>
                    {type.category && (
                      <>
                        <h4 className='text-l font-semibold mb-2'>Category</h4>
                        <select className='p-2 border border-gray-300 rounded mb-4' onChange={(e) => handleChangeCategory(e.target.value)}>
                          {type.category.map((cat) => (
                            <option key={cat} value={cat}>
                              {cat}
                            </option>
                          ))}
                        </select>
                      </>

                    )}
                  </div>
                ))}
            </div>

            <div>
              {campaign.type
                .filter((type) => type.id === Number(selectedId))
                .map((type) => (
                  <>
                    <div key={type.id}>
                      <h4 className='text-l font-semibold mb-2'>{type.parameter === "Seasonal" ? "Every" : type.parameter}</h4>
                      <div className='flex gap-5 items-center'>
                        <input
                          type={
                            ['Amount', 'Percentage', 'Points'].includes(type.parameter ?? '')
                              ? 'number'
                              : 'text'
                          }
                          placeholder={type.parameter === "Seasonal" ? "Amount" : type.parameter}
                          className='p-2 border border-gray-300 rounded mb-4'
                          onChange={(e) => handleInsertDiscount(campaign.name, type.id, Number(e.target.value))}
                        />
                        <p>{type.unit}</p>
                      </div>
                      {type.parameter === "Seasonal" && (
                        <>
                          <h4 className='text-l font-semibold mb-2'>Discount</h4>
                          <div className='flex gap-5 items-center'>
                            <input
                              type={
                                ['Amount', 'Percentage', 'Points'].includes(type.parameter ?? '')
                                  ? 'number'
                                  : 'text'
                              }
                              placeholder={"Amount"}
                              className='p-2 border border-gray-300 rounded mb-4'
                              onChange={(e) => handleDiscountOfSeasonal(Number(e.target.value))}
                            />
                            <p>{type.unit}</p>
                          </div>

                        </>
                      )}
                    </div>
                  </>

                ))}
            </div>
          </div>
        )
      })}

      <div className='mt-4'>
        <h3 className='text-l font-semibold mb-2'>Order</h3>
        <p className='text-l font-semibold mb-2'>Subtotal : {" "}
          <span className='text-red-500'>{productsList.reduce((acc, product) => acc + product.price, 0)} THB
          </span>
        </p>
        <p className='text-l font-semibold mb-2'>Discount : {" "}
          <span className='text-red-500'>{calculateTotalDiscount()} THB
          </span>
        </p>
        <p className='text-l font-semibold mb-2'>Total Amount: {" "}
          <span className='text-red-500'>{productsList.reduce((acc, product) => acc + product.price, 0) - calculateTotalDiscount()} THB
          </span>
        </p>
      </div>
    </div>
  )
}

export default Campaign
