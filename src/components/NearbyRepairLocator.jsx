import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Navigation, 
  Phone, 
  Star, 
  ShieldCheck, 
  ExternalLink, 
  Truck, 
  Compass, 
  CheckCircle2,
  RefreshCw,
  Map
} from 'lucide-react';
import { fetchNearbyShops, getCurrentPositionPromise } from '../services/locationService';

export default function NearbyRepairLocator({ category = 'phone' }) {
  const [activeFilter, setActiveFilter] = useState('rating');
  const [isLocating, setIsLocating] = useState(false);
  const [isLoadingShops, setIsLoadingShops] = useState(false);
  const [userLocation, setUserLocation] = useState({
    name: 'Indiranagar, Bengaluru',
    lat: 12.9784,
    lng: 77.6408,
    isGPS: false
  });
  const [shops, setShops] = useState([]);
  const [bookingToast, setBookingToast] = useState(null);

  const categoryQueryMap = {
    phone: 'best rated mobile phone smartphone repair shop',
    electronics: 'best rated electronics PCB motherboard repair shop',
    auto: 'best rated car bumper denting painting garage workshop',
    appliance: 'best rated washing machine appliance repair service',
    general: 'best rated hardware repair workshop'
  };

  const currentCategoryQuery = categoryQueryMap[category] || 'repair shop';

  const detectLiveLocation = async () => {
    setIsLocating(true);
    try {
      const pos = await getCurrentPositionPromise();
      let locationName = `GPS (${pos.lat.toFixed(3)}°, ${pos.lng.toFixed(3)}°)`;

      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${pos.lat}&lon=${pos.lng}`);
        if (res.ok) {
          const data = await res.json();
          const neighbourhood = data.address?.suburb || data.address?.neighbourhood || data.address?.residential || data.address?.subdistrict || 'Local Area';
          const city = data.address?.city || data.address?.town || data.address?.state_district || 'Bengaluru';
          locationName = `${neighbourhood}, ${city}`;
        }
      } catch (err) {
        console.warn('Reverse geocode error:', err);
      }

      const nextLocation = {
        name: locationName,
        lat: pos.lat,
        lng: pos.lng,
        isGPS: true
      };

      setUserLocation(nextLocation);
      return nextLocation;
    } catch (error) {
      console.warn('GPS location request declined or timed out:', error);
      return userLocation;
    } finally {
      setIsLocating(false);
    }
  };

  useEffect(() => {
    const loadNearby = async () => {
      setIsLoadingShops(true);
      try {
        const resolvedLocation = await detectLiveLocation();
        const results = await fetchNearbyShops(category, resolvedLocation || userLocation);

        let filtered = results;
        if (activeFilter === 'express') {
          filtered = [...results].sort((a, b) => (a.distanceKm || a.displayDistanceKm || 0) - (b.distanceKm || b.displayDistanceKm || 0));
        } else if (activeFilter === 'price') {
          filtered = [...results].sort((a, b) => a.priceEstimate - b.priceEstimate);
        } else if (activeFilter === 'rating') {
          filtered = [...results].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
        } else if (activeFilter === 'authorised') {
          filtered = [...results].filter((shop) => shop.isAuthorised);
        }

        setShops(filtered);
      } catch (error) {
        console.warn('Unable to load nearby shops:', error);
        setShops([]);
      } finally {
        setIsLoadingShops(false);
      }
    };

    loadNearby();
  }, [category, activeFilter]);

  const openGoogleMapsLiveSearch = () => {
    const query = encodeURIComponent(`${currentCategoryQuery} near ${userLocation.name}`);
    const mapsUrl = `https://www.google.com/maps/search/${query}/@${userLocation.lat},${userLocation.lng},14z`;
    window.open(mapsUrl, '_blank');
  };

  const handleBookPickup = (shopName) => {
    setBookingToast(`Doorstep Pickup requested for ${shopName}. A technician will contact you shortly.`);
    setTimeout(() => {
      setBookingToast(null);
    }, 5000);
  };

  const filterOptions = [
    { id: 'rating', label: 'Top Rated (4.8+)' },
    { id: 'price', label: 'Best Price Match' },
    { id: 'authorised', label: 'Authorised Centres' },
    { id: 'express', label: 'Express Service' },
    { id: 'all', label: 'All Nearby' }
  ];

  return (
    <div className="p-6 sm:p-8 rounded-xl border border-[#232B36] bg-[#121720] space-y-5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.03),0_8px_24px_rgba(0,0,0,0.4)] relative overflow-hidden">
      
      {/* Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-[#232B36]">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-[#55A477]" />
            <h3 className="text-base sm:text-lg font-bold text-[#F4F6F8] tracking-tight">
              Nearby Service Centers & Bench Pricing
            </h3>
          </div>
          <p className="text-xs text-[#A7B0BC] leading-relaxed max-w-xl">
            Location-based service center locator with verified local repair benchmarks.
          </p>
        </div>

        {/* Live GPS Bar & Google Maps Button */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Live Location Pill */}
          <div className="px-3 py-1.5 rounded-lg bg-[#0D1118] border border-[#232B36] text-xs text-[#A7B0BC] flex items-center space-x-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#55A477]"></span>
            <span>Location: <strong className="text-[#F4F6F8] font-mono">{userLocation.name}</strong></span>
            <button
              onClick={detectLiveLocation}
              disabled={isLocating}
              className="text-[#687382] hover:text-[#F4F6F8] transition-colors ml-1 p-0.5 cursor-pointer"
              title="Refresh GPS Location"
            >
              <RefreshCw className={`w-3 h-3 ${isLocating ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {/* Open Google Maps Live Button */}
          <button
            onClick={openGoogleMapsLiveSearch}
            className="px-3 py-1.5 rounded-lg border border-[#232B36] bg-[#161C25] hover:bg-[#1D2430] text-[#F4F6F8] font-medium text-xs transition-colors flex items-center space-x-1.5 cursor-pointer shadow-sm"
          >
            <Map className="w-3.5 h-3.5 text-[#7D91AA]" />
            <span>Open in Maps</span>
            <ExternalLink className="w-3 h-3 text-[#687382]" />
          </button>
        </div>
      </div>

      {/* Booking Toast Notification */}
      {bookingToast && (
        <div className="p-3 rounded-lg bg-[#55A477]/15 border border-[#55A477]/30 text-[#F4F6F8] text-xs font-medium flex items-center space-x-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-[#55A477] flex-shrink-0" />
          <span>{bookingToast}</span>
        </div>
      )}

      {/* Filter Segment Tabs */}
      <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 no-scrollbar">
        {filterOptions.map((opt) => (
          <button
            key={opt.id}
            onClick={() => setActiveFilter(opt.id)}
            className={`px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-colors border cursor-pointer ${
              activeFilter === opt.id
                ? 'bg-[#161C25] text-[#F4F6F8] border-[#232B36] font-semibold'
                : 'bg-[#0D1118] text-[#A7B0BC] border-[#232B36] hover:text-[#F4F6F8] hover:bg-[#161C25]'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Service Centre Cards Grid */}
      {isLoadingShops && (
        <div className="rounded-lg border border-[#232B36] bg-[#0D1118] px-4 py-3 text-xs text-[#A7B0BC]">
          Finding the nearest repair centers around your location...
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {shops.map((shop) => (
          <div
            key={shop.id}
            className="p-4 rounded-lg border border-[#232B36] bg-[#0D1118] hover:border-[#7D91AA]/40 transition-colors space-y-3 group flex flex-col justify-between"
          >
            <div className="space-y-2.5">
              {/* Header: Shop Name & Rating Badge */}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h4 className="font-semibold text-[#F4F6F8] text-sm">
                    {shop.name}
                  </h4>
                  <p className="text-[11px] text-[#687382] flex items-center space-x-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-[#7D91AA] flex-shrink-0" />
                    <span>{shop.locality} • {shop.displayDistanceKm ?? shop.distanceKm} km</span>
                  </p>
                </div>

                <div className="px-2 py-0.5 rounded bg-[#161C25] border border-[#232B36] text-[#A7B0BC] font-medium text-[11px] flex items-center space-x-1 flex-shrink-0">
                  <Star className="w-3 h-3 fill-[#B28A50] text-[#B28A50]" />
                  <span className="font-semibold text-[#F4F6F8]">{shop.rating}</span>
                  <span className="text-[10px] text-[#687382]">({shop.reviewsCount})</span>
                </div>
              </div>

              {/* Price & Turnaround Info */}
              <div className="p-2.5 rounded-md bg-[#161C25] border border-[#232B36] flex items-center justify-between gap-2 text-xs">
                <div>
                  <span className="text-[10px] text-[#687382] block">Est. Repair Cost</span>
                  <span className="text-sm font-bold text-[#F4F6F8] font-mono">
                    ₹{shop.priceEstimate.toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="text-right space-y-0.5">
                  <span className="px-1.5 py-0.5 rounded bg-[#0D1118] text-[#A7B0BC] text-[9px] font-medium border border-[#232B36] inline-block font-mono">
                    {shop.badge}
                  </span>
                  <span className="text-[10px] text-[#687382] block">
                    Turnaround: {shop.turnaround}
                  </span>
                </div>
              </div>

              {/* Address */}
              <p className="text-[11px] text-[#687382] leading-relaxed truncate">
                {shop.address}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#232B36] text-xs">
              <a
                href={`tel:${shop.phone}`}
                className="py-1.5 px-2 rounded-md bg-[#161C25] hover:bg-[#1D2430] text-[#A7B0BC] hover:text-[#F4F6F8] border border-[#232B36] transition-colors flex items-center justify-center space-x-1 text-center"
              >
                <Phone className="w-3 h-3 text-[#7D91AA]" />
                <span>Call</span>
              </a>

              <button
                onClick={() => handleBookPickup(shop.name)}
                className="py-1.5 px-2 rounded-md bg-[#161C25] hover:bg-[#1D2430] text-[#F4F6F8] font-medium border border-[#232B36] transition-colors flex items-center justify-center space-x-1 text-center cursor-pointer"
              >
                <Truck className="w-3 h-3 text-[#7D91AA]" />
                <span>Book</span>
              </button>

              <a
                href={`https://www.google.com/maps/search/${encodeURIComponent(`${currentCategoryQuery} near ${shop.locality} ${shop.city}`)}/@${userLocation.lat},${userLocation.lng},12z`}
                target="_blank"
                rel="noopener noreferrer"
                className="py-1.5 px-2 rounded-md bg-[#161C25] hover:bg-[#1D2430] text-[#A7B0BC] hover:text-[#F4F6F8] border border-[#232B36] transition-colors flex items-center justify-center space-x-1 text-center"
              >
                <ExternalLink className="w-3 h-3 text-[#7D91AA]" />
                <span>Directions</span>
              </a>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}
