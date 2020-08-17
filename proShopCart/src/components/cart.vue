<template>
  <div>
    <van-nav-bar
      :title="msg"
      left-text="返回"
      left-arrow
      right-text="清空"
      @click-left="goBack"
      @click-right="cartEmptyFn"
    />
<!-- 可以吧cart换成shopCartList -->
    <div class="goodsDiv" v-for="item in cartArr">   
      <label>
        <img :src="item._img" />
      </label>
      <h2>{{item._goodsName}},数量{{item._num}},单价{{item._price}}</h2>
      <!-- async-change=true必须为异步，否则将计算点击之前的值 -->
      <van-stepper
        v-model="item['_num']"
        integer
        :async-change="true"
        @plus="addBtnFn"
        @minus="reduceBtnFn"
      />
    </div>

    <van-submit-bar :price="allGoodsMoney*100" :button-text="submitTxt" @submit="onSubmit" />
    <h2 v-if="isCartEmpty">购物车是空的，快去添加商品吧</h2>
  </div>
</template>


<script>
import axios from "axios";
import API_LIST from "@/APIList.config"; //@等价于src/这个目录
import { Toast } from "vant";
import {mapGetters,mapActions} from 'vuex'

export default {
  name: "cart",
  data() {
    return {
      msg: "购物车",
      cartArr: "",
      allGoodsNum: 0,
      allGoodsMoney: 0,
      submitTxt: "",
      isCartEmpty: false,
    };
  },
  created() {
    this.cartArr = localStorage.cartDataInfo
      ? JSON.parse(localStorage.cartDataInfo)
      : [];
    if (this.cartArr.length === 0) {
      this.isCartEmpty = true;
    }
    console.log(this.cartArr);
    //计算所有商品总数
    this.countAllGoodsNum();
    //计算所有商品的总价
    this.countAllGoodsMoney();

    //vuex,this.cartArr就是购物车中的商品
    this.addToVuex(this.cartArr)   //把数据传入到vuex里面
  },
  computed: {
    //映射数据，从Vuex的getter里
    ...mapGetters(['shopCartList'])
  },
  methods: {
    //映射事件
  ...mapActions(['addToVuex']),
    //返回
    goBack() {
      this.$router.push({ path: "/" }, () => {
        localStorage.setItem("inxState", 0);
      });
    },

    //计算所有商品总数
    countAllGoodsNum() {
      this.allGoodsNum = 0;
      for (let i = 0; i < this.cartArr.length; i++) {
        this.allGoodsNum += this.cartArr[i]._num;
      }
      this.submitTxt = "去结账(" + this.allGoodsNum + ")";
    },
    //+
    addBtnFn() {
      //console.log("add xxx");
      this.countAllGoodsNum();
      this.countAllGoodsMoney();
    },
    //-
    reduceBtnFn() {
      this.countAllGoodsNum();
      this.countAllGoodsMoney();
    },
    //计算所有商品的总价
    countAllGoodsMoney() {
      this.allGoodsMoney = 0;
      for (let i = 0; i < this.cartArr.length; i++) {
        this.allGoodsMoney += this.cartArr[i]._num * this.cartArr[i]._price;
      }
    },
    //清空购物车
    cartEmptyFn() {
      this.cartArr = localStorage.removeItem("cartDataInfo");
      this.submitTxt = "去结账(0)";
      this.allGoodsMoney = 0;
      this.$dialog.alert({
        message: "购物车清空啦！",
      });
      //this.isCartEmpty = true;
    },
    //提交订单,去结账
    onSubmit() {
      this.$dialog
        .alert({
          message:
            "共" +
            this.allGoodsNum +
            "个商品，总计:" +
            this.allGoodsMoney +
            "元",
        })
        .then(() => {
          Toast.success("支付成功");
        });
    },
    
  },
};
</script>

<style scoped>
h1,
h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
h2.title {
  font-size: 20px;
  text-align: center;
}
.cle:after {
  content: ".";
  overflow: hidden;
  visibility: hidden;
  height: 0;
  display: block;
  clear: both;
}
.goodsDiv {
  width: 95%;
  margin: 5px auto;
  clear: both;
}
.goodsDiv label {
  float: left;
  width: 100px;
  height: 100px;
  overflow: hidden;
  border: 1px solid #ddd;
  border-radius: 10px;
}
.goodsDiv label img {
  width: 100px;
  height: 100px;
}
.goodsDiv h2 {
  font-size: 18px;
}
</style>