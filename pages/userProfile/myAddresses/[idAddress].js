import BreadCrumb from "@/components/BreadCrumb";
import GoogleMapComponent from "@/components/GoogleMap";
import AddressDetails from "@/components/userProfile/myAddresses/addressDetails/addressDetails";
import useLocalization from "@/config/hooks/useLocalization";
import { usersAddressesQuery } from "@/config/network/Shared/GetDataHelper";
import { addAddressQuery } from "@/config/network/Shared/SetDataHelper";
import { useAuth } from "@/config/providers/AuthProvider";
import useScreenSize from "@/constants/screenSize/useScreenSize";
import {
  setAllAddresses,
  setDefaultAddress,
} from "@/redux/reducers/selectedAddressReducer";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

function EditAddressProfile() {
  const { user } = useAuth();
  const router = useRouter();
  const dispatch = useDispatch();
  const { idAddress } = router.query;
  const { isMobile } = useScreenSize();
  const { t, locale } = useLocalization();

  const [lngLatLocation, setLngLatLocation] = useState(null);
  const [locationInfo, setLocationInfo] = useState(null); // State to store detailed address info
  const [addressNameOrCustom, setAddressNameOrCustom] = useState({
    type: "Home",
    cutomName: "",
  });
  const [manualAddress, setManualAddress] = useState(null);
  const { allAddresses } = useSelector((state) => state.selectedAddress);

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
      name: addressNameOrCustom?.cutomName,
      ...lngLatLocation,
      address: `${locationInfo?.formattedAddress} ${locationInfo?.route}`,
      manual_address: manualAddress,
    },
    callUserAddresses,
    redirect: () => router.push("/userProfile/myAddresses"),
    t,
  });

  useEffect(() => {
    if (idAddress) {
      const addressToEdit = allAddresses?.find(
        (car) => +car?.id === +idAddress
      );
      setLngLatLocation({
        lat: addressToEdit?.lat,
        lng: addressToEdit?.lng,
      });
      setLocationInfo({
        country: addressToEdit?.city?.country?.name,
        route:
          locale === "ar"
            ? addressToEdit?.city?.name_ar
            : addressToEdit?.city?.name_en,
        formattedAddress: addressToEdit?.address,
      });
      //   no data returnde for check it is home or not
      setAddressNameOrCustom({
        type:
          addressToEdit?.name !== "Work" && addressToEdit?.name !== "Home"
            ? "custom"
            : addressToEdit?.name,
        cutomName:
          addressToEdit?.name !== "Work" && addressToEdit?.name !== "Home"
            ? ""
            : addressToEdit?.name,
      });
      setManualAddress(addressToEdit?.manual_address || "");
    }
  }, [idAddress]);

  return (
    <div className="container-fluid pt-3">
      <div className="row mb-2">
        <BreadCrumb />
      </div>
      {/* EditAddressProfile-{idAddress} */}
      <div className="row mb-2">
        <div className={`col-md-8 col-12 ${isMobile ? "mb-3" : "mb-0"} `}>
          <GoogleMapComponent
            lngLatLocation={lngLatLocation}
            setLngLatLocation={setLngLatLocation}
            setLocationInfo={setLocationInfo}
            idAddress={idAddress}
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

export default EditAddressProfile;
