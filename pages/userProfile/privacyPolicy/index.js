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
                    color: "#1C1C28",
                    fontSize: "16px",
                    fontWeight: "700",
                    padding: "0px 16px",
                    mb: 1,
                  }}
                >
                  مقدّمة اتفاقية الاستخدام:{" "}
                </Box>{" "}
                <Box
                  sx={{
                    padding: "0px 16px",
                    mb: 2,
                  }}
                >
                  متجرنا الالكتروني يرحّب بكم ويبلغكم بأنكم سوف تجدون أدناه
                  الشروط والأحكام المُنظّمة لاستخدامكم لهذا المتجر وكافة الآثار
                  القانونية التي تنتج عن إستخدامكم لخدمات المتجر عبر الشبكة
                  العنكبوتية عبر هذه المنصة الالكترونية، حيث أن استخدام أي شخصٍ
                  كان للمتجر سواءً كان مستهلكاً لخدمة أو لمنتج المتجر أو غير ذلك
                  فإن هذا موافقة وقبول منه وهو بكامل أهليته المعتبرة شرعاً
                  ونظاماً وقانوناً لكافة مواد وأحكام هذه الاتفاقية وهو تأكيد
                  لالتزامكم بأنظمتها ولما ذُكر فيها، وتسري هذه الاتفاقية على
                  جميع أنواع التعامل بين المستهلك وبين. وتعتبر هذه الاتفاقية
                  سارية المفعول ونافذة بمجرد قيامكم بالموافقة عليها والبدء في
                  التسجيل بالمتجر بموجب المادة العاشرة من نظام التعاملات
                  الإلكترونية السعودي.
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
                  المادة الأولى - المقدّمة والتعريفات:{" "}
                </Box>{" "}
                <ul>
                  <li style={{ marginBottom: "7px" }}>
                    يعتبر التمهيد أعلاه جزءاً لا يتجزأ من هذه الاتفاقية ، كما
                    تجدون أدناه الدلالات والتعريفات للعبارات الرئيسية المستهلكة
                    في هذه الاتفاقية :
                  </li>
                  <li style={{ marginBottom: "7px" }}>
                    1- ( المتجر ) ويشمل هذا التعريف كافة أشكال المتجر على الشبكة
                    العنكبوتية، سواءً كانت تطبيق إلكتروني، أو موقع الكتروني على
                    الشبكة العنكبوتية، أو محل تجاري.{" "}
                  </li>
                  <li style={{ marginBottom: "7px" }}>
                    2- ( المستهلك) الشخص الذي يتعامل بالتجارة الإلكترونية رغبةً
                    في الحصول على المنتجات أو الخدمات التي يوفرها من المتجر عبر
                    منصته الالكترونية.{" "}
                  </li>
                  <li style={{ marginBottom: "7px" }}>
                    3- ( الاتفاقية ) يقصَد بهذه العبارة شروط وأحكام هذه
                    الاتفاقية، والتي تحكم وتنظّم العلاقة فيما بين أطراف هذه
                    الاتفاقية.{" "}
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
                  المادة الثانية - أهلية المستهلك القانونية:{" "}
                </Box>{" "}
                <ul>
                  <li style={{ marginBottom: "7px" }}>
                    1- يقر المستهلك بأنه ذا أهلية قانونية معتبرة شرعاً ونظاماً
                    للتعامل مع المتجر، أو أن عمره لا يقل عن ثمانية عشرة عاماً.{" "}
                  </li>
                  <li style={{ marginBottom: "7px" }}>
                    2- يوافق المستهلك بأنه في حال مخالفته لهذه المادة، فإنه
                    يتحمّل تبعات هذه المخالفة أمام الغير.
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

export default PrivacyPolicy;
