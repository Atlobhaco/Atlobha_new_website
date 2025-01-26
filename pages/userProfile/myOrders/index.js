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
import FilterOrder from "@/components/userProfile/ordersList/filterOrders/filterOrder";
import { useSelector } from "react-redux";
import SectionsNav from "@/components/shared/Navbar/SectionsNav";
import { getFilterParams, orderEnumArray } from "@/constants/helpers";

function MyOrders() {
  const { isMobile } = useScreenSize();
  const { t } = useLocalization();
  const { user } = useAuth();
  const [page, setPage] = useState(1);
  const [loadMoreClicked, setLoadMoreClicked] = useState(false);
  const [lastPage, setLastPage] = useState(false);
  const [orders, setOrders] = useState([]);
  const defaultFilters = {
    created_at_from: "",
    created_at_to: "",
    status: "",
    class: "SparePartsOrder",
  };
  const [filters, setFilters] = useState(defaultFilters);

  const {
    data,
    isFetching,
    refetch: callOrders,
  } = useCustomQuery({
    name: ["getAllOrders", page, filters],
    url: `${USERS}/${
      user?.data?.user?.id
    }${ORDERS}?page=${page}&${getFilterParams(filters)}`,
    refetchOnWindowFocus: false,
    select: (res) => res?.data,
    enabled: !!user?.data?.user?.id,
    onSuccess: (res) => {
      if (loadMoreClicked) {
        setOrders((prevOrders) => [...prevOrders, ...res?.data]);
      } else {
        setOrders(res?.data);
      }
      setLastPage(res?.meta?.last_page);
      setPage(res?.meta?.current_page);
    },
    onError: () => {
      setLoadMoreClicked(false);
    },
  });

  const handleNextPage = () => {
    if (page < lastPage) {
      setLoadMoreClicked(true);
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
                padding: "25px 0px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Box
                sx={{
                  color: "#1C1C28",
                  fontSize: isMobile ? "16px" : "24px",
                  fontWeight: "700",
                }}
              >
                {t.myOrders}{" "}
                {isFetching && (
                  <CircularProgress
                    size={20}
                    sx={{
                      color: "#FFD400",
                      mx: 2,
                    }}
                  />
                )}
              </Box>
              <Box>
                <FilterOrder
                  defaultFilters={defaultFilters}
                  setFilters={setFilters}
                  filters={filters}
                  callOrders={callOrders}
                  setPage={setPage}
                  setLoadMoreClicked={setLoadMoreClicked}
                />
              </Box>
            </Box>
            <Box sx={{ mb: 2 }}>
              <SectionsNav
                fontSize="14px"
                arrayData={[
                  { id: "all", name: t.showAll },
                  ...orderEnumArray(),
                ]}
                // handleClick={(data) => {
                //   console.log("data", data);
                //   if (data === "all") {
                //     setFilters({
                //       ...filters,
                //       class: "",
                //     });
                //   } else {
                //     setFilters({
                //       ...filters,
                //       class: data,
                //     });
                //   }
                // }}
                selectedSection={filters?.class}
              />
            </Box>

            <Box>
              {orders?.length ? (
                orders?.map((singleOrder) => (
                  <OrdersList key={singleOrder?.id} order={singleOrder} />
                ))
              ) : (
                <Box
                  sx={{
                    fontWeight: 500,
                    textAlign: "center",
                    mt: 4,
                  }}
                >
                  {!isFetching && t.noResultsFound}
                </Box>
              )}
            </Box>
          </div>
          <div className="row mt-3 ">
            <div className="col-12 text-center d-flex aling-items-center justify-content-center gap-4">
              {!!orders?.length && (
                <Box
                  sx={{
                    cursor: "pointer",
                    fontSize: isMobile ? "14px" : "17px",
                    fontWeight: "700",
                  }}
                  onClick={handleNextPage}
                >
                  {page === lastPage
                    ? `${t.total}: ${data?.meta?.total}`
                    : t.loadMore}{" "}
                  {isFetching && (
                    <CircularProgress
                      size={14}
                      sx={{
                        color: "#FFD400",
                        mx: 2,
                      }}
                    />
                  )}
                </Box>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyOrders;
