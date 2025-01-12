import React, { useState } from "react";
import UserProfile from "..";
import useScreenSize from "@/constants/screenSize/useScreenSize";
import BreadCrumb from "@/components/BreadCrumb";
import { Box, CircularProgress } from "@mui/material";
import useLocalization from "@/config/hooks/useLocalization";
import OrdersList from "@/components/userProfile/ordersList/ordersList";
import { useAuth } from "@/config/providers/AuthProvider";
import { ORDERS, USERS } from "@/config/endPoints/endPoints";
import useCustomQuery from "@/config/network/Apiconfig";

function MyOrders() {
  const { isMobile } = useScreenSize();
  const { t } = useLocalization();
  const { user } = useAuth();
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(false);
  const [orders, setOrders] = useState([]);

  const { data, isLoading } = useCustomQuery({
    name: ["getAllOrders", page],
    url: `${USERS}/${user?.data?.user?.id}${ORDERS}?page=${page}`,
    refetchOnWindowFocus: false,
    select: (res) => res?.data,
    enabled: !!user?.data?.user?.id,
    onSuccess: (res) => {
      setOrders((prevOrders) => [...prevOrders, ...res?.data]);
      setLastPage(res?.meta?.last_page);
      setPage(res?.meta?.current_page);
    },
    onError: () => {},
  });


  const handleNextPage = () => {
    if (page < lastPage) {
      setPage((prevPage) => prevPage + 1);
    }
  };

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
          <div className="row mb-4">
            <Box
              sx={{
                padding: "30px 0px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Box
                sx={{
                  color: "#1C1C28",
                  fontSize: "24px",
                  fontWeight: "700",
                }}
              >
                {t.myOrders}{" "}
                {isLoading && (
                  <CircularProgress
                    size={20}
                    sx={{
                      color: "#FFD400",
                      mx: 2,
                    }}
                  />
                )}
              </Box>
              <Box>filter</Box>
            </Box>
            <Box>
              {orders?.map((singleOrder) => (
                <OrdersList order={singleOrder} />
              ))}
            </Box>
          </div>
          <div className="row mt-3 ">
            <div className="col-12 text-center d-flex aling-items-center justify-content-center gap-4">
              <Box
                sx={{ cursor: "pointer", fontSize: "17px", fontWeight: "700" }}
                onClick={handleNextPage}
              >
                {page === lastPage
                  ? `${t.total}: ${data?.meta?.total}`
                  : t.loadMore}{" "}
                {isLoading && (
                  <CircularProgress
                    size={14}
                    sx={{
                      color: "#FFD400",
                      mx: 2,
                    }}
                  />
                )}
              </Box>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyOrders;
