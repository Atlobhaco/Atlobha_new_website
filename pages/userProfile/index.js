import BreadCrumb from "@/components/BreadCrumb";
import ProfileSetting from "@/components/userProfile/ProfileSetting";
import AtlobhaPlusHint from "@/components/userProfile/atlobhaPlusHint";
import BasicSections from "@/components/userProfile/basicSections";
import UserBalanceHolder from "@/components/userProfile/userBalanceholder/userBalanceHolder";
import { USERS } from "@/config/endPoints/endPoints";
import useLocalization from "@/config/hooks/useLocalization";
import useCustomQuery from "@/config/network/Apiconfig";
import { useAuth } from "@/config/providers/AuthProvider";
import { setAllSections } from "@/redux/reducers/quickSectionsProfile";
import { Box } from "@mui/material";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Address from "../../public/icons/address-yellow.svg";
import Wallet from "../../public/icons/wallet-yellow.svg";
import Car from "../../public/icons/car-yellow.svg";
import Order from "../../public/icons/orders-yellow.svg";
import CarActive from "../../public/icons/car-active.svg";
import AddressActive from "../../public/icons/address-active.svg";
import YellowGift from "../../public/icons/yellow-gift.svg";
import Rate from "../../public/icons/rate.svg";
import useScreenSize from "@/constants/screenSize/useScreenSize";

function UserProfile() {
  const router = useRouter();
  const { user } = useAuth();
  const dispatch = useDispatch();
  const { isMobile } = useScreenSize();
  const { t, locale } = useLocalization();
  const { allsections } = useSelector((state) => state.quickSection);

  const profileSections = [
    {
      iconSrc: <YellowGift />,
      text: t.tellFriends,
      hint: t.winPoints,
      //   onClick: () => alert("clicked"),
      path: "/userProfile/myAddresses",
    },
    {
      iconSrc: <Rate />,
      text: t.rateAtlobha,
      //   onClick: () => alert("clicked"),
      path: "",
    },
  ];

  const [quickSections, setQuickSections] = useState([
    {
      src: <Wallet />,
      title: t.myCards,
      num: 0,
      path: "wallet",
    },
    {
      activeSrc: <CarActive />,
      src: <Car />,
      title: t.Cars,
      num: 0,
      onClick: () => router.push("/userProfile/myCars"),
      path: "myCars",
    },
    {
      src: <Order />,
      title: t.myOrders,
      num: 0,
      path: "orders",
    },
    {
      activeSrc: <AddressActive />,
      src: <Address />,
      title: t.addresses,
      num: 0,
      onClick: () => router.push("/userProfile/myAddresses"),
      path: "myAddresses",
    },
  ]);

  const { data } = useCustomQuery({
    name: "getProfileInfo",
    url: `${USERS}/${user?.data?.user?.id}`,
    refetchOnWindowFocus: false,
    select: (res) => res?.data?.data,
    // staleTime: 5 * 60 * 1000,
    enabled: user?.data?.user?.id ? true : false,
    onSuccess: (res) => {
      dispatch(
        setAllSections({
          data: [
            {
              src: <Wallet />,
              title: t.myCards,
              num: 0,
              path: "wallet",
            },
            {
              activeSrc: <CarActive />,
              src: <Car />,
              title: t.Cars,
              num: res?.vehicles_count,
              //   onClick: () => router.push("/userProfile/myCars"),
              path: "myCars",
            },
            {
              src: <Order />,
              title: t.myOrders,
              num: res?.order_count,
              path: "orders",
            },
            {
              activeSrc: <AddressActive />,
              src: <Address />,
              title: t.addresses,
              num: res?.addresses_count,
              path: "myAddresses",
            },
          ],
        })
      );
      setQuickSections([
        {
          activeSrc: <CarActive />,
          src: <Wallet />,
          title: t.myCards,
          num: 0,
          path: "wallet",
        },
        {
          src: <Car />,
          title: t.Cars,
          num: res?.vehicles_count,
          onClick: () => router.push("/userProfile/myCars"),
          path: "myCars",
        },
        {
          src: <Order />,
          title: t.myOrders,
          num: res?.order_count,
          path: "orders",
        },
        {
          activeSrc: <AddressActive />,
          src: <Address />,
          title: t.addresses,
          num: res?.addresses_count,
          onClick: () => router.push("/userProfile/myAddresses"),
          path: "myAddresses",
        },
      ]);
    },
    onError: () => {},
  });

  //   no profile page in web must be has active child
  useEffect(() => {
    if (!isMobile && router.pathname === "/userProfile") {
      router.push("/userProfile/editInfo/");
    }
  }, [isMobile]);

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
          {(allsections?.length ? allsections : quickSections)?.map(
            (sec, index) => (
              <div key={sec?.title} className="col-md-6 col-6">
                <BasicSections
                  src={sec?.src}
                  activeSrc={sec?.activeSrc}
                  title={sec?.title}
                  num={sec?.num}
                  onClick={quickSections[index]?.onClick}
                  path={sec?.path}
                />
              </div>
            )
          )}
        </div>
        <div className="row mt-3">
          {profileSections?.map((data) => (
            <div className="col-md-12" key={data?.iconSrc}>
              <ProfileSetting data={data} />
            </div>
          ))}
        </div>
      </Box>
    </>
  );
}

export default UserProfile;
