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

              <Box
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
                  التعريفات
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
                    نحن ولنا ونشير إلى Atlobha.com (مسجل في السعودية).
                  </span>
                  <span>أنت وأنت تشير إلى مشتري أي سلع منا.</span>
                  <span>
                    العقد يعني العقد المبرم بيننا وبينك لبيعنا لك البضائع.
                  </span>{" "}
                  <span>السلع تعني أي سلع أو خدمات تطلبها منا.</span>
                  <span>
                    المستهلك يعني أي شخص طبيعي ، عند تقديم طلب معنا ، يتصرف
                    لأغراض خارج نطاق تجارته أو أعماله أو مهنته.
                  </span>
                  <span>
                    الموقع الإلكتروني يعني موقعنا على www.Atlobha.com.
                  </span>
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
                  2. مبيعات الأعمال:
                </Box>{" "}
                <ul>
                  <li style={{ marginBottom: "7px" }}>
                    إذا طلبت سلعًا بخلاف كمستهلك (على سبيل المثال لأنك شركة
                    تجارية) ، فعندئذٍ:
                  </li>
                  <li style={{ marginBottom: "7px" }}>
                    هذه الشروط والأحكام لا تنطبق و
                  </li>
                  <li style={{ marginBottom: "7px" }}>
                    تنطبق شروط وأحكام أعمالنا على طلبك وأي عقد ناتج بينك وبيننا.{" "}
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
                  بنود العقد:
                </Box>{" "}
                <ul>
                  <li style={{ marginBottom: "7px" }}>
                    إذا قمت بتقديم طلب للبضائع كمستهلك ، فإن هذه الشروط والأحكام
                    تنطبق على طلبك والعقد بينك وبيننا.
                  </li>
                  <li style={{ marginBottom: "7px" }}>
                    يجوز لنا تغيير هذه الشروط والأحكام في أي وقت. ستنطبق أي
                    تغييرات على أي طلبات تقوم بإدخالها بعد الوقت الذي نقوم فيه
                    بتحديث الشروط والأحكام على موقعنا. لن تسري التغييرات على أي
                    طلب تقدمه قبل إجراء التغييرات على موقعنا.
                  </li>
                  <li style={{ marginBottom: "7px" }}>
                    لقد حرصنا على التأكد من أن موقعنا الإلكتروني وهذه الشروط
                    والأحكام لا تتعارض مع بعضها البعض. ومع ذلك ، إذا كان هناك أي
                    تناقضات أو تناقضات ، فسيتم تطبيق هذه الشروط والأحكام بدلاً
                    من أي جزء متناقض أو غير متسق من موقعنا على الإنترنت. عند
                    إنشاء العقد ، لا يوجد عقد بينك وبيننا حتى نخطرك بقبولنا
                    لطلبك وتسليم البضائع.{" "}
                  </li>
                  <li style={{ marginBottom: "7px" }}>
                    نحن لسنا ملزمين بقبول طلبك.
                  </li>
                  <li style={{ marginBottom: "7px" }}>
                    يجوز لنا إلغاء طلبك إذا لم نتمكن من توريد البضائع لأي سبب.{" "}
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
