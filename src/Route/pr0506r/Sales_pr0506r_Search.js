import React, { useState, useEffect } from "react";
import AppBars from "../../components/AppBars";
import Container from "@material-ui/core/Container";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import CustomDialog from "../../components/CustomDialog";
import axios from "axios";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import { Typography } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import InputAdornment from "@material-ui/core/InputAdornment";
import SearchIcon from "@material-ui/icons/Search";

const CssTextField = withStyles({
  root: {
    "& label.Mui-focused": {
      color: "#767980",
    },
    "& .MuiInput-underline:after": {
      borderBottomColor: "#767980",
    },
    "& .MuiOutlinedInput-root": {
      "&.Mui-focused fieldset": {
        borderColor: "#767980",
      },
    },
  },
})(TextField);

const useStyles = (theme) => ({
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(10),
  },

  textfield: {
    fontSize: "10",
  },

  span: {
    fontSize: "4vw",
    verticalAlign: "middle",
  },

  button: {
    marginTop: "2vh",
    height: "100%",
    width: "100%",
    fontFamily: "NanumGothic",
    fontSize: "14px",
    backgroundColor: "#67696F",
    color: "#FFFFFF",
    "&:focus": {
      backgroundColor: "#67696F",
    },
  },

  mulgyul: {
    marginTop: "2.5vh",
  },
});

function Sales_pr0506r_Search({ history }) {
  let today = new Date();
  let year = today.getFullYear();
  let month = ("0" + (1 + today.getMonth())).slice(-2);
  let date = ("0" + today.getDate()).slice(-2);
  const classes = useStyles();

  window.addEventListener(
    "dialog",
    () => {
      setOpen(!open);
    },
    {
      once: true,
    }
  );

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
    lot_no: "",
  });

  const {
    date_f,
    date_t,
    sell_cust_name,
    group_name,
    class_name,
    product_name,
    lot_no,
  } = inputs;

  const handleOnChange = (e) => {
    const { value, name } = e.target;
    setInputs({
      ...inputs,
      [name]: value,
    });
  };

  const [open, setOpen] = React.useState(false);
  const [codeListData, setCodeListData] = React.useState([]);
  const [codeKind, setCodeKind] = React.useState("");

  const handleClickOpen = (code_kind) => {
    setCodeKind(code_kind);
    axios
      .get("http://121.165.242.72:5050/retail/developer/index.php/code", {
        params: {
          branch_cd: window.sessionStorage.getItem("branch_cd"),
          code_kind: code_kind,
        },
      })
      .then(({ data }) => {
        if (data.RESULT_CODE === "200") {
          setCodeListData(data.DATA);
        }
        setOpen(true);
      })
      .catch((e) => {
        console.error(e); // 에러표시
      });
  };

  const handleClose = (codeName, codeCd) => {
    setOpen(false);
    if (codeCd === undefined) {
      codeName = "";
      codeCd = "";
    }
    //여기서 검사
    if (codeKind === "sell_cust") {
      setInputs({ ...inputs, sell_cust_cd: codeCd, sell_cust_name: codeName });
    } else if (codeKind === "gc") {
      setInputs({ ...inputs, group_cd: codeCd, group_name: codeName });
    } else if (codeKind === "cc") {
      setInputs({ ...inputs, class_cd: codeCd, class_name: codeName });
    } else if (codeKind === "pc") {
      setInputs({ ...inputs, product_cd: codeCd, product_name: codeName });
    }
  };

  useEffect(() => {
    setInputs({
      ...inputs,
      date_f: year + "-01-01",
      date_t: year + "-" + month + "-" + date,
    });
  }, []);

  return (
    <>
      <AppBars programName={"판매현황 - 검색"} />
      <Container className={classes.form}>
        <Grid container spacing={3}>
          <Grid item xs={5} sm={6}>
            <CssTextField
              label="기준일 입력"
              name="date_f"
              type="date"
              onChange={handleOnChange}
              value={date_f}
              fullWidth
            />
          </Grid>
          <Grid item xs={1} sm={6}>
            <Typography className={classes.mulgyul} align="center">
              ~
            </Typography>
          </Grid>
          <Grid item xs={5} sm={6}>
            <CssTextField
              name="date_t"
              label="종료일 입력"
              type="date"
              onChange={handleOnChange}
              value={date_t}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <CssTextField
              name="sell_cust_name"
              label=" 매출처 "
              onChange={handleOnChange}
              value={sell_cust_name}
              fullWidth
              InputProps={{
                endAdornment: (
                  <InputAdornment>
                    <IconButton onClick={() => handleClickOpen("sell_cust")}>
                      <SearchIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <CssTextField
              name="group_name"
              onChange={handleOnChange}
              value={group_name}
              label="분류"
              fullWidth
              InputProps={{
                endAdornment: (
                  <InputAdornment>
                    <IconButton onClick={() => handleClickOpen("gc")}>
                      <SearchIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <CssTextField
              name="class_name"
              onChange={handleOnChange}
              value={class_name}
              label={window.sessionStorage.getItem("CT003")}
              fullWidth
              InputProps={{
                endAdornment: (
                  <InputAdornment>
                    <IconButton onClick={() => handleClickOpen("cc")}>
                      <SearchIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <CssTextField
              name="product_name"
              onChange={handleOnChange}
              value={product_name}
              fullWidth
              label={window.sessionStorage.getItem("CT004")}
              InputProps={{
                endAdornment: (
                  <InputAdornment>
                    <IconButton onClick={() => handleClickOpen("pc")}>
                      <SearchIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <CssTextField
              name="lot_no"
              onChange={handleOnChange}
              value={lot_no}
              fullWidth
              label="Lot 번호"
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              className={classes.button}
              variant="contained"
              onClick={() => {
                window.sessionStorage.setItem(
                  "pr0506r_inputs",
                  JSON.stringify(inputs)
                );
                history.goBack();
              }}
            >
              조회
            </Button>

            {open === true
              ? window.sessionStorage.setItem("dialogFlag", "open")
              : window.sessionStorage.setItem("dialogFlag", "close")}
            <CustomDialog
              codeListData={codeListData}
              open={open}
              onClose={handleClose}
            />
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
export default Sales_pr0506r_Search;
