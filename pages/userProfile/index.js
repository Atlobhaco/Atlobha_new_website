import BreadCrumb from "@/components/BreadCrumb";
import { Box } from "@mui/material";
import { useRouter } from "next/router";
import React from "react";

function UserProfile() {
  const router = useRouter();

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
}

export default UserProfile;
