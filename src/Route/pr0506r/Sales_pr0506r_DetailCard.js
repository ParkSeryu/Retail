import React from "react";
import { Card, CardHeader, CardContent, Typography } from "@material-ui/core";
import AppBars from "../../components/AppBars";

const useStyles = (theme) => ({
  root: {
    width: "90vw",
    marginLeft: "5vw",
    marginTop: "10vh",
  },

  card: {
    border: "1px solid black",
  },

  cardHeader: {
    borderBottom: "1px solid black",
    backgroundColor: "#D6D6D6",
  },

  cardLeft: {
    fontSize: "11pt",
  },

  cardRight: {
    fontSize: "11pt",
    float: "right",
  },

  td_calc: {
    textAlign: "right",
    width: "100vw",
  },

  TOT_AMOUNT_LINE: {
    width: "88vw",
    border: "1px solid #000000",
    marginLeft: "3.5vw",
  },

  dashed_line: {
    borderWidth: "1px",
    borderStyle: "dashed solid",
    letterSpacing: "4px",
    marginLeft: "3vw",
    marginRight: "3vw",
  },
});

function Sale_pr0506r_DetailCard({ location }) {
  const itemdata = location.state.data.itemdata;
  const classes = useStyles();
  let cardStyle = {
    width: "95vw",
    marginTop: "10vh",
    marginLeft: "2vw",
    marginRight: "2vw",
  };
  return (
    <>
      <AppBars programName={"판매현황 - 자세히 보기"} />
      <Card elevation={3} style={cardStyle}>
        <CardHeader
          title={
            <Typography variant="h5">{itemdata.SELL_CUST_NAME}</Typography>
          }
          subheader={
            <Typography variant="h4">
              {numberWithCommas(itemdata.TOT_AMOUNT) + "원"}
            </Typography>
          }
        />
        <div className={classes.TOT_AMOUNT_LINE} />
        <CardContent>
          <Typography gutterBottom variant="body1">
            <span className={classes.cardLeft}>{"매입번호"}</span>
            <span className={classes.cardRight}>
              {itemdata.SELL_NO}-{itemdata.SELL_SEQ}
            </span>
          </Typography>
          <Typography gutterBottom variant="body1">
            <span className={classes.cardLeft}>{"매입일"}</span>
            <span className={classes.cardRight}>{itemdata.SELL_DATE}</span>
          </Typography>
          <Typography gutterBottom variant="body1">
            <span className={classes.cardLeft}>{"매입처"}</span>
            <span className={classes.cardRight}>{itemdata.SELL_CUST_NAME}</span>
          </Typography>
        </CardContent>
        <div class="dotted-gradient" />
        <CardContent>
          <Typography gutterBottom variant="body1">
            <span className={classes.cardLeft}>{"매입유형"}</span>
            <span className={classes.cardRight}>{itemdata.SELL_TYPE}</span>
          </Typography>
          <Typography gutterBottom variant="body1">
            <span className={classes.cardLeft}>
              {window.sessionStorage.getItem("CT004")}
            </span>
            <span className={classes.cardRight}>{itemdata.PRODUCT_NAME}</span>
          </Typography>
          <Typography gutterBottom variant="body1">
            <span className={classes.cardLeft}>{"Lot번호"}</span>
            <span className={classes.cardRight}>
              {itemdata.LOT_NO ? itemdata.LOT_NO.toString() : "-"}
            </span>
          </Typography>
        </CardContent>
        <div class="dotted-gradient" />
        <CardContent>
          <Typography gutterBottom variant="body1">
            <span className={classes.cardLeft}>{"수량"}</span>
            <span className={classes.cardRight}>
              {numberWithCommas(itemdata.QUANTITY)}
            </span>
          </Typography>
          <Typography gutterBottom variant="body1">
            <span className={classes.cardLeft}>{"평"}</span>
            <span className={classes.cardRight}>
              {numberWithCommas(nullCheck(itemdata.P_AREA))}
            </span>
          </Typography>
          <Typography gutterBottom variant="body1">
            <span className={classes.cardLeft}>{"단가"}</span>
            <span className={classes.cardRight}>
              {numberWithCommas(itemdata.GROSS_UNIT_PRICE)}
            </span>
          </Typography>
          <Typography gutterBottom variant="body1">
            <span className={classes.cardLeft}>{"공급가액"}</span>
            <span className={classes.cardRight}>
              {numberWithCommas(itemdata.AMOUNT)}
            </span>
          </Typography>
          <Typography gutterBottom variant="body1">
            <span className={classes.cardLeft}>{"부가세"}</span>
            <span className={classes.cardRight}>
              {numberWithCommas(itemdata.VAT)}
            </span>
          </Typography>
          <Typography variant="body1">
            <span className={classes.cardLeft}>{"매출금액"}</span>
            <span className={classes.cardRight}>
              {numberWithCommas(itemdata.TOT_AMOUNT)}
            </span>
          </Typography>
        </CardContent>
      </Card>
    </>
  );
}

const numberWithCommas = (x) => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const nullCheck = (text) => {
  if (text === null) return "-";
  else return text;
};

export default Sale_pr0506r_DetailCard;
