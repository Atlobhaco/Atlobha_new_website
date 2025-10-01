import { ADDRESSES, USERS, VEHICLES } from "@/config/endPoints/endPoints";
import useCustomQuery from "../Apiconfig";
import { toast } from "react-toastify";

// set default car for user
export function userDefaultCar({
  user,
  dispatch,
  setSelectedCar = () => ({ type: "NO_ACTION" }),
  selectedCar,
  callUserVehicles = () => {},
}) {
  // problem in endpoint for update default car for user
  return useCustomQuery({
    name: "setDefaultCar",
    url: `${USERS}/${user?.data?.user?.id}${VEHICLES}/${selectedCar?.id}`,
    refetchOnWindowFocus: false,
    enabled: false,
    body: {
      is_default: true,
      chassis_no: selectedCar?.chassis_no,
    },
    select: (res) => res?.data?.data,
    method: "put",
    onSuccess: (res) => {
      //   dispatch(setSelectedCar({ data: selectedCar }));
      callUserVehicles();
    },
    onError: () => {},
  });
}

// add new address for user
export function addAddressQuery({
  user,
  dispatch,
  setSelectedCar = () => ({ type: "NO_ACTION" }),
  selectedCar,
  callUserVehicles = () => {},
  body,
  callUserAddresses,
  redirect = () => {},
  t = () => {},
  returnDefaultValues = () => {},
}) {
  return useCustomQuery({
    name: "setDefaultAddress",
    url: `${USERS}/${user?.data?.user?.id}${ADDRESSES}`,
    refetchOnWindowFocus: false,
    enabled: false,
    body: body,
    select: (res) => res?.data?.data,
    method: "post",
    onSuccess: (res) => {
      callUserAddresses();
      redirect();
      toast.success(t.addressAddedSuccess);
      returnDefaultValues();
    },
    onError: (err) => {
      toast.error(
        err?.response?.data?.first_error || err?.response?.data?.message
      );
    },
  });
}
