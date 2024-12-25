import * as React from "react";
import { Box, Slide } from "@mui/material";
import { useRouter } from "next/router";
import { makeStyles } from "@mui/styles";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import useScreenSize from "@/constants/screenSize/useScreenSize";

const Transition = React.forwardRef(function Transition(props, ref) {
  const { locale } = useRouter();
  const { isMobile } = useScreenSize();

  return (
    <Slide
      direction={isMobile ? "up" : locale === "ar" ? "left" : "right"}
      ref={ref}
      {...props}
    />
  );
});

const reverseTransition = React.forwardRef(function Transition(props, ref) {
  const { locale } = useRouter();
  const { isMobile } = useScreenSize();

  return (
    <Slide
      direction={isMobile ? "up" : locale === "ar" ? "right" : "left"}
      ref={ref}
      {...props}
    />
  );
});
const CustomTransitionUp = React.forwardRef(function Transition(props, ref) {
  return <Slide direction={"up"} ref={ref} {...props} />;
});

const useStyles = makeStyles((isMobile) => ({
  paperEn: {
    position: "absolute !important",
    bottom: "0px",
    width: "30vw",
    minHeight: "100vh",
    left: "0px",
    margin: "unset !important",
  },
  paperAr: {
    position: "absolute !important",
    bottom: "0px",
    width: "30vw",
    minHeight: "100vh",
    right: "0px",
    margin: "unset !important",
  },
  paperMobile: {
    position: "absolute !important",
    bottom: "0px",
    minWidth: "100vw",
    maxHeight: "90vh !important",
    minHeight: "30vh",
    left: "0",
    right: "0",
    margin: "auto 0 !important",
    borderTopLeftRadius: "20px !important",
    borderTopRightRadius: "20px !important",
  },
  container: {
    display: "flex",
    flexDirection: "column",
    position: "relative",
  },
  title: {
    display: "flex",
    alignItems: "center",
    fontSize: isMobile ? "20px" : "20px",
    fontWeight: isMobile ? "700" : "500",
  },
  subTitle: {
    fontSize: isMobile ? "1.2rem" : "16rem",
    fontWeight: "500",
  },
}));
function DialogMultiDirection({
  open = true,
  setOpen,
  title = "Title Dialog",
  subtitle = "subtitle here",
  appearTitleAndSub = true,
  customHeaders = <div>header cutome</div>,
  content = <div>put your content here</div>,
  showBtns = false,
  cancelBtnText = "cancel",
  saveBtnText = "save",
  closeAction = () => {},
  customClass = "",
  slideFnUp = null,
  hasCloseIcon = true,
  customTransition = false,
}) {
  const { isMobile } = useScreenSize();
  const classes = useStyles(isMobile);
  const { locale } = useRouter();

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Dialog
      classes={{
        paper: `${customClass} ${
          isMobile
            ? classes.paperMobile
            : locale === "ar"
            ? classes.paperAr
            : classes.paperEn
        }`,
      }}
      open={open}
      TransitionComponent={
        customTransition
          ? reverseTransition
          : slideFnUp
          ? CustomTransitionUp
          : Transition
      }
      keepMounted
      onClose={() => {
        handleClose();
        closeAction();
      }}
      aria-describedby="general-dialog"
    >
      {appearTitleAndSub ? (
        <DialogTitle
          sx={{
            padding: !title ? "5px 24px" : "16px 24px",
          }}
          className={classes.container}
        >
          <Box
            className={classes.title}
            sx={{
              justifyContent: !title ? "flex-end" : "space-between",
            }}
          >
            {title}
            {hasCloseIcon && (
              <IconButton
                edge="end"
                color="inherit"
                className={classes.closeButton}
                onClick={() => {
                  handleClose();
                  closeAction();
                }}
                aria-label="close"
              >
                <CloseIcon />
              </IconButton>
            )}
          </Box>
          {subtitle && <div className={classes.subTitle}>{subtitle}</div>}
        </DialogTitle>
      ) : (
        <DialogTitle className={`${classes.container} border-bottom mb-3`}>
          <div className={classes.title}>
            {customHeaders}
            <IconButton
              edge="end"
              color="inherit"
              className={classes.closeButton}
              onClick={() => {
                handleClose();
                closeAction();
              }}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
          </div>
        </DialogTitle>
      )}
      <DialogContent>
        <DialogContentText id="general-dialog">{content}</DialogContentText>
      </DialogContent>
      {showBtns && (
        <DialogActions>
          <Button
            onClick={() => {
              handleClose();
              closeAction();
            }}
          >
            {cancelBtnText}
          </Button>
          <Button onClick={() => {}}>{saveBtnText}</Button>
        </DialogActions>
      )}
    </Dialog>
  );
}

export default DialogMultiDirection;
