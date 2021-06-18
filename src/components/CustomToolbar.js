import React, { useState, useEffect } from "react";
import PickerToolbar from "@material-ui/pickers/_shared/PickerToolbar";
import { makeStyles } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";

const CssTextField = withStyles({
  root: {
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        border: "3px solid rgba(0, 176, 246, 1)",
      },
      "&.Mui-focused fieldset": {
        border: "3px solid rgba(0, 176, 246, 1)",
      },
    },
  },
})(TextField);

const useStyles = makeStyles({
  toolbar: {
    //backgroundColor: "lightgray",
    backgroundColor: "#FFFFFF",
    height: "35%",
    // margin: 0,
    // padding: 0,
  },

  root: {
    width: "100%",
    marginTop: "10px",
  },

  test: {
    float: "right",
  },

  yearSelectionBox: {
    position: "absolute",
    zIndex: 5,
    width: "85px",
    top: "127%",
    left: "26.5%",
  },

  monthSelectionBox: {
    position: "absolute",
    zIndex: 5,
    width: "55px",
    top: "127%",
    left: "58.5%",
  },

  textFieldMarginRight: {
    width: "135px",
    marginRight: "8px",
  },

  textField: {
    width: "135px",
  },
});

const StringToDate = (date_str) => {
  let yyyyMMdd = String(date_str);
  let sYear = yyyyMMdd.substring(0, 4);
  let sMonth = yyyyMMdd.substring(5, 7);
  let sDate = yyyyMMdd.substring(8, 10);

  return new Date(Number(sYear), Number(sMonth) - 1, Number(sDate));
};

const DateToString = (date) => {
  let year = date.getFullYear();
  let month = 1 + date.getMonth();
  month = month >= 10 ? month : "0" + month;
  let day = date.getDate();
  day = day >= 10 ? day : "0" + day;
  return year + "/" + month + "/" + day;
};

function CustomToolbar(props) {
  const classes = useStyles();
  const { date, setOpenView, onChange, openView } = props;
  const [date_f, setDateFrom] = useState(
    window.sessionStorage.getItem("date_f")
  );
  const [date_t, setDateTo] = useState(window.sessionStorage.getItem("date_t"));
  const [focus, setFocus] = useState("date_f");
  const [count, setCount] = useState(0);

  const handleChangeViewClick = (view) => (e) => {
    setOpenView(view);
  };

  const handleFocus = (type) => {
    setCount(0);
    if (type === "date_f") {
      setFocus("date_f");
      if (date_f !== "") {
        onChange(StringToDate(date_f));
      }
    } else if (type === "date_t") {
      setFocus("date_t");
      if (date_t !== "") onChange(StringToDate(date_t));
    }
  };

  useEffect(() => {
    if (!window.sessionStorage.getItem("acceptFlag") && openView === "date") {
      if (focus === "date_f") {
        window.sessionStorage.setItem("date_f", DateToString(date));
        setDateFrom(DateToString(date));
        setCount(count + 1);
        if (count !== 0) {
          setFocus("date_t");
          setCount(0);
        }
      } else if (focus === "date_t") {
        if (StringToDate(window.sessionStorage.getItem("date_f")) > date) {
          alert("종료일은 시작일 이전에 설정할 수 없습니다.");
          onChange(StringToDate(date_f));
        } else {
          window.sessionStorage.setItem("date_t", DateToString(date));
          setDateTo(DateToString(date));
        }
      }
    } else {
      setCount(0);
      window.sessionStorage.removeItem("acceptFlag");
    }
  }, [date, openView]);

  return (
    <PickerToolbar className={classes.toolbar}>
      <div className={classes.root}>
        {openView === "date" && (
          <>
            <div
              className={classes.yearSelectionBox}
              onClick={handleChangeViewClick("year")}
            >
              <ArrowDropDownIcon className={classes.test} />
            </div>
            <div
              className={classes.monthSelectionBox}
              onClick={handleChangeViewClick("month")}
            >
              <ArrowDropDownIcon className={classes.test} />
            </div>
          </>
        )}
        {focus === "date_f" ? (
          <CssTextField
            className={classes.textFieldMarginRight}
            name="date_f"
            size="small"
            label="시작일"
            onClick={() => handleFocus("date_f")}
            value={date_f}
            variant="outlined"
            InputProps={{
              readOnly: true,
            }}
          />
        ) : (
          <TextField
            className={classes.textFieldMarginRight}
            name="date_f"
            size="small"
            label="시작일"
            onClick={() => handleFocus("date_f")}
            value={date_f}
            variant="outlined"
            InputProps={{
              readOnly: true,
            }}
          />
        )}

        {focus === "date_t" ? (
          <CssTextField
            className={classes.textField}
            name="date_t"
            size="small"
            label="종료일"
            onClick={() => handleFocus("date_t")}
            value={date_t}
            variant="outlined"
            InputProps={{
              readOnly: true,
            }}
          />
        ) : (
          <TextField
            className={classes.textField}
            name="date_t"
            size="small"
            label="종료일"
            onClick={() => handleFocus("date_t")}
            value={date_t}
            variant="outlined"
            InputProps={{
              readOnly: true,
            }}
          />
        )}
      </div>
    </PickerToolbar>
  );
}

export default CustomToolbar;
