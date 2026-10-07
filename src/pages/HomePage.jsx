import React from 'react';
import VendorStories from '../components/VendorStories';
import FeaturedDrops from '../components/FeaturedDrops';

export default function HomePage({ vendors, products, onSelectProduct, onSelectVendor, onBecomeVendor }) {
  return (
    <div className="space-y-4 pt-3">
      <VendorStories vendors={vendors} onSelectVendor={onSelectVendor} />
      <FeaturedDrops products={products} onSelectProduct={onSelectProduct} onBecomeVendor={onBecomeVendor} />
    </div>
  );
}
