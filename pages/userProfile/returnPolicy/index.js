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
                {t.returnPolicy}
              </Box>
              <Box
                sx={{
                  padding: "15px  4px",
                  color: "#374151",
                  fontSize: "14px",
                }}
              >
                <ul>
                  <li style={{ marginBottom: "7px" }}>
                    مع عدم الإخلال بأحكام الضمان الاتفاقية والنظامية يحق
                    للمستهلك استرجاع أي منتج في الفاتورة خلال ( 3 ) أيام عمل
                    والاستبدال خلال ( 5 ) أيام عمل ولا يحق له استبدال واسترجاع
                    المنتج بعد مرور الفترة المحددة.
                  </li>
                  <li style={{ marginBottom: "7px" }}>
                    لا يحق للمستهلك استبدال او استرجاع إذا كان المنتج تم تصنيعه
                    بناءً على طلب المستهلك أو وفقاً لمواصفات حدّدها، ويستثنى من
                    ذلك المنتجات التي بها عيب أو التي خالفت المواصفات المحدّدة
                    من قبل المستهلك.
                  </li>
                  <li style={{ marginBottom: "7px" }}>
                    يشترط لاستبدال او استرجاع المنتج أن يكون المنتج بحالة سليمة
                    وألا يكون المستهلك قد استخدم المنتج أو حصل على منفعته، ويحق
                    للمتجر معاينة المنتج قبل استبداله او استرجاع للتأكد من
                    سلامته ويتحمل المستهلك دفع قيمة الشحن في حال أراد استبدال او
                    استرجاع المنتج وفي الاستبدال والاسترجاع الدولي يتحمل
                    المستهلك كامل تكاليف الشحن وتسليم المنتج لشركة الشحن وفي حال
                    وجود عيوب أو خطأ سيتم تعويض المستهلك
                  </li>
                  <li style={{ marginBottom: "7px" }}>
                    استلام الشحنة من شركة الشحن او مندوب التوصيل يعتبر اقراراً
                    من العميل ان الشحنة سليمة وبحالة جيدة ولم يتم فتحها قبل
                    الاستلام يشمل الارجاع والاستبدال جميع الأصناف باستثناء القطع
                    الكهربائية . الا اذا وجد عيب مصنعي بالمنتج .
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
                  الاستبدال للقطع الكهربائية اذا تبين وجود عيب مصنعي
                </Box>{" "}
                <ul>
                  <li style={{ marginBottom: "7px" }}>
                    ان تكون خالية من الخدوش او سوا الاستخدام
                  </li>
                  <li style={{ marginBottom: "7px" }}>
                    إحضار العلبة الاصلية مع جميع الملحقات{" "}
                  </li>
                  <li style={{ marginBottom: "7px" }}>
                    قد يتطلب إحضار تقرير من وكيل الصيانة المعتمد قبل عملية
                    الاستبدال{" "}
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
                  ما هي الحالات التي لا أستطيع فيها الاسترجاع؟{" "}
                </Box>{" "}
                <ul>
                  <li style={{ marginBottom: "7px" }}>
                    عند تقديم طلب الاسترجاع بعد الوقت المحدد وهو 3 ايام من تاريخ
                    الاستلام.{" "}
                  </li>
                  <li style={{ marginBottom: "7px" }}>
                    عند استخدام المنتج أو فتحه، أو عند تلفه .{" "}
                  </li>
                  <li style={{ marginBottom: "7px" }}>
                    عند تلف التغليف الخاصة بالمنتج
                  </li>
                  <li style={{ marginBottom: "7px" }}>
                    الاسترجاع والاستبدال لا يشمل القطع الكهربائية{" "}
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
                  تحتفظ متجر سديم بحق إلغاء الطلب لأي سبب من الأسباب التالية :{" "}
                </Box>{" "}
                <ul>
                  <li style={{ marginBottom: "7px" }}>
                    رفض / عدم قبول عملية الدفع الالكترونية{" "}
                  </li>
                  <li style={{ marginBottom: "7px" }}>
                    إذا كان عنوان التوصيل المعطى من قبل العميل خاطئ أو كانت
                    معلومات الاتصال خاطئة أو لعدم القدرة على الوصول إلى العميل{" "}
                  </li>
                  <li style={{ marginBottom: "7px" }}>
                    عدم توفر المنتج في الوقت الحالي أو انتهت الكمية من المخزون{" "}
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
