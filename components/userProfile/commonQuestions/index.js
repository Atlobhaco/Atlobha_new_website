import useLocalization from "@/config/hooks/useLocalization";
import React, { useState } from "react";
import style from "../../../pages/userProfile/commonQuestions/commonQuestions.module.scss";
import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import SharedBtn from "@/components/shared/SharedBtn";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Image from "next/image";
import useScreenSize from "@/constants/screenSize/useScreenSize";

function Questions() {
  const { t } = useLocalization();
  const { isMobile } = useScreenSize();
  const [expanded, setExpanded] = useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const pageContent = [
    {
      question: t.questions.q1,
      answer: t.questions.a1,
    },
    {
      question: t.questions.q2,
      answer: t.questions.a2,
    },
    {
      question: t.questions.q3,
      answer: t.questions.a3,
    },
    {
      question: t.questions.q4,
      answer: t.questions.a4,
    },
  ];

  return (
    <div className="row mb-4 mt-3">
      <div className="col-12 mb-4">
        <div className={`${style["how-to-help"]}`}>
          <div className={`${style["how-to-help_title"]}`}>{t.howHelpYou}</div>
          <div className={`${style["how-to-help_sub-title"]}`}>
            {t.someQuestions}
          </div>
        </div>
      </div>

      <div className="col-12">
        {pageContent?.map((content, index) => (
          <Accordion
            key={content?.question}
            expanded={expanded === `panel${index}`}
            onChange={handleChange(`panel${index}`)}
            className={`${style["accordion"]}`}
            sx={{
              "&:hover": {
                opacity: expanded === `panel${index}` && 1,
              },
            }}
          >
            <AccordionSummary
              expandIcon={
                <ExpandMoreIcon
                  sx={{
                    color: expanded === `panel${index}` ? "#FFD400" : "#99A1AF", // yellow when open
                    transition: "0.3s",
                  }}
                />
              }
              aria-controls="panel1-content"
              id="panel1-header"
            >
              <div className={`${style["accordion_question"]}`}>
                {content?.question}
              </div>
            </AccordionSummary>
            <AccordionDetails
              className={style["accordion_answer"]}
              dangerouslySetInnerHTML={{ __html: content?.answer }}
            />
          </Accordion>
        ))}
      </div>

      <div className="col-12">
        <div className={`${style["communicate"]}`}>
          <Image
            src="/imgs/question.png"
            alt="img"
            width={isMobile ? 66 : 84}
            height={isMobile ? 66 : 84}
          />
          <div className={`${style["communicate_title"]}`}>
            {t.dontFindAnswer}
          </div>
          <div className={`${style["communicate_sub-title"]}`}>
            {t.communicateWithSupport}
          </div>
          <SharedBtn
            className="big-main-btn"
            customClass="w-100"
            text="callSupport"
            onClick={() => {
              window.open(
                `https://api.whatsapp.com/send/?phone=966502670094&text&type=phone_number&app_absent=0`,
                "_blank",
                "noopener,noreferrer"
              );
              window.webengage.onReady(() => {
                webengage.track("CUSTOMER_SUPPORT_CLICKED", {
                  event_status: true,
                });
              });
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default Questions;
