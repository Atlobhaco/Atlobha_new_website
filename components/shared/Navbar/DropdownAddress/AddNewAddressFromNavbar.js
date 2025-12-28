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
import { toast } from "react-toastify";

const AddNewAddressFromNavbar = forwardRef(
  ({ setCanAddAddress, setOpenAddNewAddress }, ref) => {
    // called from the parent component
    const childFunction = () => {
      const regex = /^[A-Z]{4}\d{4}$/;
      if (!regex.test(nationalAddressCode)) {
        return toast.error(`${t.nationalCodeError}`);
      }
      if (
        !nationalAddressCode ||
        nationalAddressCode?.length < 8 ||
        (addressNameOrCustom?.type === "custom" &&
          (addressNameOrCustom?.cutomName?.length < 3 ||
            !addressNameOrCustom?.cutomName)) ||
        !lngLatLocation?.lng ||
        !locationInfo
      ) {
        toast.error(`${t.common.add} ${t.addressDetails}`);
      } else {
        callAddNewAddress();
      }
    };

    // function can used from parent  to clear the inputs
    const emptyFields = () => {
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
      setNationalAddressCode("");
    };

    // Expose the function to the parent using useImperativeHandle
    useImperativeHandle(ref, () => ({
      triggerChildFunction: childFunction,
      triggerEmptyFields: emptyFields,
    }));

    const { user } = useAuth();
    const [location, setLocation] = useState(null);
    const router = useRouter();
    const dispatch = useDispatch();
    const { t } = useLocalization();
    const { isMobile } = useScreenSize();

    const [locationInfo, setLocationInfo] = useState(null);
    const [nationalAddressCode, setNationalAddressCode] = useState(null);
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
      } catch (err) {}
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
        name:
          addressNameOrCustom?.type === "custom"
            ? addressNameOrCustom?.cutomName
            : addressNameOrCustom?.type,
        ...lngLatLocation,
        address: `${locationInfo?.formattedAddress} ${locationInfo?.route}`,
        national_address_code: nationalAddressCode,
      },
      callUserAddresses,
      redirect: () => {
        setOpenAddNewAddress(false);
        document?.getElementById("openAfterAddNewAddress")?.click();
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
        setNationalAddressCode("");
      },
    });

    //   check can click save or no
    useEffect(() => {
      if (
        !nationalAddressCode ||
        nationalAddressCode?.length < 8 ||
        (addressNameOrCustom?.type === "custom" &&
          (addressNameOrCustom?.cutomName?.length < 3 ||
            !addressNameOrCustom?.cutomName)) ||
        !lngLatLocation?.lng ||
        !locationInfo
      ) {
        setCanAddAddress(true);
      } else {
        setCanAddAddress(false);
      }
    }, [nationalAddressCode, addressNameOrCustom, lngLatLocation, locationInfo]);

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
          <div className="col-md-4 px-0">
            <AddressDetails
              locationInfo={locationInfo}
              setAddressNameOrCustom={setAddressNameOrCustom}
              addressNameOrCustom={addressNameOrCustom}
              setNationalAddressCode={setNationalAddressCode}
              nationalAddressCode={nationalAddressCode}
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
