'use client'

import FoodList from '../components/FoodList'
import { useState } from 'react'

export default function Home() {
  const [filteredFoodItems, setFilteredFoodItems] = useState([])

  // Mock function to replace the mobile ad functionality
  const showInterstitialAd = () => {
    return Promise.resolve()
  }

  return (
    <div className="container">
      <FoodList
        filteredFoodItems={filteredFoodItems} 
        setFilteredFoodItems={setFilteredFoodItems}
        showInterstitialAd={showInterstitialAd}
      />
    </div>
  )
}
