import { ADDRESSES, USERS, VEHICLES } from "@/config/endPoints/endPoints";
import useCustomQuery from "../Apiconfig";
import { getUserCurrentLocation } from "@/constants/helpers";

// get user vehicles
export function usersVehiclesQuery({
  setAllCars,
  user,
  dispatch,
  setSelectedCar = () => ({ type: "NO_ACTION" }),
  setOpenAddNewCar = () => {},
  setDefaultCar = () => {},
  openAddNewCar = false,
}) {
  return useCustomQuery({
    name: ["getUsersVehicles", user?.data?.user?.id],
    url: `${USERS}/${user?.data?.user?.id}${VEHICLES}`,
    refetchOnWindowFocus: false,
    enabled: user?.data?.user?.id ? true : false,
    select: (res) => res?.data?.data,
    onSuccess: (res) => {
      const defaultCar = res?.find((d) => d?.is_default);
      //   dispatch(setSelectedCar({ data: defaultCar }));
      dispatch(setAllCars({ data: res }));
      if (openAddNewCar) {
        document.getElementById("openAfterAddNewCar")?.click();
      }
      setOpenAddNewCar(false);
      dispatch(setDefaultCar({ data: defaultCar }));
    },
    onError: () => {
      dispatch(setAllCars({ data: [] }));
    },
  });
}

// get user address
// if there is no default address  put current location as default
export function usersAddressesQuery({
  setAllAddresses,
  user,
  dispatch,
  setSelectedCar = () => ({ type: "NO_ACTION" }),
  setOpenAddNewCar = () => {},
  setDefaultAddress = () => {},
}) {
  return useCustomQuery({
    name: ["getUsersAddress", user?.data?.user?.id],
    url: `${USERS}/${user?.data?.user?.id}${ADDRESSES}`,
    refetchOnWindowFocus: false,
    enabled: user?.data?.user?.id ? true : false,
    select: (res) => res?.data?.data,
    onSuccess: async (res) => {
      const defaultAddress = res?.find((d) => d?.is_default);
      if (!defaultAddress) {
        try {
          const location = await getUserCurrentLocation();
          dispatch(
            setDefaultAddress({
              data: { id: "currentLocation", ...location },
            })
          );
        } catch (error) {
        //   console.error(error);
        }
      } else {
        dispatch(setDefaultAddress({ data: defaultAddress }));
      }
      //  dispatch(setSelectedCar({ data: defaultAddress }));
      dispatch(setAllAddresses({ data: res }));
      //   setOpenAddNewCar(false);
    },
    onError: () => {
      //   dispatch(setAllAddresses({ data: [] }));
    },
  });
}
