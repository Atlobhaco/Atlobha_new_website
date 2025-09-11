import {
  BRANDS,
  LOOKUPS,
  MODELS,
  USERS,
  VEHICLE,
  VEHICLES,
} from "@/config/endPoints/endPoints";
import { toast } from "react-toastify";
import useCustomQuery from "../Apiconfig";

export function userBrandsQuery({ setBrands, dispatch }) {
  return useCustomQuery({
    name: "getBrands",
    url: `${VEHICLE}${BRANDS}`,
    refetchOnWindowFocus: false,
    enabled: false,
    select: (res) => res?.data?.data,
    onSuccess: (res) => {
      dispatch(setBrands({ data: res }));
    },
    onError: () => {
      dispatch(setBrands({ data: [] }));
    },
  });
}

export function useModelsQuery({ setModels, dispatch, brandId }) {
  return useCustomQuery({
    name: ["getModels", brandId],
    url: `${VEHICLE}${BRANDS}/${brandId}${MODELS}`,
    refetchOnWindowFocus: false,
    enabled: brandId ? true : false,
    select: (res) => res?.data?.data,
    onSuccess: (res) => {
      dispatch(setModels({ data: res }));
    },
    onError: () => {
      dispatch(setModels({ data: [] }));
    },
  });
}
