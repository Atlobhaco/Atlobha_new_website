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

export function userBrandsQuery({ setBrands, dispatch, queryParams = {} }) {
  const searchParams = new URLSearchParams(
    Object.entries(queryParams).filter(
      ([_, value]) => value !== undefined && value !== null && value !== ""
    )
  ).toString();
  return useCustomQuery({
    name: "getBrands",
    url: `${VEHICLE}${BRANDS}${searchParams ? `?${searchParams}` : ""}`,
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

export function useModelsQuery({
  setModels,
  dispatch,
  brandId,
  queryParams = {},
}) {
  const searchParams = new URLSearchParams(
    Object.entries(queryParams).filter(
      ([_, value]) => value !== undefined && value !== null && value !== ""
    )
  ).toString();
  return useCustomQuery({
    name: ["getModels", brandId],
    url: `${VEHICLE}${BRANDS}/${brandId}${MODELS}${
      searchParams ? `?${searchParams}` : ""
    }`,
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
