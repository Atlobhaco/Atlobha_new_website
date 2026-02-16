import SharedBtn from "@/components/shared/SharedBtn";
import SharedCheckbox from "@/components/shared/SharedCheckbox";
import { ASNWERS, DAILY_QUESTION, TRIVIA } from "@/config/endPoints/endPoints";
import useScreenSize from "@/constants/screenSize/useScreenSize";
import { Box, CircularProgress } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function Competition() {
  const router = useRouter();
  const { mobileScreen, customScreens, token } = router.query;
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const { isMobile } = useScreenSize();
  const [questionRes, setQuestionRes] = useState(null);
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    // Only fetch if we have a token
    if (token && router.isReady) {
      const fetchQuestions = async () => {
        setLoader(true);
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}${TRIVIA}${DAILY_QUESTION}`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
                "x-api-key": "ios123",
              },
            },
          );

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();
          setQuestionRes(data?.data);
        } catch (err) {
          console.error("Error fetching questions:", err);
        } finally {
          setLoader(false);
        }
      };

      fetchQuestions();
    }
  }, [router.isReady]);

  /* -------------------------------------------------------------------------- */
  /*                     endpoint to submit answer for user                     */
  /* -------------------------------------------------------------------------- */
  const submitAnswer = async () => {
    setLoader(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}${TRIVIA}${ASNWERS}`,
        {
          method: "POST",
          body: JSON.stringify({
            question_key: questionRes?.question_key,
            choice_key: selectedAnswer,
          }),
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            "x-api-key": "ios123",
          },
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      toast.success("شكرًا لمشاركتك في مسابقة رمضان 🌙✨");
      setSelectedAnswer(null);
    } catch (err) {
      console.error("Error fetching questions:", err);
    } finally {
      setLoader(false);
    }
  };

  if (!token && !questionRes) {
    return <h2 className="text-center mt-5">قم بتسجيل الدخول</h2>;
  }

  return (
    <Box
      sx={{
        background: "#fff5ef",
        height: isMobile ? "100vh" : "",
      }}
    >
      <Box
        sx={{
          backgroundImage: `url("/imgs/ramadan-pattern.svg")`,
          width: "100%",
          height: "220px",
          position: "relative",
        }}
      >
        <Box
          sx={{
            background: "#ffffff",
            width: "100%",
            height: "100%",
            opacity: "0.5",
            position: "absolute",
            zIndex: "0",
          }}
        ></Box>
        <Box
          sx={{
            zIndex: "1",
            position: "relative",
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            gap: "6px",
            pt: 2,
          }}
        >
          <Image
            loading="lazy"
            alt="logo"
            width={130}
            height={49}
            src="/logo/atlobha-ar-en.svg"
          />
          <Image
            loading="lazy"
            alt="logo"
            width={130}
            height={49}
            src="/imgs/theme-ramadan.png"
            style={{
              width: "45%",
            }}
          />
          <Box
            sx={{
              color: "#6B7280",
              fontWeight: "500",
              fontSize: "20px",
              mt: 1,
            }}
          >
            اختبر معلوماتك عن رمضان
          </Box>
          <Box
            sx={{
              color: "#EB3C24",
              fontWeight: "500",
              fontSize: "23px",
              mt: 1,
            }}
          >
            تحدي رمضان
          </Box>
        </Box>
      </Box>
      <Box
        sx={{
          background: "#fff5ef",
          padding: "30px 24px",
        }}
      >
        <Box
          sx={{
            background: "#fff",
            borderRadius: "24px",
            border: "1px solid #F4F4F4",
            boxShadow:
              "0 10px 15px -3px rgba(0, 0, 0, 0.10), 0 4px 6px -4px rgba(0, 0, 0, 0.10)",
            padding: "25px 35px 25px 25px",
            display: "flex",
            gap: "10px",
            flexDirection: "column",
            alignItems: "flex-end",
            mb: 3,
          }}
        >
          <Box
            sx={{
              background:
                "linear-gradient(90deg, rgba(255, 212, 0, 0.20) 0%, rgba(249, 221, 75, 0.20) 100%)",
              border: "1px solid rgba(255, 212, 0, 0.30)",
              borderRadius: "16px",
              width: "fit-content",
              padding: "7px 13px",
              fontWeight: "500",
              fontSize: "12px",
              color: "#232323",
            }}
          >
            سؤال اليوم
            <Image
              src="/imgs/question-red.svg"
              alt="question"
              width={16}
              height={16}
              style={{
                margin: "0px 3px",
              }}
            />
          </Box>
          <Box
            sx={{
              fontSize: "20px",
              fontWeight: "700",
              width: "100%",
            }}
          >
            {questionRes?.question}
          </Box>
        </Box>
        {questionRes?.choices?.map((data, index) => (
          <Box
            sx={{
              padding: "18px 28px 18px 18px",
              border: "2px solid #E6E6E6",
              borderRadius: "16px",
              background: "#FFF",
              display: "flex",
              justifyContent: "space-between",
              color: "#6B7280",
              fontSize: "16px",
              mt: 3,
              cursor: "pointer",
            }}
            onClick={() => setSelectedAnswer(data?.key)}
          >
            <Box
              sx={{
                display: "flex",
                gap: "12px",
                alignItems: "center",
              }}
            >
              <Box
                sx={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  background: "#F4F4F4",
                  fontSize: "16px",
                  fontWeight: "700",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  pt: 0.5,
                }}
              >
                {index + 1}
              </Box>
              <Box
                sx={{
                  fontWeight: "400",
                }}
              >
                {data?.text}
              </Box>
            </Box>
            <SharedCheckbox
              selectedId={selectedAnswer}
              handleCheckboxChange={() => setSelectedAnswer(data?.key)}
              data={{ id: data?.key }}
            />
          </Box>
        ))}

        <SharedBtn
          className="big-main-btn"
          customClass="w-100 mt-3 mb-4"
          disabled={!selectedAnswer || loader}
          replaceText="إرسال الإجابة"
          onClick={() => submitAnswer()}
          comAfterText={
            loader && (
              <CircularProgress
                sx={{
                  color: "#000",
                  mx: 1,
                }}
                size={12}
              />
            )
          }
        />
      </Box>
    </Box>
  );
}
