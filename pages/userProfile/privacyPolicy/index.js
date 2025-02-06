import React from "react";
import UserProfile from "..";
import useScreenSize from "@/constants/screenSize/useScreenSize";
import { Box, Divider } from "@mui/material";
import BreadCrumb from "@/components/BreadCrumb";
import useLocalization from "@/config/hooks/useLocalization";
import { useRouter } from "next/router";

function PrivacyPolicy() {
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
                {t.privacyPolicy}
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
                    fontSize: "18px",
                    fontWeight: "500",
                    mb: 1,
                    color: "#1C1C28",
                  }}
                >
                  {t.collectData}
                </Box>
                <Box
                  sx={{
                    color: "#1C1C28",
                    fontSize: "16px",
                    fontWeight: "700",
                    padding: "0px 16px",
                    mb: 1,
                  }}
                >
                  {t.collectThisData}
                </Box>{" "}
                <ul>
                  <li style={{ marginBottom: "7px" }}>{t.dataLikeThis}</li>
                  <li style={{ marginBottom: "7px" }}>{t.deviceType} </li>
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
                  {t.dataUsage}
                </Box>{" "}
                <ul>
                  <li style={{ marginBottom: "7px" }}>{t.manageOrders}</li>
                  <li style={{ marginBottom: "7px" }}>
                    {t.enhanceExperience}{" "}
                  </li>
                  <li style={{ marginBottom: "7px" }}>{t.sendNotification} </li>
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
                  {t.shareInfo}
                </Box>{" "}
                <ul>
                  <li style={{ marginBottom: "7px" }}>{t.withSP} </li>
                  <li style={{ marginBottom: "7px" }}>{t.willNotshared} </li>
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
                  {t.cookiesData}
                </Box>{" "}
                <ul>
                  <li style={{ marginBottom: "7px" }}>{t.weUseCookies} </li>
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
                  {t.saveData}
                </Box>{" "}
                <ul>
                  <li style={{ marginBottom: "7px" }}>{t.dataIsSecured} </li>
                  <li style={{ marginBottom: "7px" }}>{t.storeForLaw} </li>
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
                  {t.userRights}
                </Box>{" "}
                <ul>
                  <li style={{ marginBottom: "7px" }}>{t.rightToReview} </li>
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
                  {t.changeInPolicy}
                </Box>{" "}
                <ul>
                  <li style={{ marginBottom: "7px" }}>{t.changeAndUpdate} </li>
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

export default PrivacyPolicy;
