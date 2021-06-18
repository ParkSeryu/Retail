import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

export default function CustomAlertDialog(props) {
  const { open, handleClickAgree, handleClickDisagree } = props;

  const handleClickOpen = () => {
    handleClickAgree();
  };

  const handleClose = () => {
    handleClickDisagree();
  };

  return (
    <div>
      <Dialog
        open={open}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"로그인하시겠습니까?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            다른 기기에 로그인 되어있는 ID 입니다. 해당 기기로 접속하시겠습니까?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            color="primary"
            onClick={() => {
              handleClose();
            }}
          >
            취소
          </Button>
          <Button
            color="primary"
            onClick={() => {
              handleClickOpen();
            }}
          >
            확인
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
