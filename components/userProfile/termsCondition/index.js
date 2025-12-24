import React from "react";
import { Box, Divider } from "@mui/material";
import useLocalization from "@/config/hooks/useLocalization";

function TermsConditionsData() {
  const { t } = useLocalization();
  return (
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
            <li style={{ marginBottom: "7px" }}>{t.confirmEligibility}</li>
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
            <li style={{ marginBottom: "7px" }}>{t.maintenanceService}</li>
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
            <li style={{ marginBottom: "7px" }}>{t.deliverySpareParts}</li>
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
            <li style={{ marginBottom: "7px" }}>{t.propertyForAtlobha}</li>
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
            (برنامج الكاش باكCashback){" "}
          </Box>{" "}
          <ul>
            <li style={{ marginBottom: "7px", fontWeight: "bold" }}>
              كيف يعمل الكاش باك؟
            </li>
            <li style={{ marginBottom: "7px" }}>
              عند إتمام طلبك واستلامه، سيتم إضافة نسبة من قيمة مشترياتك تلقائيا
              إلى محفظتك . داخل التطبيق
            </li>
            <li style={{ marginBottom: "7px" }}>
              يمكنك استخدام رصيد الكاش باك لشراء أي منتجات داخل التطبيق فقط، ولا
              يمكن سحبه .نقدا
            </li>
            <li style={{ marginBottom: "7px" }}>
              الرصيد صالح لفترة محددة، وبعد انتهاء هذه الفترة يتم إلغاؤه تلقائيا
            </li>
            <li style={{ marginBottom: "7px", fontWeight: "bold" }}>
              شروط مهمة للحصول على الكاش باك
            </li>

            <li style={{ marginBottom: "7px" }}>
              قد تحتاج إلى الوصول إلى حد أدنى لقيمة السلة الشرائية لتفعيل الكاش
              باك، وسيتم توضيحه أثناء العروض أو الحملات
            </li>

            <li style={{ marginBottom: "7px" }}>
              الكاش باك يمنح فقط عند الشراء من أقسام محددة داخل التطبيق، حسب ما
              يعلن خلال العروض.
            </li>
            <li style={{ marginBottom: "7px" }}>
              الطلبات الملغاة أو المرتجعة لا يحتسب عليها الكاش باك
            </li>

            <li style={{ marginBottom: "7px" }}>
              تحتفظ إدارة اطلبها بحق تعديل أو إيقاف برنامج الكاش باك في أي وقت
              دون إشعار مسبق.{" "}
            </li>
            <li style={{ marginBottom: "7px" }}>
              الرصيد يضاف في أقرب وقت بعد تأكيد التسليم، ويمكنك دائما مراجعة
              رصيدك وتاريخه داخل التطبيق .
            </li>

            <li style={{ marginBottom: "7px" }}>
              الاستخدام العادل أي محاولة لاستغلال الكاش باك بطريقة غير قانونية
              قد تؤدي إلى إلغاء .الرصيد{" "}
            </li>
            <li style={{ marginBottom: "7px" }}>
              العروض الخاصة بالكاش باك قد تشمل شروط إضافية، وسيتم توضيحها في كل
              حملة{" "}
            </li>
          </ul>
        </Box>
      </Box>
    </div>
  );
}

export default TermsConditionsData;
