import BreadCrumb from "@/components/BreadCrumb";
import SharedBtn from "@/components/shared/SharedBtn";
import NoAddressAdded from "@/components/userProfile/myAddresses/noAddressAdded";
import SingleAddressItem from "@/components/userProfile/myAddresses/singleAddressItem";
import { ADDRESS, DELETE, USERS } from "@/config/endPoints/endPoints";
import useLocalization from "@/config/hooks/useLocalization";
import useCustomQuery from "@/config/network/Apiconfig";
import { usersAddressesQuery } from "@/config/network/Shared/GetDataHelper";
import { useAuth } from "@/config/providers/AuthProvider";
import useScreenSize from "@/constants/screenSize/useScreenSize";
import {
  setAllAddresses,
  setDefaultAddress,
} from "@/redux/reducers/selectedAddressReducer";
import { Box } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import UserProfile from "..";

const flexBox = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
};

function MyAddresses() {
  const { user } = useAuth();
  const router = useRouter();
  const dispatch = useDispatch();
  const { t } = useLocalization();
  const { isMobile } = useScreenSize();
  const [deleteAddressId, setDeleteAddressId] = useState(null);

  const { allAddresses } = useSelector((state) => state.selectedAddress);

  const { refetch: callUserAddresses } = usersAddressesQuery({
    setAllAddresses,
    user,
    dispatch,
    setDefaultAddress,
  });

  const { dat, isLoading } = useCustomQuery({
    name: ["deleteAddress", deleteAddressId],
    url: `${USERS}${ADDRESS}${DELETE}/${deleteAddressId}`,
    refetchOnWindowFocus: false,
    method: "delete",
    enabled: deleteAddressId ? true : false,
    select: (res) => res?.data?.data,
    onSuccess: (res) => {
      callUserAddresses();
      setDeleteAddressId(null);
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || t.someThingWrong);
      setDeleteAddressId(null);
    },
  });

  useEffect(() => {
    if (allAddresses?.length) {
      webengage.track("LOGIN", {
        addresses: allAddresses?.map((address) => ({
          id: address?.id || "",
          Address: address?.address || "",
          Type: address?.name || "",
        })),
      });
    }
  }, [allAddresses]);

  return (
    <div className="container-fluid">
      <div className="row">
        {!isMobile && (
          <div className="col-md-4">
            <UserProfile />
          </div>
        )}
        <div className="col-md-8 col-12 pt-4">
          <div className="row mb-2">
            <BreadCrumb />
          </div>
          {!!allAddresses?.length && (
            <div className="row mb-4">
              <Box sx={flexBox}>
                <Box
                  sx={{
                    fontSize: "20px",
                    fontWeight: "500",
                  }}
                >
                  {t.addressesList}
                </Box>
                <Box>
                  <SharedBtn
                    onClick={() => {
                      router.push("/userProfile/myAddresses/addNewAddress");
                    }}
                    className="big-main-btn"
                    text="addNewAddress"
                    compBeforeText={
                      <Image
                        alt="add"
                        width={20}
                        height={20}
                        src="/icons/addInsideCircle.svg"
                      />
                    }
                  />
                </Box>
              </Box>
            </div>
          )}
          <div className="row mb-2">
            {allAddresses?.length ? (
              allAddresses?.map((car) => (
                <div className="col-12" key={car?.id}>
                  <SingleAddressItem
                    address={car}
                    setDeleteAddressId={setDeleteAddressId}
                    isLoading={isLoading}
                    deleteAddressId={deleteAddressId}
                  />
                </div>
              ))
            ) : (
              <Box
                sx={{
                  padding: isMobile ? "80px  20px" : "150px  80px",
                }}
              >
                <NoAddressAdded />
              </Box>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyAddresses;
