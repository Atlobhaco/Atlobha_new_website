import GoogleMapComponent from "@/components/GoogleMap";
import AddressDetails from "@/components/userProfile/myAddresses/addressDetails/addressDetails";
import { usersAddressesQuery } from "@/config/network/Shared/GetDataHelper";
import { addAddressQuery } from "@/config/network/Shared/SetDataHelper";
import { useAuth } from "@/config/providers/AuthProvider";
import useScreenSize from "@/constants/screenSize/useScreenSize";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import {
  setAllAddresses,
  setDefaultAddress,
} from "@/redux/reducers/selectedAddressReducer";

import React, {
  useImperativeHandle,
  forwardRef,
  useEffect,
  useState,
} from "react";
import useLocalization from "@/config/hooks/useLocalization";
import { getUserCurrentLocation } from "@/constants/helpers";

const AddNewAddressFromNavbar = forwardRef(
  ({ setCanAddAddress, setOpenAddNewAddress }, ref) => {
    // called from the parent component
    const childFunction = () => {
      callAddNewAddress();
    };

    // Expose the function to the parent using useImperativeHandle
    useImperativeHandle(ref, () => ({
      triggerChildFunction: childFunction,
    }));

    const { user } = useAuth();
    const [location, setLocation] = useState(null);
    const router = useRouter();
    const dispatch = useDispatch();
    const { t } = useLocalization();
    const { isMobile } = useScreenSize();

    const [locationInfo, setLocationInfo] = useState(null);
    const [manualAddress, setManualAddress] = useState(null);
    const [lngLatLocation, setLngLatLocation] = useState(null);
    const [addressNameOrCustom, setAddressNameOrCustom] = useState({
      type: "Home",
      cutomName: "",
    });

    // get user current location every render
    useEffect(() => {
      handleGetLocation();
    });

    const handleGetLocation = async () => {
      try {
        const currentLocation = await getUserCurrentLocation();
        setLocation(currentLocation);
      } catch (err) {
        console.log(err);
      }
    };

    const { refetch: callUserAddresses } = usersAddressesQuery({
      setAllAddresses,
      user,
      dispatch,
      setDefaultAddress,
    });

    const { refetch: callAddNewAddress } = addAddressQuery({
      user,
      dispatch,
      body: {
        name: addressNameOrCustom?.cutomName || addressNameOrCustom?.type,
        ...lngLatLocation,
        address: `${locationInfo?.formattedAddress} ${locationInfo?.route}`,
        manual_address: manualAddress,
      },
      callUserAddresses,
      redirect: () => {
        setOpenAddNewAddress(false);
        document.getElementById("openAfterAddNewAddress")?.click();
      },
      t,
      returnDefaultValues: () => {
        setLocationInfo(null);
        setLngLatLocation(
          location || {
            lat: 24.7136, // Latitude of Riyadh
            lng: 46.6753, // Longitude of Riyadh
          }
        );
        setAddressNameOrCustom({
          type: "Home",
          cutomName: "",
        });
        setManualAddress("");
      },
    });

    //   check can click save or no
    useEffect(() => {
      if (
        !manualAddress ||
        (addressNameOrCustom?.type === "custom" &&
          addressNameOrCustom?.cutomName?.length < 3) ||
        !lngLatLocation?.lng ||
        !locationInfo
      ) {
        setCanAddAddress(true);
      } else {
        setCanAddAddress(false);
      }
    }, [manualAddress, addressNameOrCustom, lngLatLocation, locationInfo]);

    return (
      <div className="container">
        <div className="row">
          <div className={`col-md-8 col-12 ${isMobile ? "mb-3" : "mb-0"} `}>
            <GoogleMapComponent
              lngLatLocation={lngLatLocation}
              setLngLatLocation={setLngLatLocation}
              setLocationInfo={setLocationInfo}
              customHeight="400px"
            />
          </div>
          <div className="col-md-4">
            <AddressDetails
              locationInfo={locationInfo}
              setAddressNameOrCustom={setAddressNameOrCustom}
              addressNameOrCustom={addressNameOrCustom}
              setManualAddress={setManualAddress}
              manualAddress={manualAddress}
              lngLatLocation={lngLatLocation}
              callAddNewAddress={() => {}}
              hideSaveBtn={true}
            />
          </div>
        </div>
      </div>
    );
  }
);

export default AddNewAddressFromNavbar;
