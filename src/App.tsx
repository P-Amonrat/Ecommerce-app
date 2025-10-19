import React from 'react';
import Campaign from './components/Campaign';
import Products from './components/Products';
import { productsList } from './mockup/products';

function App() {

  return (
    <div className='p-5 0 min-h-screen'>
      <header className='flex justify-between items-center p-5 bg-gray-100'>
        <h1 className='text-3xl font-bold'>Ecommerce</h1>
      </header>
      <Products productsList={productsList} />
      <Campaign productsList={productsList} />
    </div>
  );
}

export default App;
