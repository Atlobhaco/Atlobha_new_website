import BreadCrumb from "@/components/BreadCrumb";
import React, { useState } from "react";
import GoogleMapComponent from "@/components/GoogleMap";
import AddressDetails from "@/components/userProfile/myAddresses/addressDetails/addressDetails";
import useScreenSize from "@/constants/screenSize/useScreenSize";
import { addAddressQuery } from "@/config/network/Shared/SetDataHelper";
import { useAuth } from "@/config/providers/AuthProvider";
import { useDispatch } from "react-redux";
import { usersAddressesQuery } from "@/config/network/Shared/GetDataHelper";
import {
  setAllAddresses,
  setDefaultAddress,
} from "@/redux/reducers/selectedAddressReducer";
import { useRouter } from "next/router";
import useLocalization from "@/config/hooks/useLocalization";

function AddNewAddressProfile() {
  const { user } = useAuth();
  const router = useRouter();
  const dispatch = useDispatch();
  const { t } = useLocalization();
  const { isMobile } = useScreenSize();

  const [lngLatLocation, setLngLatLocation] = useState(null);
  const [locationInfo, setLocationInfo] = useState(null); // State to store detailed address info
  const [addressNameOrCustom, setAddressNameOrCustom] = useState({
    type: "Home",
    cutomName: "",
  });
  const [manualAddress, setManualAddress] = useState(null);

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
    redirect: () => router.push("/userProfile/myAddresses"),
    t,
  });

  return (
    <div className="container-fluid pt-3">
      <div className="row mb-2">
        <BreadCrumb />
      </div>
      <div className="row mb-2">
        <div className={`col-md-8 col-12 ${isMobile ? "mb-3" : "mb-0"} `}>
          <GoogleMapComponent
            lngLatLocation={lngLatLocation}
            setLngLatLocation={setLngLatLocation}
            setLocationInfo={setLocationInfo}
          />
        </div>
        <div className="col-md-4 col-12">
          <AddressDetails
            locationInfo={locationInfo}
            setAddressNameOrCustom={setAddressNameOrCustom}
            addressNameOrCustom={addressNameOrCustom}
            setManualAddress={setManualAddress}
            manualAddress={manualAddress}
            lngLatLocation={lngLatLocation}
            callAddNewAddress={callAddNewAddress}
          />
        </div>
      </div>
    </div>
  );
}

export default AddNewAddressProfile;
