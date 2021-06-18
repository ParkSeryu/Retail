import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardContent, Typography } from "@material-ui/core";
import axios from "axios";
import AppBars from "../../components/AppBars";

const useStyles = {
  root: {
    width: "90vw",
    marginLeft: "5vw",
    marginTop: "10vh",
  },

  card: {
    marginBottom: "2vh",
    border: "1px solid black",
  },

  cardHeader: {
    borderBottom: "1px solid black",
    backgroundColor: "#D6D6D6",
  },

  lotNo: {
    fontSize: "11pt",
  },

  amount: {
    fontSize: "11pt",
    float: "right",
  },

  spec: {
    fontSize: "11pt",
  },

  vat: {
    fontSize: "11pt",
    float: "right",
  },

  quantity: {
    fontSize: "11pt",
    //float: "right",
  },

  sell_amount: {
    fontSize: "11pt",
    float: "right",
  },

  area: {
    fontSize: "11pt",
    // float: "right",
  },

  collect_amount: {
    fontSize: "11pt",
    float: "right",
  },

  remark: {
    fontSize: "11pt",
  },
};

function Sales_pr0504r_DeatilCard({ location }) {
  const itemdata = location.state.data.itemdata;
  const classes = useStyles();
  const [cardDataList, setCardDataList] = useState([]);
  console.log(itemdata);

  useEffect(() => {
    axios
      .get(
        "http://121.165.242.72:5050/retail/developer/index.php/retailSales_pr0504r/detail",
        {
          params: {
            sell_cust_cd: itemdata.SELL_CUST_CD,
            sell_date: itemdata.SELL_DATE,
            branch_cd: itemdata.BRANCH_CD,
          },
        }
      )
      .then((response) => {
        if (response.status === 200) {
          setCardDataList(response.data.DATA);
        }
      })
      .catch((e) => {
        console.error(e); // 에러표시
      });
  }, []);

  return (
    <>
      <AppBars programName={"매출처원장 - 자세히 보기"} />
      {cardDataList !== undefined && (
        <div className={classes.root}>
          {cardDataList.map((data, index) => {
            if (data.SORT_SEQ === "2") {
              console.log(data);
              return (
                <Card elevation={5} key={index} className={classes.card}>
                  <CardHeader
                    title={
                      <Typography variant="h6">
                        {data.SELL_NO.substring(0, 1) +
                          "-" +
                          data.SELL_NO.substring(1, 7) +
                          "-" +
                          data.SELL_NO.substring(7) +
                          "-" +
                          data.SELL_SEQ}
                      </Typography>
                    }
                    action={
                      data.WAREHOUSE_NAME !== null
                        ? data.SELL_NAME + " / " + data.WAREHOUSE_NAME
                        : data.SELL_NAME
                    }
                    className={classes.cardHeader}
                  ></CardHeader>
                  <CardContent>
                    <Typography gutterBottom variant="body1">
                      <span className={classes.lotNo}>
                        {"Lot번호 : " + nullCheck(data.LOT_NO)}
                      </span>
                      <span className={classes.amount}>
                        {"공급가액 : " + numberWithCommas(data.AMOUNT)}
                      </span>
                    </Typography>

                    <Typography gutterBottom variant="body1">
                      <span className={classes.spec}>
                        {window.sessionStorage.getItem("CT004") +
                          " : " +
                          nullCheck(data.PRODUCT_NAME)}
                      </span>

                      <span className={classes.vat}>
                        {"부가세 : " + numberWithCommas(data.VAT)}
                      </span>
                    </Typography>

                    <Typography gutterBottom variant="body1">
                      <span className={classes.quantity}>
                        {"수량 : " + numberWithCommas(data.QUANTITY)}
                      </span>
                      <span className={classes.sell_amount}>
                        {"매출금액 : " + numberWithCommas(data.SELL_AMOUNT)}
                      </span>
                    </Typography>
                    <Typography gutterBottom variant="body1">
                      <span className={classes.area}>
                        {"평 : " + data.P_AREA}
                      </span>
                      <span className={classes.collect_amount}>
                        {"수금액 : " + numberWithCommas(data.COLLECT_AMOUNT)}
                      </span>
                    </Typography>

                    <Typography gutterBottom variant="body1">
                      {
                        <span className={classes.remark}>
                          {"비고 : " + nullCheck(data.REMARK)}
                        </span>
                      }
                    </Typography>
                  </CardContent>
                </Card>
              );
            } else {
              return console.log("error");
            }
          })}
        </div>
      )}
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
export default Sales_pr0504r_DeatilCard;
