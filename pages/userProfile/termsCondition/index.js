import React from "react";
import UserProfile from "..";
import useScreenSize from "@/constants/screenSize/useScreenSize";
import { Box, Divider } from "@mui/material";
import BreadCrumb from "@/components/BreadCrumb";
import useLocalization from "@/config/hooks/useLocalization";
import { useRouter } from "next/router";
import Image from "next/image";

function TermsCondition() {
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
                {t.termsCondition}
              </Box>
              {/* <Box
                sx={{
                  background: "rgba(224, 110, 14, 0.10)",
                  borderRadius: "8px",
                  padding: "6px 10px",
                  color: "#EE772F",
                  fontWeight: 500,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  fontSize: "16px",
                  mb: 3,
                }}
              >
                <Image
                  src="/icons/error-orange.svg"
                  alt="error"
                  width={14}
                  height={14}
                />
                يرجى قراءة هذه الشروط والأحكام بعناية قبل تقديم الطلب والاحتفاظ
                بنسخة من هذه الشروط والأحكام والرجوع إليها في المستقبل
              </Box> */}
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
                  {t.intro}
                </Box>{" "}
                <Box
                  sx={{
                    padding: "0px 16px",
                    mb: 2,
                    display: "flex",
                    gap: 1,
                    flexDirection: "column",
                  }}
                >
                  <span>
                    {t.rulesApplied} {t.readCarefully}
                  </span>
                  <span>{t.youAccept}</span>{" "}
                </Box>
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
                  {t.elibibility}
                </Box>{" "}
                <ul>
                  <li style={{ marginBottom: "7px" }}>{t.hasEligibility}</li>
                  <li style={{ marginBottom: "7px" }}>
                    {t.confirmEligibility}
                  </li>
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
                  {t.infoAbout}
                  <br />
                  <p className="pt-1">{t.atlobhaDesccribe}</p>{" "}
                </Box>{" "}
                <ul>
                  <li style={{ marginBottom: "7px" }}>{t.sellSpareParts}</li>
                  <li style={{ marginBottom: "7px" }}>
                    {t.maintenanceService}
                  </li>
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
                  {t.services}
                </Box>{" "}
                <ul>
                  <li style={{ marginBottom: "7px" }}>{t.sellToCustomers}</li>
                  <li style={{ marginBottom: "7px" }}>{t.provideService}</li>
                  <li style={{ marginBottom: "7px" }}>{t.deliveryService}</li>
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
                  {t.serviceAvailability}
                </Box>{" "}
                <ul>
                  <li style={{ marginBottom: "7px" }}>
                    {t.deliverySpareParts}
                  </li>
                  <li style={{ marginBottom: "7px" }}>{t.maintenaceService}</li>
                  <li style={{ marginBottom: "7px" }}>{t.workingHrs}</li>
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
                  {t.howWorks}
                </Box>{" "}
                <ol>
                  <li style={{ marginBottom: "7px" }}>{t.makeRequest}</li>
                  <li style={{ marginBottom: "7px" }}>{t.pricedImmedialty}</li>
                  <li style={{ marginBottom: "7px" }}>{t.invoiceDetails}</li>
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
                  {t.paymentsMethods}
                  <br />
                  <p className="pt-1">{t.multipleOptions}</p>{" "}
                </Box>{" "}
                <ul>
                  <li style={{ marginBottom: "7px" }}>{t.cashOnriyadh}</li>
                  <li style={{ marginBottom: "7px" }}>{t.madaCredit}</li>
                  <li style={{ marginBottom: "7px" }}>{t.installBank}</li>
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
                  {t.Warranty}
                  <br />
                  <p className="pt-1">{t.originalwarranty}</p>{" "}
                </Box>{" "}
                <ul>
                  <li style={{ marginBottom: "7px" }}>{t.monthOfCars}</li>
                  <li style={{ marginBottom: "7px" }}>{t.oneYear}</li>
                  <li style={{ marginBottom: "7px" }}>{t.yearAcccessories}</li>
                  <li style={{ marginBottom: "7px" }}>{t.exceptionsParts}</li>
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
                  {t.returnPolicyPart}
                </Box>{" "}
                <ul>
                  <li style={{ marginBottom: "7px" }}>{t.timeToReturn}</li>
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
                  {t.propertyRight}
                </Box>{" "}
                <ul>
                  <li style={{ marginBottom: "7px" }}>
                    {t.propertyForAtlobha}
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

export default TermsCondition;
