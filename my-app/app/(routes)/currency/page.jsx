"use client";

import CurrencySelector from '@/components/currency';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import React from 'react';

const Currency = () => {
  const [selectedCurrency, setSelectedCurrency] = React.useState(false);

  const handleSelect = (currency) => {
    console.log("Selected currency:", currency);
    setSelectedCurrency(true);
    localStorage.setItem("selectedCurrency", JSON.stringify(currency.symbol));
  }

  return (
    <div className='h-screen w-screen flex justify-center items-center font-sans'>
      <div className='flex flex-col items-center gap-3 w-2/4'>
        <CurrencySelector onSelect={(currency) => handleSelect(currency)} />
        <Button className="w-1/5" disabled={!selectedCurrency}>
          <Link href="/dashboard">
            Continue
          </Link>
        </Button>
      </div>
    </div>
  )
}

export default Currency