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
import SharedBtn from "../shared/SharedBtn";

const Transition = React.forwardRef(function Transition(props, ref) {
  const { locale } = useRouter();
  const { isMobile } = useScreenSize();

  return <Slide direction={"up"} ref={ref} {...props} />;
});

const useStyles = makeStyles(({ isMobile, title }) => ({
  centerDesign: {
    bottom: "0px",
    minWidth: "60vw",
    maxHeight: "90vh !important",
    minHeight: "72vh",
    left: "0",
    right: "0",
    margin: "auto 0",
    borderRadius: "10px !important",
  },
  paperMobile: {
    position: "absolute !important",
    bottom: "0px",
    minWidth: "100vw",
    maxHeight: "90vh !important",
    minHeight: "50vh",
    left: "0",
    right: "0",
    margin: "auto 0 !important",
    borderTopLeftRadius: "20px !important",
    borderTopRightRadius: "20px !important",
  },
  container: (props) => ({
    display: "flex",
    flexDirection: "column",
    position: "relative",
    // padding: ,
  }),
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
function DialogCentered({
  open = true,
  setOpen,
  showTitle = true,
  hasCloseIcon = false,
  title = "Title Dialog",
  subtitle = "subtitle here",
  content = <div>put your content here</div>,
  showBtns = false,
  cancelBtnText = "cancel",
  saveBtnText = "save",
  closeAction = () => {},
  customClass = "",
  renderCustomBtns = <></>,
  actionsWhenClose = () => {},
}) {
  const { isMobile } = useScreenSize();
  const classes = useStyles({ isMobile, title });
  const { locale, t } = useRouter();

  const handleClose = () => {
    setOpen(false);
    actionsWhenClose();
  };

  return (
    <Dialog
      classes={{
        paper: `${
          isMobile ? classes.paperMobile : classes.centerDesign
        } ${customClass}`,
      }}
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={() => {
        handleClose();
        closeAction();
      }}
      aria-describedby="general-dialog"
    >
      {isMobile && (
        <Box className="d-flex align-items-center justify-content-center">
          <Box
            sx={{
              width: "60px",
              height: "5px",
              background: "#D9D9D9",
              borderRadius: "10px",
              borderRadius: "8px",
              marginTop: "5px",
            }}
          ></Box>
        </Box>
      )}
      {showTitle && (
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
      )}

      <DialogContent>
        <DialogContentText id="general-dialog">{content}</DialogContentText>
      </DialogContent>
      {showBtns ? (
        <DialogActions>
          <SharedBtn
            text="vinNumHint"
            className="big-main-btn"
            onClick={() => {
              handleClose();
              closeAction();
            }}
          >
            {cancelBtnText}
          </SharedBtn>
          <Button onClick={() => {}}>{saveBtnText}</Button>
        </DialogActions>
      ) : (
        <DialogActions>{renderCustomBtns}</DialogActions>
      )}
    </Dialog>
  );
}

export default DialogCentered;
