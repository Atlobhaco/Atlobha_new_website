import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  useMemo,
} from "react";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import {
  GoogleMap,
  LoadScriptNext,
  Marker,
  Autocomplete,
} from "@react-google-maps/api";
import useLocalization from "@/config/hooks/useLocalization";
import Image from "next/image";
import useScreenSize from "@/constants/screenSize/useScreenSize";

const center = {
  lat: 24.7136, // Latitude of Riyadh
  lng: 46.6753, // Longitude of Riyadh
};

const customIcon = {
  url: "/imgs/google-marker.svg", // Red marker icon URL
  scaledSize: { width: 35, height: 55 }, // Scale the icon
};

const GoogleMapComponent = React.memo(
  ({
    lngLatLocation,
    setLngLatLocation,
    setLocationInfo,
    idAddress = false,
    customHeight = "650px",
  }) => {
    const mapRef = useRef(null);
    const { isMobile } = useScreenSize();
    const [map, setMap] = useState(null);
    const autocompleteRef = useRef(null);
    const { t, locale } = useLocalization();

    // Memoize container style based on screen size
    const containerStyle = useMemo(
      () => ({
        width: "100%",
        height: isMobile ? "450px" : customHeight,
      }),
      [isMobile, customHeight]
    );

    // Memoize the button style to avoid recalculation
    const buttonStyle = useMemo(
      () => ({
        position: "absolute",
        bottom: "15px",
        right: "10px",
        padding: isMobile ? "8px" : "10px",
        border: "1px solid #B7B7B5",
        borderRadius: "10px",
        background: "#FBFBFB",
        boxShadow: "10px 1px 2px 0px rgba(18, 26, 43, 0.05)",
      }),
      [isMobile]
    );

    //   auto detect user location  when map opened
    const onLoadMap = useCallback((map) => {
      mapRef.current = map;
      setMap(map);
      if (!idAddress) {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const userLocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
              };
              setLngLatLocation(userLocation);
              fetchLocationDetails(userLocation); // Fetch address details
              if (map) {
                map.panTo(userLocation);
                map.setZoom(17);
              }
            },
            () => {
              setLngLatLocation(center);
              fetchLocationDetails(center); // Fetch address details
            }
          );
        } else {
          alert("Geolocation is not supported by this browser.");
        }
      } else {
        setLngLatLocation(lngLatLocation);
        fetchLocationDetails(lngLatLocation || { lat: "", lng: "" });
      }
    }, []);

    useEffect(() => {
      if (map && lngLatLocation) {
        fetchLocationDetails(lngLatLocation);
        map?.panTo(lngLatLocation); // Center the map to the updated location
        map?.setZoom(17); // Optional: zoom in
      }
    }, [lngLatLocation, map]);

    const handleLocateMe = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const userLocation = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };

            fetchLocationDetails(userLocation); // Fetch address details
            setLngLatLocation(userLocation);
            if (map) {
              map.panTo(userLocation);
              map.setZoom(17);
            }
          },
          (error) => {
            if (error.code === error.PERMISSION_DENIED) {
              alert(
                "Please enable your location services for better accuracy."
              );
            } else {
              //   console.error("Error getting the location", error);
            }
          },
          { enableHighAccuracy: true }
        );
      } else {
        alert("Geolocation is not supported by your browser.");
      }
    };

    const handleMapClick = (event) => {
      const clickedLocation = {
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
      };
      fetchLocationDetails(clickedLocation); // Fetch address details
      setLngLatLocation(clickedLocation);
    };

    const handleMarkerDragEnd = (event) => {
      const newPosition = {
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
      };
      fetchLocationDetails(newPosition); // Fetch address details
      setLngLatLocation(newPosition);
    };

    const handlePlaceChanged = () => {
      const place = autocompleteRef.current.getPlace();
      if (place && place.geometry) {
        const location = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        };
        fetchLocationDetails(location); // Fetch address details
        setLngLatLocation(location);
        if (map) {
          map.panTo(location);
          map.setZoom(17);
        }
      } else {
        // console.error("Place not found. Please try again.");
      }
    };

    const fetchLocationDetails = async (location) => {
      const { lat, lng } = location;
      try {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
        );
        const data = await response.json();

        if (data.status === "OK") {
          const addressComponents = data.results[0]?.address_components || [];
          const formattedAddress =
            data.results[0]?.formatted_address || "Unknown location";
          const details = {
            formattedAddress,
            streetNumber: getAddressComponent(
              addressComponents,
              "street_number"
            ),
            route: getAddressComponent(addressComponents, "route"),
            city: getAddressComponent(addressComponents, "locality"),
            country: getAddressComponent(addressComponents, "country"),
          };

          setLocationInfo(details); // Save details in state
        } else {
          alert("Failed to fetch location details.");
        }
      } catch (error) {
        // console.error("Error fetching location details:", error);
        alert("Error fetching location details. Please try again.");
      }
    };

    const getAddressComponent = (components, type) => {
      const component = components.find((c) => c.types.includes(type));
      return component ? component.long_name : null;
    };

    return (
      <div style={{ position: "relative" }}>
        <LoadScriptNext
          googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
          libraries={["places"]} // Ensure "places" library is loaded
        >
          {/* Autocomplete Search Input */}
          <Autocomplete
            onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)}
            onPlaceChanged={handlePlaceChanged}
          >
            <div
              style={{
                position: "absolute",
                top: "10px",
                zIndex: "1",
                width: "100%",
              }}
            >
              <input
                type="text"
                placeholder={t.search}
                style={{
                  background: "white",
                  color: "black",
                  width: "90%",
                  height: "44px",
                  padding: "0 35px",
                  marginBottom: "10px",
                  borderRadius: "8px",
                  outline: "none",
                  position: "absolute",
                  ...(locale === "ar"
                    ? { left: "10%", right: "4%" }
                    : { right: "5%" }),
                  border: "1px solid #D1D5DB",
                  boxShadow: "0px 1px 2px 0px rgba(18, 26, 43, 0.05)",
                }}
              />
              <Image
                src="/icons/search-yellow.svg"
                width={isMobile ? 20 : 24}
                height={isMobile ? 20 : 24}
                alt="search icon"
                style={{
                  position: "absolute",
                  right: `${isMobile ? "7%" : "5.5%"}`,
                  ...(locale !== "ar"
                    ? { left: isMobile ? "7%" : "5.5%" }
                    : { right: isMobile ? "7%" : "5.5%" }),
                  top: `${isMobile ? "10px" : "8px"}`,
                }}
              />
            </div>
          </Autocomplete>

          <GoogleMap
            mapContainerStyle={containerStyle}
            center={lngLatLocation || center}
            zoom={10}
            onLoad={onLoadMap}
            onClick={handleMapClick}
            options={{
              disableDefaultUI: true,
              zoomControl: false,
              gestureHandling: "greedy",
              rotateControl: true,
              clickableIcons: true,
            }}
          >
            {lngLatLocation && (
              <>
                <Marker
                  key={`${lngLatLocation?.lat}-${lngLatLocation?.lng}`}
                  draggable={true}
                  onDragEnd={handleMarkerDragEnd}
                  position={lngLatLocation}
                  icon={customIcon} // Apply custom icon to the draggable marker
                />
              </>
            )}
          </GoogleMap>
        </LoadScriptNext>

        {/* Locate Me Button */}
        <button onClick={handleLocateMe} style={buttonStyle}>
          <MyLocationIcon
            style={{
              width: isMobile ? "20px" : "30px",
              height: isMobile ? "20px" : "30px",
            }}
          />
        </button>
      </div>
    );
  }
);

export default GoogleMapComponent;
