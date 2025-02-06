import React from "react";
import UserProfile from "..";
import useScreenSize from "@/constants/screenSize/useScreenSize";
import { Box, Divider } from "@mui/material";
import BreadCrumb from "@/components/BreadCrumb";
import useLocalization from "@/config/hooks/useLocalization";
import { useRouter } from "next/router";

function ReturnPolicy() {
  const router = useRouter();
  const { mobileScreen, customScreens } = router.query;
  const { isMobile } = useScreenSize();
  const { t } = useLocalization();

  return (
    <div className="container-fluid">
      <div className="row">
        {!isMobile && !mobileScreen && !customScreens && (
          <div className="col-md-4">
            <UserProfile />
          </div>
        )}
        <div className={`${customScreens ? "col-12" : "col-md-8 col-12"} pt-4`}>
          {!mobileScreen && !customScreens && (
            <div className="row">
              <BreadCrumb />
            </div>
          )}
          <div className="row mb-4 mt-3">
            <Box>
              <Box
                sx={{
                  fontSize: "20px",
                  fontWeight: "500",
                  mb: 3,
                }}
              >
                {t.returnReplace}
              </Box>

              <Box
                sx={{
                  padding: "15px  4px",
                  color: "#374151",
                  fontSize: "14px",
                }}
              >
                <Box
                  sx={{
                    color: "#1C1C28",
                    fontSize: "16px",
                    fontWeight: "700",
                    padding: "0px 16px",
                    mb: 1,
                  }}
                >
                  {t.conditionToReplace}
                </Box>{" "}
                <ul>
                  <li style={{ marginBottom: "7px" }}>{t.sevenDaysReplace}</li>
                  <li style={{ marginBottom: "7px" }}>{t.cleanPart}</li>
                  <li style={{ marginBottom: "7px" }}>{t.replacePart}</li>
                </ul>
              </Box>

              <Divider sx={{ background: "#EAECF0", mb: 1 }} />

              <Box
                sx={{
                  padding: "15px  4px",
                  color: "#374151",
                  fontSize: "14px",
                }}
              >
                <Box
                  sx={{
                    color: "#1C1C28",
                    fontSize: "16px",
                    fontWeight: "700",
                    padding: "0px 16px",
                    mb: 1,
                  }}
                >
                  {t.shippingCost}
                </Box>{" "}
                <ol>
                  <li style={{ marginBottom: "7px" }}>{t.atlobhaAfford}</li>
                  <ul>
                    <li style={{ marginBottom: "7px" }}>
                      {t.differenceInpart}
                    </li>
                    <li style={{ marginBottom: "7px" }}>
                      {t.correctPartShipped}
                    </li>
                  </ul>

                  <li style={{ marginBottom: "7px" }}>{t.clientAfford}</li>
                  <ul>
                    <li style={{ marginBottom: "7px" }}>
                      {t.errorFromCustomer}
                    </li>
                    <li style={{ marginBottom: "7px" }}>{t.noChaseNum}</li>
                    <li style={{ marginBottom: "7px" }}>{t.noLongerNeed}</li>
                  </ul>
                </ol>
              </Box>

              <Divider sx={{ background: "#EAECF0", mb: 1 }} />

              <Box
                sx={{
                  padding: "15px  4px",
                  color: "#374151",
                  fontSize: "14px",
                }}
              >
                <Box
                  sx={{
                    color: "#1C1C28",
                    fontSize: "16px",
                    fontWeight: "700",
                    padding: "0px 16px",
                    mb: 1,
                  }}
                >
                  {t.exceptions}{" "}
                </Box>{" "}
                <ul>
                  <li style={{ marginBottom: "7px" }}>{t.electricalParts}</li>
                  <li style={{ marginBottom: "7px" }}>
                    {t.noChangeReturnNever}{" "}
                  </li>
                </ul>
              </Box>

              <Divider sx={{ background: "#EAECF0", mb: 1 }} />
            </Box>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReturnPolicy;
