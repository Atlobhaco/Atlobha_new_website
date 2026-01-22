import BreadCrumb from "@/components/BreadCrumb";
import SharedBtn from "@/components/shared/SharedBtn";
import useLocalization from "@/config/hooks/useLocalization";
import { Box } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { usersVehiclesQuery } from "@/config/network/Shared/GetDataHelper";
import {
  setAllCars,
  setSelectedCar,
  setDefaultCar,
} from "@/redux/reducers/selectedCarReducer";
import { useAuth } from "@/config/providers/AuthProvider";
import NoCarAdded from "../../../components/userProfile/myCars/noCarAdded";
import useScreenSize from "@/constants/screenSize/useScreenSize";
import { userBrandsQuery } from "@/config/network/Shared/lookupsDataHelper";
import { setBrands } from "@/redux/reducers/LookupsReducer";
import useCustomQuery from "@/config/network/Apiconfig";
import { USERS, VEHICLES } from "@/config/endPoints/endPoints";
import { toast } from "react-toastify";
import SingleCarItem from "@/components/userProfile/myCars/singleCarItem";
import UserProfile from "..";

const flexBox = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
};

function MyCars() {
  const { t } = useLocalization();
  const router = useRouter();
  const { user } = useAuth();
  const { isMobile } = useScreenSize();
  const dispatch = useDispatch();
  const [deleteCarId, setDeleteCarId] = useState(null);

  const { allCars } = useSelector((state) => state.selectedCar);

  const { refetch: callUserVehicles } = usersVehiclesQuery({
    setAllCars,
    user,
    dispatch,
    setSelectedCar,
    setDefaultCar,
  });

  const { refetch: callBrands } = userBrandsQuery({
    setBrands,
    dispatch,
  });

  useEffect(() => {
    callBrands();
  }, []);

  const { dat, isLoading } = useCustomQuery({
    name: ["deleteCar", deleteCarId],
    url: `${USERS}/${user?.data?.user?.id}${VEHICLES}/${deleteCarId}`,
    refetchOnWindowFocus: false,
    method: "delete",
    enabled: deleteCarId ? true : false,
    select: (res) => res?.data?.data,
    onSuccess: (res) => {
      callUserVehicles();
      setDeleteCarId(null);
    },
    onError: () => {
      toast.error(t.someThingWrong);
    },
  });

  return (
    <div className="container-fluid">
      <div className="row">
        {!isMobile && (
          <div className="col-md-4">
            <UserProfile />
          </div>
        )}
        <div className="col-md-8 col-12 pt-4">
          <div className="row">
            <BreadCrumb />
          </div>
          {!!allCars?.length && (
            <div className="row mb-4">
              <Box sx={flexBox}>
                <Box
                  sx={{
                    fontSize: "20px",
                    fontWeight: "500",
                  }}
                >
                  {t.carList}
                </Box>
                <Box>
                  <SharedBtn
                    onClick={() => {
                      router.push("/userProfile/myCars/addNewCarProfile");
                    }}
                    className="big-main-btn"
                    text="addNewCar"
                    compBeforeText={
                      <Image
                        alt="add"
                        width={20}
                        height={20}
                        src="/icons/addInsideCircle.svg"
                        loading="lazy"
                      />
                    }
                  />
                </Box>
              </Box>
            </div>
          )}
          <div className="row mb-2">
            {allCars?.length ? (
              allCars?.map((car) => (
                <div className="col-12" key={car?.id}>
                  <SingleCarItem
                    car={car}
                    setDeleteCarId={setDeleteCarId}
                    isLoading={isLoading}
                    deleteCarId={deleteCarId}
                  />
                </div>
              ))
            ) : (
              <Box
                sx={{
                  padding: isMobile ? "80px  20px" : "150px  80px",
                }}
              >
                <NoCarAdded />
              </Box>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyCars;
