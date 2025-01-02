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
  const { t } = useLocalization();
  const [quickSections, setQuickSections] = useState([
    {
      src: "/icons/wallet-yellow.svg",
      title: "بطاقاتي",
      num: 4,
    },
    {
      src: "/icons/car-yellow.svg",
      title: "سياراتي",
      num: 412,
      onClick: () => router.push("/userProfile/myCars"),
    },
    {
      src: "/icons/orders-yellow.svg",
      title: "طلباتي",
      num: 40,
    },
    {
      src: "/icons/address-yellow.svg",
      title: "عناويني",
      num: 1,
      onClick: () => router.push("/userProfile/myAddresses"),
    },
  ]);

  const { data } = useCustomQuery({
    name: "getProfileInfo",
    url: `${USERS}/${user?.data?.user?.id}`,
    refetchOnWindowFocus: false,
    select: (res) => res?.data?.data,
    onSuccess: (res) => {
      console.log(res);
      setQuickSections([
        {
          src: "/icons/wallet-yellow.svg",
          title: "بطاقاتي",
          num: 0,
        },
        {
          src: "/icons/car-yellow.svg",
          title: "سياراتي",
          num: 10,
          onClick: () => router.push("/userProfile/myCars"),
        },
        {
          src: "/icons/orders-yellow.svg",
          title: "طلباتي",
          num: res?.order_count,
        },
        {
          src: "/icons/address-yellow.svg",
          title: "عناويني",
          num: 1,
          onClick: () => router.push("/userProfile/myAddresses"),
        },
      ]);
    },
    onError: () => {},
  });

  return (
    <Box>
      <BreadCrumb />
      <Box className="mb-3">UserProfile data will apear here</Box>
      <Box onClick={() => router.push("/userProfile/myCars")}>
        clik to go to cars
      </Box>

      <Box onClick={() => router.push("/userProfile/myAddresses")}>
        clik to go add address
      </Box>
    </Box>
  );

//   return (
//     <div className="container-fluid pt-3">
//       <div className="row mb-2">
//         <BreadCrumb />
//       </div>
//       <div className="row">
//         <UserBalanceHolder data={data} />
//       </div>
//       <div className="row mt-3">
//         {quickSections?.map((sec) => (
//           <div key={sec?.title} className="col-md-3 col-6">
//             <BasicSections
//               src={sec?.src}
//               title={sec?.title}
//               num={sec?.num}
//               onClick={sec?.onClick}
//             />
//           </div>
//         ))}
//       </div>
//       <div className="row mt-3">
//         <div className="col-12">
//           <AtlobhaPlusHint />
//         </div>
//       </div>
//     </div>
//   );
}

export default UserProfile;
