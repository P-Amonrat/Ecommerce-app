import React from 'react'
import { ProductItem } from '../types/productType';
import { productsList } from '../mockup/products';

interface ProductsProps {
  productsList: typeof productsList;
}

const Products: React.FC<ProductsProps> = ({ productsList }) => {


  return (
    <div className='mt-8 pt-4 border-gray-300 border p-8 rounded'>
      <h2 className='text-2xl font-bold mt-4'>Products</h2>
      <div className='grid grid-cols-3 gap-4 mt-4'>
        {productsList.map((product: ProductItem) => (
          <div key={product.id} className='p-4 border border-gray-300 rounded'>
            <h3 className='text-xl font-semibold mb-2'>{product.name}</h3>
            <p className='text-gray-500'>{product.category}</p>
            <p className='text-gray-500'>{product.price} THB</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Products