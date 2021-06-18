import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Container from "@material-ui/core/Container";
import TextField from "@material-ui/core/TextField";
import { withRouter } from "react-router-dom";
import Button from "@material-ui/core/Button";
import CustomDialog from "../../components/CustomDialog";
import IconButton from "@material-ui/core/IconButton";
import ClearIcon from "@material-ui/icons/Clear";
import format from "date-fns/format";
import koLocale from "date-fns/locale/ko";
import DateFnsUtils from "@date-io/date-fns";
import { MuiPickersUtilsProvider, DatePicker } from "@material-ui/pickers";
import { withStyles } from "@material-ui/core/styles";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Divider from "@material-ui/core/Divider";
import MenuItem from "@material-ui/core/MenuItem";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import MenuIcon from "@material-ui/icons/Menu";
import SearchIcon from "@material-ui/icons/Search";
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import { Typography } from "@material-ui/core";
import axios from "axios";
import Drawer from "@material-ui/core/Drawer";
import CloseIcon from "@material-ui/icons/Close";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import CustomToolbar from "../../components/CustomToolbar";

const CssTextField = withStyles({
  root: {
    "& label.Mui-focused": {
      color: "#ABADB3",
    },
    "& .MuiInput-underline:after": {
      borderBottomColor: "green",
    },
    "& .MuiOutlinedInput-root": {
      "& fieldset": { color: "#ABADB3" },
      "&.Mui-focused fieldset": {
        borderColor: "rgba(0, 176, 246, 1)",
      },
    },
  },
})(TextField);

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100vw", // Fix IE 11 issue.
    marginTop: theme.spacing(8),
  },

  AppBar: {
    backgroundColor: "#DADCE0",
    color: "#000000",
    height: "55px",
  },

  menuButton: {
    marginTop: "5px",
    marginRight: theme.spacing(2),
  },

  title: {
    flexGrow: 1,
    fontFamily: "NanumGothic",
    marginTop: "5px",
  },

  menuInform: {
    position: "fixed",
    zIndex: 2,
    backgroundColor: "rgba(52, 73, 94, 1)",
    width: "65vw",
  },

  line: {
    marginBottom: "125px",
  },

  primaryText: {
    color: "#FFFFFF",
    marginTop: "15px",
  },

  secondaryText: {
    color: "#FFFFFF",
  },

  backIcon: { flaot: "right", color: "#FFFFFF" },

  closeIcon: {
    position: "absolute",
    right: "5px",
    top: "5px",
    color: "#FFFFFF",
  },

  logOutIcon: { float: "right", color: "#FFFFFF", marginRight: "1px" },

  logOut: {
    float: "right",
    color: "#FFFFFF",
  },

  menuItem: {
    zIndex: 1,
    fontFamily: "NanumGothic",
    width: "65vw",
  },

  span: { lineHeight: "40px" },

  table: {
    width: "100%",
    borderCollapse: "separate",
    borderSpacing: "0 5px",
    marginLeft: "-10px",
  },

  clearIcon: {
    position: "relative",
    float: "right",
    top: "-43px",
    left: "-1px",
    marginBottom: "-50px",
    zIndex: 2,
  },

  button: {
    textAlign: "center",
    marginTop: theme.spacing(1),
    marginLeft: "2vw",
  },

  clearButton: {
    borderRadius: "5em",
    marginRight: "2vw",
    width: "30%",
    fontFamily: "NanumGothic",
    fontSize: "16px",
    backgroundColor: "#6E7277",
    color: "#FFFFFF",
    "&:focus": {
      backgroundColor: "#6E7277",
    },
  },

  retrieveButton: {
    borderRadius: "5em",
    fontFamily: "NanumGothic",
    width: "30%",
    fontSize: "16px",
    backgroundColor: "#67B7D9",
    color: "#FFFFFF",
    "&:focus": {
      backgroundColor: "#67B7D9",
    },
  },

  datePicker: {
    visibility: "hidden",
  },
}));

class koLocalizedUtils extends DateFnsUtils {
  getCalendarHeaderText(date) {
    return format(date, "yyyy년　　 MM월", { locale: this.locale });
  }
}

