import React, { useState, useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { withStyles } from "@material-ui/core/styles";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import InputAdornment from "@material-ui/core/InputAdornment";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import TextField from "@material-ui/core/TextField";
import { IconButton } from "@material-ui/core";
import ClearIcon from "@material-ui/icons/Clear";
import Dialog from "@material-ui/core/Dialog";

const CssTextField = withStyles({
  root: {
    "& label.Mui-focused": {
      color: "green",
    },
    "& .MuiInput-underline:after": {
      borderBottomColor: "green",
    },
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "red",
      },
      "&.Mui-focused fieldset": {
        borderColor: "rgba(0, 176, 246, 1)",
      },
    },
  },
})(TextField);

const useStyles = makeStyles((theme) => ({
  test: {
    border: "1px solid red",
  },

  paper: {
    overflowY: "unset",
  },

  button: {
    color: "rgba(29, 99, 249, 1)",
    fontSize: "11pt",
  },

  cancelIcon: {
    position: "absolute",
    right: "-10px",
    top: "-10px",
    width: "25px",
    height: "25px",
    backgroundColor: "red",
    color: "white",
  },
}));

function CustomDialog(props) {
  const classes = useStyles();
  const { codeListData, open, onClose } = props;
  const [keyWord, setKeyWord] = useState("");

  const handleClose = () => {
    onClose("exit", "exit");
  };

  const handleListItemClick = (codeName, codeCd) => {
    onClose(codeName, codeCd);
  };

  const handleChange = (e) => {
    setKeyWord(e.target.value);
  };

  const filteredList = codeListData.filter(
    (data) => data.CODE_NAME.indexOf(keyWord) !== -1
  );

  const inputRef = useRef();

  const RefhandleClear = () => {
    setKeyWord("");
    inputRef.current.focus();
  };

  return (
    <>
      <Dialog
        onClose={handleClose}
        open={open}
        fullWidth
        classes={{ paper: classes.paper }}
      >
        <IconButton
          className={classes.cancelIcon}
          onClick={() => handleClose()}
        >
          <ClearIcon />
        </IconButton>
        <DialogTitle>
          <CssTextField
            variant="outlined"
            size="small"
            fullWidth
            onChange={handleChange}
            value={keyWord}
            autoFocus
            placeholder="검색"
            InputProps={{
              endAdornment: keyWord.length > 0 && (
                <InputAdornment onClick={() => RefhandleClear()} position="end">
                  <IconButton edge="end">
                    <ClearIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </DialogTitle>
        <DialogContent dividers className={"customDialog"}>
          <div>
            {filteredList.length > 0 ? (
              filteredList.map((listData) => (
                <ListItem
                  key={listData.CODE_CD}
                  button
                  onClick={() =>
                    handleListItemClick(listData.CODE_NAME, listData.CODE_CD)
                  }
                >
                  <ListItemText primary={listData.CODE_NAME} />
                </ListItem>
              ))
            ) : (
              <div>
                {codeListData.map((listData, index) => (
                  <ListItem key={index} />
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default CustomDialog;
