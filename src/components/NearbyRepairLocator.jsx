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
import { getNearbyShops, getCurrentPositionPromise } from '../services/locationService';

export default function NearbyRepairLocator({ category = 'phone' }) {
  const [activeFilter, setActiveFilter] = useState('rating');
  const [isLocating, setIsLocating] = useState(false);
  const [userLocation, setUserLocation] = useState({
    name: 'Indiranagar, Bengaluru',
    lat: 12.9784,
    lng: 77.6408,
    isGPS: false
  });
  const [bookingToast, setBookingToast] = useState(null);

  const shops = getNearbyShops(category, activeFilter);

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

      setUserLocation({
        name: locationName,
        lat: pos.lat,
        lng: pos.lng,
        isGPS: true
      });
    } catch (error) {
      console.warn('GPS location request declined or timed out:', error);
    } finally {
      setIsLocating(false);
    }
  };

  useEffect(() => {
    detectLiveLocation();
  }, []);

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
    <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800 bg-slate-950/90 space-y-6 shadow-2xl relative overflow-hidden">
      
      {/* Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-800/80">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h3 className="text-xl font-bold text-white tracking-tight">
              Nearby Service Centres & Price Match
            </h3>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed max-w-xl">
            Live Google Maps location integration — Compare top rated local repair shops with affordable pricing.
          </p>
        </div>

        {/* Live GPS Bar & Google Maps Button */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Live Location Pill */}
          <div className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Live Location: <strong className="text-white font-mono">{userLocation.name}</strong></span>
            <button
              onClick={detectLiveLocation}
              disabled={isLocating}
              className="text-slate-400 hover:text-emerald-400 transition-colors ml-1 p-0.5"
              title="Refresh GPS Location"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {/* Open Google Maps Live Button */}
          <button
            onClick={openGoogleMapsLiveSearch}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs transition-all shadow-lg shadow-emerald-600/20 flex items-center space-x-2 border border-emerald-500/30"
          >
            <Map className="w-4 h-4 text-emerald-200" />
            <span>View Live on Google Maps</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Booking Toast Notification */}
      {bookingToast && (
        <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-200 text-xs font-medium flex items-center space-x-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{bookingToast}</span>
        </div>
      )}

      {/* Filter Segment Tabs */}
      <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 no-scrollbar">
        {filterOptions.map((opt) => (
          <button
            key={opt.id}
            onClick={() => setActiveFilter(opt.id)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
              activeFilter === opt.id
                ? 'bg-emerald-600/90 text-white border-emerald-500 shadow-md shadow-emerald-600/20'
                : 'bg-slate-900/90 text-slate-400 border-slate-800 hover:text-slate-200 hover:bg-slate-800/80'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Service Centre Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {shops.map((shop) => (
          <div
            key={shop.id}
            className="glass-panel p-5 rounded-2xl border border-slate-800/80 bg-slate-900/60 hover:bg-slate-900 hover:border-emerald-500/40 transition-all duration-200 space-y-4 shadow-lg group flex flex-col justify-between"
          >
            <div className="space-y-3">
              {/* Header: Shop Name & Rating Badge */}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h4 className="font-bold text-white text-base group-hover:text-emerald-300 transition-colors">
                    {shop.name}
                  </h4>
                  <p className="text-xs text-slate-400 flex items-center space-x-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                    <span>{shop.locality} • {shop.distanceKm} km away</span>
                  </p>
                </div>

                <div className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold text-xs flex items-center space-x-1 flex-shrink-0">
                  <Star className="w-3.5 h-3.5 fill-emerald-400 text-emerald-400" />
                  <span>{shop.rating}</span>
                  <span className="text-[10px] text-slate-400 font-normal">({shop.reviewsCount})</span>
                </div>
              </div>

              {/* Price & Turnaround Info */}
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 flex items-center justify-between gap-2 text-xs">
                <div>
                  <span className="text-[11px] text-slate-400 block">Est. Repair Cost</span>
                  <span className="text-base font-extrabold text-emerald-400 font-mono">
                    ₹{shop.priceEstimate.toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="text-right space-y-0.5">
                  <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 text-[10px] font-semibold border border-emerald-500/20 inline-block">
                    {shop.badge}
                  </span>
                  <span className="text-[11px] text-slate-400 block">
                    Turnaround: {shop.turnaround}
                  </span>
                </div>
              </div>

              {/* Address */}
              <p className="text-xs text-slate-400 leading-relaxed truncate">
                {shop.address}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800/60 text-xs font-semibold">
              <a
                href={`tel:${shop.phone}`}
                className="py-2 px-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/80 transition-colors flex items-center justify-center space-x-1 text-center"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <span>Call</span>
              </a>

              <button
                onClick={() => handleBookPickup(shop.name)}
                className="py-2 px-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-colors flex items-center justify-center space-x-1 text-center shadow-md shadow-emerald-600/20"
              >
                <Truck className="w-3.5 h-3.5" />
                <span>Book Pickup</span>
              </button>

              <a
                href={`https://www.google.com/maps/search/${encodeURIComponent(`${currentCategoryQuery} ${shop.name} ${shop.address}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2 px-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/80 transition-colors flex items-center justify-center space-x-1 text-center"
              >
                <ExternalLink className="w-3.5 h-3.5 text-blue-400" />
                <span>Directions</span>
              </a>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}