function Sales_pr0501r_Search({
  history,
  programName,
  parentState,
  useSearch,
  openSearchToggle,
}) {
  const classes = useStyles();
  let today = new Date();
  let year = today.getFullYear();
  let month = ("0" + (1 + today.getMonth())).slice(-2);
  let date = ("0" + today.getDate()).slice(-2);

  window.addEventListener("checkBackFlag", funCheckFlag, {
    once: true,
  });

  function funCheckFlag() {
    let count = 0;
    if (count === 0)
      if (toggle) {
        setToggle(false);
        console.log("toggle");
        count = count + 1;
      }
    if (openDialog) {
      setOpenDialog(false);
      console.log("dialog");
      count = count + 1;
    }
    if (openCalendar) {
      setOpenCalendar(false);
      console.log("calendar");
      count = count + 1;
    }
    window.sessionStorage.setItem("closeFlag", count);
  }

  const [inputs, setInputs] = useState({
    date_f: "",
    date_t: "",
    sell_cust_cd: "",
    sell_cust_name: "",
    group_cd: "",
    group_name: "",
    class_cd: "",
    class_name: "",
    product_cd: "",
    product_name: "",
  });
  const {
    date_f,
    date_t,
    sell_cust_name,
    group_name,
    class_name,
    product_name,
  } = inputs;

  const list = JSON.parse(window.sessionStorage.getItem("program_list"));
  const [codeListData, setCodeListData] = React.useState([]);
  const [codeKind, setCodeKind] = React.useState("");
  const [toggle, setToggle] = useState(false);
  const [openSearch, setOpenSearch] = React.useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [openCalendar, setOpenCalendar] = React.useState(false);

  const handleOnChange = (e) => {
    const { value, name } = e.target;
    setInputs({
      ...inputs,
      [name]: value,
    });
  };

  const handleDateChange = (date) => {
    setInputs({
      ...inputs,
      date_f: window.sessionStorage.getItem("date_f"),
      date_t: window.sessionStorage.getItem("date_t"),
    });
  };

  const handleClickOpen = (code_kind) => {
    setCodeKind(code_kind);
    if (code_kind === "date") {
      setOpenCalendar(!openCalendar);
    } else {
      if (code_kind === "sell_cust") {
        setCodeListData(
          JSON.parse(window.sessionStorage.getItem("sell_cust_list"))
        );
      } else if (code_kind === "gc") {
        setCodeListData(
          JSON.parse(window.sessionStorage.getItem("group_list"))
        );
      } else if (code_kind === "cc") {
        setCodeListData(
          JSON.parse(window.sessionStorage.getItem("class_list"))
        );
      } else if (code_kind === "pc") {
        setCodeListData(
          JSON.parse(window.sessionStorage.getItem("product_list"))
        );
      }
      setOpenDialog(true);
    }
  };

  const handleClose = (codeName, codeCd) => {
    setOpenDialog(false);
    if (codeCd === undefined) {
      codeName = "";
      codeCd = "";
    }
    if (codeName !== "exit") {
      if (codeKind === "sell_cust") {
        setInputs({
          ...inputs,
          sell_cust_cd: codeCd,
          sell_cust_name: codeName,
        });
      } else if (codeKind === "gc") {
        setInputs({ ...inputs, group_cd: codeCd, group_name: codeName });
      } else if (codeKind === "cc") {
        setInputs({ ...inputs, class_cd: codeCd, class_name: codeName });
      } else if (codeKind === "pc") {
        setInputs({ ...inputs, product_cd: codeCd, product_name: codeName });
      }
    }
  };

  const resetCookie = () => {
    window.sessionStorage.setItem("date_f", year + "/" + month + "/" + date);
    window.sessionStorage.setItem("date_t", year + "/" + month + "/" + date);
  };

  const handleClearIcon = (code_kind) => {
    if (code_kind === "date") {
      resetCookie();
      setInputs({
        ...inputs,
        date_f: window.sessionStorage.getItem("date_f"),
        date_t: window.sessionStorage.getItem("date_t"),
      });
    } else if (code_kind === "sell_cust") {
      setInputs({
        ...inputs,
        sell_cust_cd: "",
        sell_cust_name: "",
      });
    } else if (code_kind === "gc") {
      setInputs({ ...inputs, group_cd: "", group_name: "" });
    } else if (code_kind === "cc") {
      setInputs({ ...inputs, class_cd: "", class_name: "" });
    } else if (code_kind === "pc") {
      setInputs({ ...inputs, product_cd: "", product_name: "" });
    }
  };

  useEffect(() => {
    setInputs({
      ...inputs,
      date_f: window.sessionStorage.getItem("date_f"),
      date_t: window.sessionStorage.getItem("date_t"),
    });

    if (openSearchToggle) {
      setOpenSearch(true);
    }
  }, [openSearchToggle]);

  const setLoadItem = (item) => {
    parentState(item); // 조회시 state 넘기는 역할
  };

  const logOut = () => {
    if (window.sessionStorage.getItem("userAgent") === "android") {
      let token = window.BRIDGE.connectAndroid();
      let form = new FormData();

      form.append("token", token);
      axios
        .post(
          "http://121.165.242.72:5050/retail/developer/index.php/login/logout",
          form
        )
        .then(() => {
          history.replace({
            pathname: "/",
          });
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  };

  return (
    <div>
      {window.sessionStorage.getItem("date_f") === null && resetCookie()}
      {window.sessionStorage.getItem("date_t") === null && resetCookie()}
      <AppBar className={classes.AppBar}>
        <Toolbar variant="dense">
          <IconButton
            edge="start"
            className={classes.menuButton}
            onClick={() => setToggle(!toggle)}
            color="inherit"
          >
            <MenuIcon />
          </IconButton>

          <Typography variant="h6" className={classes.title}>
            {programName}
          </Typography>

          {useSearch !== undefined && (
            <SearchIcon onClick={() => setOpenSearch(!openSearch)} />
          )}
        </Toolbar>
      </AppBar>

      <SwipeableDrawer
        open={toggle}
        onClose={() => setToggle(true)}
        onOpen={() => setToggle(false)}
      >
        <ListItem className={classes.menuInform}>
          <ListItemText
            primary={
              <Typography type="body2" className={classes.primaryText}>
                {window.sessionStorage.getItem("branch_name")}
              </Typography>
            }
            secondary={
              <>
                <Typography
                  type="body2"
                  gutterBottom
                  className={classes.secondaryText}
                >
                  {window.sessionStorage.getItem("user_name")}
                </Typography>
                <span
                  onClick={() => {
                    setToggle(!toggle);
                    logOut();
                  }}
                >
                  <Typography type="body2" className={classes.logOut}>
                    로그아웃
                  </Typography>
                  <ExitToAppIcon className={classes.logOutIcon} />
                </span>
              </>
            }
          />
          <CloseIcon
            onClick={() => setToggle(!toggle)}
            className={classes.closeIcon}
          />
        </ListItem>

        <Divider className={classes.line} />
        {list.map((listData) => {
          return (
            <div key={listData.PROGRAM_ID}>
              <MenuItem
                className={classes.menuItem}
                onClick={() => {
                  setToggle(!toggle);
                  if (programName !== listData.PROGRAM_NAME) {
                    resetCookie();
                    history.replace({
                      pathname: "/" + listData.PROGRAM_ID,
                    });
                  }
                }}
              >
                {listData.PROGRAM_NAME}
              </MenuItem>
              <Divider />
            </div>
          );
        })}
      </SwipeableDrawer>

      <Drawer open={openSearch} anchor={"right"}>
        <Container className={classes.root}>
          <AppBar position="fixed" className={classes.AppBar}>
            <Toolbar variant="dense">
              <IconButton
                edge="start"
                className={classes.menuButton}
                onClick={() => setOpenSearch(!openSearch)}
                color="inherit"
              >
                <ArrowBackIcon />
              </IconButton>
              <Typography variant="h6" className={classes.title}>
                검색
              </Typography>
            </Toolbar>
          </AppBar>
          <table className={classes.table}>
            <colgroup>
              <col width="20%" />
              <col />
            </colgroup>
            <tbody>
              <tr>
                <td align="right">
                  <span className={classes.span}>매출일</span>
                </td>
                <td>
                  <CssTextField
                    fullWidth
                    name="date"
                    size="small"
                    placeholder="선택"
                    onClick={() => handleClickOpen("date")}
                    value={date_f + " - " + date_t}
                    variant="outlined"
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                  {date_f.length > 0 && (
                    <IconButton
                      className={classes.clearIcon}
                      onClick={() => handleClearIcon("date")}
                    >
                      <ClearIcon fontSize="small" />
                    </IconButton>
                  )}
                </td>
              </tr>
            </tbody>
            <tbody>
              <tr>
                <td align="right">
                  <span className={classes.span}>매출처</span>
                </td>
                <td>
                  <CssTextField
                    fullWidth
                    name="sell_cust_name"
                    size="small"
                    placeholder="선택"
                    onChange={handleOnChange}
                    onClick={() => handleClickOpen("sell_cust")}
                    value={sell_cust_name}
                    variant="outlined"
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                  {sell_cust_name.length > 0 && (
                    <IconButton
                      className={classes.clearIcon}
                      onClick={() => handleClearIcon("sell_cust")}
                    >
                      <ClearIcon fontSize="small" />
                    </IconButton>
                  )}
                </td>
              </tr>
            </tbody>
            <tbody>
              <tr>
                <td align="right">
                  <span className={classes.span}>분류</span>
                </td>
                <td>
                  <CssTextField
                    placeholder="선택"
                    name="group_name"
                    fullWidth
                    size="small"
                    onChange={handleOnChange}
                    onClick={() => handleClickOpen("gc")}
                    value={group_name}
                    variant="outlined"
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                  {group_name.length > 0 && (
                    <IconButton
                      className={classes.clearIcon}
                      onClick={() => handleClearIcon("gc")}
                    >
                      <ClearIcon fontSize="small" />
                    </IconButton>
                  )}
                </td>
              </tr>
            </tbody>
            <tbody>
              <tr>
                <td align="right">
                  <span className={classes.span}>
                    {window.sessionStorage.getItem("CT003")}
                  </span>
                </td>
                <td>
                  <CssTextField
                    name="class_name"
                    placeholder="선택"
                    fullWidth
                    size="small"
                    onChange={handleOnChange}
                    onClick={() => handleClickOpen("cc")}
                    className={classes.textField}
                    value={class_name}
                    variant="outlined"
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                  {class_name.length > 0 && (
                    <IconButton
                      className={classes.clearIcon}
                      onClick={() => handleClearIcon("cc")}
                    >
                      <ClearIcon fontSize="small" />
                    </IconButton>
                  )}
                </td>
              </tr>
            </tbody>
            <tbody>
              <tr>
                <td align="right">
                  <span className={classes.span}>
                    {window.sessionStorage.getItem("CT004")}
                  </span>
                </td>
                <td>
                  <CssTextField
                    placeholder="선택"
                    name="product_name"
                    onChange={handleOnChange}
                    size="small"
                    fullWidth
                    onClick={() => handleClickOpen("pc")}
                    className={classes.textField}
                    value={product_name}
                    variant="outlined"
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                  {product_name.length > 0 && (
                    <IconButton
                      className={classes.clearIcon}
                      onClick={() => handleClearIcon("pc")}
                    >
                      <ClearIcon fontSize="small" />
                    </IconButton>
                  )}
                </td>
              </tr>
            </tbody>
          </table>
          <div className={classes.button}>
            <Button
              className={classes.clearButton}
              variant="contained"
              onClick={() => {
                resetCookie();
                setInputs({
                  date_f: window.sessionStorage.getItem("date_f"),
                  date_t: window.sessionStorage.getItem("date_t"),
                  sell_cust_cd: "",
                  sell_cust_name: "",
                  group_cd: "",
                  group_name: "",
                  class_cd: "",
                  class_name: "",
                  product_cd: "",
                  product_name: "",
                });
              }}
            >
              초기화
            </Button>

            <Button
              className={classes.retrieveButton}
              variant="contained"
              onClick={() => {
                setOpenSearch(!openSearch);
                setLoadItem(inputs);
              }}
            >
              조회
            </Button>
            <MuiPickersUtilsProvider utils={koLocalizedUtils} locale={koLocale}>
              <DatePicker
                className={classes.datePicker}
                open={openCalendar}
                onClose={() => {
                  window.sessionStorage.setItem("acceptFlag", true);
                  setOpenCalendar(false);
                }}
                views={["year", "month", "date"]}
                ToolbarComponent={(props) => CustomToolbar(props)}
                value={date_f}
                inputVariant="outlined"
                cancelLabel="닫기"
                showTodayButton
                onAccept={() => console.log("onAccept")}
                orientation="portrait"
                fullWidth
                todayLabel="오늘"
                okLabel="확인"
                size="small"
                onChange={(date) => handleDateChange(date)}
              />
            </MuiPickersUtilsProvider>
          </div>
        </Container>
        <CustomDialog
          codeListData={codeListData}
          open={openDialog}
          onClose={handleClose}
        />
      </Drawer>
    </div>
  );
}

Sales_pr0501r_Search.propTypes = {
  programName: PropTypes.string,
  useSearch: PropTypes.string,
  parentState: PropTypes.func,
  openSearchToggle: PropTypes.bool,
};

export default withRouter(Sales_pr0501r_Search);
