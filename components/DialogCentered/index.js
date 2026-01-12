import * as React from "react";
import {
  Box,
  Slide,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  DialogContentText,
  IconButton,
  Button,
  SwipeableDrawer,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useRouter } from "next/router";
import { makeStyles } from "@mui/styles";
import useScreenSize from "@/constants/screenSize/useScreenSize";
import SharedBtn from "../shared/SharedBtn";

const useStyles = makeStyles(({ isMobile }) => ({
  centerDesign: {
    bottom: "0px",
    minWidth: "60vw",
    maxHeight: "60vh",
    minHeight: "fit-content",
    margin: "auto",
    borderRadius: "10px !important",
  },
  paperMobile: {
    minHeight: "30vh",
    maxHeight: "85vh !important",
    borderTopLeftRadius: "20px",
    borderTopRightRadius: "20px",
  },
  title: {
    display: "flex",
    alignItems: "center",
    fontSize: isMobile ? "20px" : "20px",
    fontWeight: isMobile ? "700" : "500",
  },
  dragHandle: {
    width: 60,
    height: 6,
    backgroundColor: "#D9D9D9",
    borderRadius: 3,
    margin: "8px auto",
  },
}));

function DialogCentered({
  open = true,
  setOpen,
  showTitle = true,
  hasCloseIcon = false,
  title = "Title Dialog",
  subtitle = false,
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
  const classes = useStyles();

  const handleClose = () => {
    setOpen(false);
    actionsWhenClose();
    closeAction();
  };

  /* =======================
     MOBILE → SwipeableDrawer
     ======================= */
  if (isMobile) {
    return (
      <SwipeableDrawer
        anchor="bottom"
        open={open}
        onClose={handleClose}
        onOpen={() => setOpen(true)}
        PaperProps={{
          className: `${classes.paperMobile} ${customClass}`,
        }}
        disableBackdropTransition={false}
        disableDiscovery={false}
      >
        {/* Drag Handle */}
        <Box className={classes.dragHandle} />

        {/* Title */}
        {showTitle && (
          <Box px={2} pb={1}>
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
                  aria-label="close"
                  onClick={handleClose}
                >
                  <CloseIcon />
                </IconButton>
              )}
            </Box>
            {subtitle && <Box mt={1}>{subtitle}</Box>}
          </Box>
        )}

        {/* Content */}
        <Box px={2} pb={2}>
          {content}
        </Box>

        {/* Actions */}
        {showBtns ? (
          <Box px={2} pb={2} display="flex" gap={2}>
            <SharedBtn
              text={cancelBtnText}
              className="big-main-btn"
              onClick={handleClose}
            />
            <Button onClick={() => {}}>{saveBtnText}</Button>
          </Box>
        ) : (
          <Box px={2} pb={2}>
            {renderCustomBtns}
          </Box>
        )}
      </SwipeableDrawer>
    );
  }

  /* =====================
     DESKTOP → Dialog
     ===================== */
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      classes={{ paper: `${classes.centerDesign} ${customClass}` }}
      keepMounted
    >
      {showTitle && (
        <DialogTitle>
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
                aria-label="close"
                onClick={handleClose}
              >
                <CloseIcon />
              </IconButton>
            )}
          </Box>
          {subtitle && <Box mt={1}>{subtitle}</Box>}
        </DialogTitle>
      )}

      <DialogContent>
        <DialogContentText>{content}</DialogContentText>
      </DialogContent>

      {showBtns ? (
        <DialogActions>
          <SharedBtn
            text={cancelBtnText}
            className="big-main-btn"
            onClick={handleClose}
          />
          <Button onClick={() => {}}>{saveBtnText}</Button>
        </DialogActions>
      ) : (
        <DialogActions>{renderCustomBtns}</DialogActions>
      )}
    </Dialog>
  );
}

export default DialogCentered;
