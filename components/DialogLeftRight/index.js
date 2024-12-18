import * as React from "react";
import { Slide } from "@mui/material";
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

  return <Slide direction={"up"} ref={ref} {...props} />;
});

const useStyles = makeStyles((isMobile) => ({
  paperMobile: {
    bottom: "0px",
    minWidth: "40vw",
    maxHeight: "70vh !important",
    minHeight: "30vh",
    left: "0",
    right: "0",
    margin: "auto 0 !important",
    borderRadius: "10px !important",
	position:'absolut !important'
  },
  container: {
    display: "flex",
    flexDirection: "column",
    position: "relative",
  },
  title: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    fontSize: isMobile ? "1.8rem" : "2.1rem",
    fontWeight: "700",
  },
  subTitle: {
    fontSize: isMobile ? "1.2rem" : "1.4rem",
    fontSize: "1.4rem",
    fontWeight: "700",
  },
}));
function DialogLeftRight({
  open = true,
  setOpen,
  showTitle = true,
  title = "Title Dialog",
  subtitle = "subtitle here",
  content = <div>put your content here</div>,
  showBtns = false,
  cancelBtnText = "cancel",
  saveBtnText = "save",
  closeAction = () => {},
  customClass = "",
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
        paper: `${customClass} ${classes.paperMobile}`,
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
      {showTitle && (
        <DialogTitle className={classes.container}>
          <div className={classes.title}>
            {title}
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
          {subtitle && <div className={classes.subTitle}>{subtitle}</div>}
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

export default DialogLeftRight;
