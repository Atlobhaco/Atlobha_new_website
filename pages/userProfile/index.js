import BreadCrumb from "@/components/BreadCrumb";
import AtlobhaPlusHint from "@/components/userProfile/atlobhaPlusHint";
import BasicSections from "@/components/userProfile/basicSections";
import UserBalanceHolder from "@/components/userProfile/userBalanceholder/userBalanceHolder";
import { USERS } from "@/config/endPoints/endPoints";
import useLocalization from "@/config/hooks/useLocalization";
import useCustomQuery from "@/config/network/Apiconfig";
import { useAuth } from "@/config/providers/AuthProvider";
import { Box } from "@mui/material";
import { useRouter } from "next/router";
import React, { useState } from "react";

function UserProfile() {
  const router = useRouter();
  const { user } = useAuth();
  const { t, locale } = useLocalization();
  const [quickSections, setQuickSections] = useState([
    {
      src: "/icons/wallet-yellow.svg",
      title: t.myCards,
      num: 4,
    },
    {
      src: "/icons/car-yellow.svg",
      title: t.Cars,
      num: 412,
      onClick: () => router.push("/userProfile/myCars"),
    },
    {
      src: "/icons/orders-yellow.svg",
      title: t.myOrders,
      num: 40,
    },
    {
      src: "/icons/address-yellow.svg",
      title: t.addresses,
      num: 1,
      onClick: () => router.push("/userProfile/myAddresses"),
    },
  ]);

  const { data } = useCustomQuery({
    name: "getProfileInfo",
    url: `${USERS}/${user?.data?.user?.id}`,
    refetchOnWindowFocus: false,
    select: (res) => res?.data?.data,
    staleTime: 5 * 60 * 1000,
    enabled: user?.data?.user?.id ? true : false,
    onSuccess: (res) => {
      setQuickSections([
        {
          src: "/icons/wallet-yellow.svg",
          title: t.myCards,
          num: 0,
        },
        {
          src: "/icons/car-yellow.svg",
          title: t.Cars,
          num: 10,
          onClick: () => router.push("/userProfile/myCars"),
        },
        {
          src: "/icons/orders-yellow.svg",
          title: t.myOrders,
          num: res?.order_count,
        },
        {
          src: "/icons/address-yellow.svg",
          title: t.addresses,
          num: 1,
          onClick: () => router.push("/userProfile/myAddresses"),
        },
      ]);
    },
    onError: () => {},
  });

  return (
    <>
      {/* <div className="col-12">
        <AtlobhaPlusHint />
      </div> */}
      <Box
        sx={{
          boxShadow:
            locale === "ar"
              ? "-9px 0px 7px 0px rgba(0, 0, 0, 0.16)"
              : "9px 0px 7px 0px rgba(0, 0, 0, 0.16)",
        }}
        className="col-12  p-3"
      >
        <Box sx={{ position: "absolute", top: "0px", zIndex: -1 }}>
          <BreadCrumb />
        </Box>

        <UserBalanceHolder data={data} />
        <div className="row mt-3">
          {quickSections?.map((sec) => (
            <div key={sec?.title} className="col-md-6 col-6">
              <BasicSections
                src={sec?.src}
                title={sec?.title}
                num={sec?.num}
                onClick={sec?.onClick}
              />
            </div>
          ))}
        </div>
      </Box>
    </>
  );
}

export default UserProfile;
