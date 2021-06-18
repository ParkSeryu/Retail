import React, { useState, useEffect } from "react";
import AppBars from "../../components/AppBars";
import Container from "@material-ui/core/Container";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import { Typography } from "@material-ui/core";
import axios from "axios";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import NativeSelect from "@material-ui/core/NativeSelect";

const useStyles = (theme) => ({
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(10),
  },

  formControl: {
    minWidth: "100%",
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
    fontSize: "15px",
    backgroundColor: "#64B6D8",
    color: "#FFFFFF",
    "&:focus": {
      backgroundColor: "#64B6D8",
    },
  },

  mulgyul: {
    marginTop: "2.5vh",
  },
});

function Purchase_pr0303r_Search({ history }) {
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
    date_f: year + "-01-01",
    date_t: year + "-" + month + "-" + date,
    buy_cust_cd: "",
    branch_cd: window.sessionStorage.getItem("branch_cd"),
  });

  const { date_f, date_t } = inputs;

  const handleOnChange = (e) => {
    const { value, name } = e.target;
    setInputs({
      ...inputs,
      [name]: value,
    });
  };

  const [open, setOpen] = React.useState(false);
  const [buyCust, setBuyCust] = React.useState([]);
  const [buyCustCd, setBuyCustCd] = React.useState("");

  const handleChange = (event) => {
    setBuyCustCd(event.target.value);
    setInputs({
      ...inputs,
      buy_cust_cd: event.target.value,
    });
  };

  useEffect(() => {
    axios
      .get(
        "http://121.165.242.72:5050/retail/developer/index.php/code/buyCust",
        {
          params: {
            branch_cd: window.sessionStorage.getItem("branch_cd"),
            cust_buy_cls: "1",
          },
        }
      )
      .then(({ data }) => {
        if (data.RESULT_CODE === "200") {
          setBuyCust(data.DATA);
        }
      })
      .catch((e) => {
        console.error(e); // 에러표시
      });
  }, []);

  return (
    <>
      <AppBars programName={"매입처원장 - 검색"} />
      <Container className={classes.form}>
        <Grid container spacing={3}>
          <Grid item xs={5} sm={6}>
            <TextField
              error
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
            <TextField
              error
              name="date_t"
              label="종료일 입력"
              type="date"
              onChange={handleOnChange}
              value={date_t}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl className={classes.formControl}>
              <InputLabel shrink htmlFor="age-native-label-placeholder">
                매출처
              </InputLabel>
              <NativeSelect
                label="simple-select-label"
                id="simple-select"
                value={buyCustCd}
                onChange={handleChange}
                fullWidth
                inputProps={{
                  name: "매출처",
                  id: "age-native-label-placeholder",
                }}
              >
                <option value="">전체</option>
                {buyCust.map((itemList, index) => {
                  return (
                    <option value={itemList.CUST_CD} key={index}>
                      {itemList.CUST_NAME}
                    </option>
                  );
                })}
              </NativeSelect>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <Button
              className={classes.button}
              variant="contained"
              onClick={() => {
                if (!date_f || !date_t) {
                  alert('"기준일" 필수항목 입니다.');
                } else {
                  window.sessionStorage.setItem(
                    "pr0303r_inputs",
                    JSON.stringify(inputs)
                  );
                  history.goBack();
                }
              }}
            >
              조회
            </Button>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
export default Purchase_pr0303r_Search;
