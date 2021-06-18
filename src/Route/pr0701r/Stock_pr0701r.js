import React, { Component } from "react";
import AppBars from "../../components/AppBars";
import axios from "axios";
import CircularProgress from "@material-ui/core/CircularProgress";
import { withStyles } from "@material-ui/core/styles";
import { Typography } from "@material-ui/core";

const useStyles = () => ({
  component: {
    overflow: "hidden",
    borderBottom: "1px solid #ddd",
    padding: "10px",
  },

  totalComponent: {
    backgroundColor: "#7B7B7B",
    padding: "10px",
    color: "white",
  },

  warehouse: {
    marginLeft: "1vw",
  },

  groupName: {
    // float: "right",
    // marginBottom: "0.5vh",
    marginLeft: "1vw",
  },

  className: { marginLeft: "1vw" },

  productName: {
    marginLeft: "1vw",
  },

  group2: {
    clear: "both",
    paddingTop: "0.5vh",
  },

  lotNo: {
    float: "right",
  },

  stockQuantity: {
    float: "right",
  },

  totlaQuantity: {
    float: "right",
    marginRight: "1vw",
  },

  subTotal: {
    marginLeft: "1vw",
  },

  subTotalQuantity: {
    float: "right",
    marginRight: "1vw",
  },

  itemview: {
    marginTop: "9vh",
  },

  circular_progress: {
    position: "absolute",
    marginLeft: "40vw",
    marginTop: "45vh",
  },
});

class Stock_pr0701r extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      itemList: [],
      toggle: false,
      stock_quantity: 0,
    };
  }

  componentDidMount() {
    if (window.sessionStorage.getItem("pr0701r_inputs") === null) {
      if (window.sessionStorage.getItem("pr0701r_itemList") === null) {
        this.setState({
          loading: false,
        });
      } else {
        this.setState({
          loading: false,
          itemList: JSON.parse(
            window.sessionStorage.getItem("pr0701r_itemList")
          ),
          stock_quantity: window.sessionStorage.getItem(
            "pr0701r_stock_quantity"
          ),
        });
      }
    } else {
      this.loadItem();
    }
  }

  loadItem = async () => {
    this.setState({
      loading: true,
    });
    let data = JSON.parse(window.sessionStorage.getItem("pr0701r_inputs"));
    console.log(data);

    axios
      .get(
        "http:///121.165.242.72:5050/retail/developer/index.php/stock_pr0701r/detail",
        {
          params: {
            date: data.date.replaceAll("-", ""),
            branch_cd: window.sessionStorage.getItem("branch_cd"),
            warehouse_cd: data.warehouse_cd,
            group_cd: data.group_cd,
            class_cd: data.class_cd,
            product_cd: data.product_cd,
            lot_no: data.lot_no,
          },
        }
      )
      .then((response) => {
        console.log("response data receving");
        console.log(response);
        if (response.data.RESULT_CODE === "200") {
          // data라는 이름으로 json 파일에 있는 값에 state값을 바꿔준다.
          this.setState({
            loading: false, // load되었으니 false,
            itemList: response.data.DATA, // 비어있던 Itemlist는 data에 Item객체를 찾아넣어준다. ( Item : json파일에 있는 항목)
            stock_quantity: response.data.STOCK_QUANTITY,
          });
          window.sessionStorage.setItem(
            "pr0701r_itemList",
            JSON.stringify(this.state.itemList)
          );
          window.sessionStorage.setItem(
            "pr0701r_stock_quantity",
            this.state.stock_quantity
          );

          window.sessionStorage.removeItem("pr0701r_inputs");
        } else {
          alert("조회된 내역이 없습니다.");
          this.setState({
            loading: false, // 이때는 load 가 false 유지
          });
        }
      })
      .catch((e) => {
        console.error(e); // 에러표시
        this.setState({
          loading: false, // 이때는 load 가 false 유지
        });
      });
  };

  render() {
    const { classes } = this.props;
    const itemList = this.state.itemList;

    return this.state.loading === false ? (
      <div>
        <AppBars programName={"재고현황"} useSearch={"/pr0701r"} />
        <ul className={classes.itemview}>
          {(console.log(itemList), console.log(this.state.stock_quantity))}
          {itemList.map((itemdata, index) => {
            return (
              // <Link
              //   key={itemdata.BUY_NO + itemdata.BUY_SEQ}
              //   to={{
              //     pathname: "/pr0301r/detail",
              //     state: { data: { itemdata } },
              //   }}
              // >
              <li className={classes.component}>
                <Typography gutterBottom variant="body1">
                  <span className={classes.productName}>
                    {itemdata.PRODUCT_NAME}
                  </span>
                  <span className={classes.lotNo}>
                    {"Lot : " + itemdata.LOT_NO}
                  </span>
                </Typography>
                <Typography variant="body1">
                  <span className={classes.warehouse}>
                    {itemdata.WAREHOUSE_NAME}
                  </span>
                  <span className={classes.stockQuantity}>
                    {"수량 : " + numberWithCommas(itemdata.STOCK_QUANTITY)}
                  </span>
                </Typography>
              </li>
            );
          })}
          {this.state.stock_quantity !== 0 && (
            <li className={classes.totalComponent}>
              <span className={classes.subTotal}>수량합계</span>
              <span className={classes.subTotalQuantity}>
                {numberWithCommas(this.state.stock_quantity)}
              </span>
            </li>
          )}
        </ul>
      </div>
    ) : (
      <div className={classes.circular_progress}>
        <CircularProgress color="secondary" size={80} />
      </div>
    );
  }
}

const numberWithCommas = (x) => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export default withStyles(useStyles)(Stock_pr0701r);
