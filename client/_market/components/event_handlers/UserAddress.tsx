// components/UserAddress.tsx
"use client";
import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { MapPin, Loader2, AlertCircle } from "lucide-react";
import { fetchAddress, fetchByIP } from "@/_market/lib/client-actions";

const UserAddress: React.FC = () => {
  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(
    null
  );
  const [useIP, setUseIP] = useState(false);

  useEffect(() => {
    if (!("geolocation" in navigator)) {
      setUseIP(true);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        setCoords({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
      (err) => {
        console.warn("Geolocation denied/fail:", err);
        setUseIP(true);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  const {
    data: gpsData,
    isError: gpsError,
    isLoading: gpsLoading,
    refetch: refetchGps,
  } = useQuery({
    queryKey: ["address", coords?.lat, coords?.lon],
    queryFn: () => fetchAddress(coords!.lat, coords!.lon),
    enabled: !!coords && !useIP,
    staleTime: 1000 * 60 * 60,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  const {
    data: ipData,
    isError: ipError,
    isLoading: ipLoading,
    refetch: refetchIp,
  } = useQuery({
    queryKey: ["ipLocation"],
    queryFn: fetchByIP,
    enabled: useIP,
    staleTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  const loading = gpsLoading || ipLoading;
  const error = gpsError || ipError;

  let address = null;

  if (gpsData?.display_name) address = gpsData.display_name;
  else if (ipData) {
    address = [ipData.city, ipData.region, ipData.country_name]
      .filter(Boolean)
      .join(", ");
  }

  return (
    <div>
      {loading ? (
        <div className="p-2 flex items-center gap-2">
          <Loader2 className="size-5 text-neutral-700 animate-spin" />
          <p className="text-neutral-700 font-medium animate-pulse">
            Detecting your location...
          </p>
        </div>
      ) : error ? (
        <div className="p-2 rounded-md bg-red-50 text-red-700 flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          <div className="flex items-center gap-x-1">
            <p className="font-medium">{`Can't fetch location`},</p>
            <div className="text-xs flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  if (!useIP) refetchGps();
                  else refetchIp();
                }}
                className="underline hover:text-red-500 transition cursor-pointer"
              >
                Retry
              </button>
              <button
                type="button"
                onClick={() => {
                  setUseIP(true);
                  refetchIp();
                }}
                className="underline hover:text-red-500 transition cursor-pointer"
              >
                Use IP instead
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button
          type="button"
          className="flex items-center justify-center gap-x-2 p-2 bg-white cursor-pointer hover:bg-gray-100/75 rounded-lg transition-all"
        >
          <MapPin className="w-5 h-5 text-neutral-700" />
          <span className="text-neutral-900 text-sm font-medium max-w-sm truncate">
            {address ?? "Unknown location"}
          </span>
        </button>
      )}
    </div>
  );
};

export default UserAddress;
