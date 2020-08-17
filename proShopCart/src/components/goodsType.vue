<template>
  <div>
    <van-button v-if="isLogin" type="danger" @click="entryGoodsToDb">录入商品</van-button>
    <!-- 横向栏目 -->
    <!-- 商品显示 -->
    <div class="wrapDiv cle">
      <van-tabs v-model="tabActive" @click="headColumnFn" animated>
        <van-tab v-for="(item,index) in goodsCategoryData" :key="index" :title="item.n">
          <h1>{{item.d}}</h1>
        </van-tab>
      </van-tabs>
    </div>
    <!-- 商品录入框 -->
    <div v-if="isEntryGoods" class="goodsEntry cle">
      <div v-for="(item,index) in emptyGoodsDomArr" :key="index">
        <entryGoods @pushGoodsInfo="pushGoodsInfo" @isVoidFalse="isVoidFalseFn" />
      </div>

      <van-button type="danger" @click="addGoodsInputBtn">+</van-button>
      <van-button type="danger" @click="submitBtn">提交</van-button>
      <van-button type="danger" @click="cancelBtn">取消</van-button>
    </div>
    <div class="entryGoodsDivBg" v-if="isEntryGoodsDivBg"></div>
    <!-- 侧边栏 -->
    <div class="sideBarFn">
      <van-sidebar v-model="activeBadgeKey" @change="onChange">
        <van-sidebar-item v-for="(item,index) in goodsCategoryData" :key="index" :title="item.n" />
      </van-sidebar>
    </div>
    <!-- 显示侧边栏目的数据 -->
    <div class="columnData">
      <ul v-for="(item,index) in goodsListData" @click="gotoGoodsProduct(item)">
        <li>
          <img :src="item.img" />
        </li>
        <li>{{item.name}}</li>
        <li>￥{{item.price}}</li>
        <li>{{item.describe}}</li>
      </ul>
    </div>
    <!-- 分页栏 -->
    <div class="pageChange">
      <van-pagination
        v-model="currentPage"
        :total-items="totalItems"
        :items-per-page="2"
        mode="simple"
        @change="pageChangeFn"
      />
    </div>

    <!-- 底部导航栏 -->
    <footerBar></footerBar>
  </div>
</template>

<script>
import axios from "axios";
import API_LIST from "@/APIList.config"; //@等价于src/这个目录
import footerBar from "./footerBar";
import entryGoods from "./entryGoods";

export default {
  name: "goodsType",
  data() {
    return {
      msg: "商品分类页",
      tabActive: 0,
      //isLogin: false,
      activeBadgeKey: 0,

      //商品录入窗口的开关
      isEntryGoods: false,
      //空白的录入框
      emptyGoodsDomArr: [{}],
      isEntryGoodsDivBg: false,
      //四个框填完了没？
      isGoodsInfoWrite: false,
      isNameRepeat: true,
      //接收录入商品的总的大对象
      entryGoodsObj: [],
      //获得商品大类
      goodsCategoryData: "",
      //侧栏目
      goodsListData: [],
      //分页
      currentPage: 0,
      totalItems: 0,
    };
  },
  components: { footerBar, entryGoods },
  created() {
    //获得商品列表-大类
    this.getGoodsCategoryFn();
    //查询栏目所属的商品列表,默认第一个
    this.getCategoryGoodsListFn("goodsList_a");

    //如果没有得到数据，那么就不执行下面的
    if (!localStorage.userName) {
      return;
    }

    if (localStorage.userName) {
      let _str = JSON.parse(localStorage.userName);
      this.$notify(_str.username + ",Welcome");
      this.isLogin = true;
      this.msg = "商品分类页:" + _str.username;
    }
  },
  watch: {
    activeBadgeKey(_inx) {
      let _c = this.goodsCategoryData[_inx].d;
      this.getCategoryGoodsListFn(_c);

      // 分页
      this.currentPage = 1;
      this.pageChangeFn();
    },
  },
  methods: {
    //横向分类栏
    headColumnFn(_inx) {
      //console.log(_inx);
      //activeBadgeKey是侧边栏的索引
      this.activeBadgeKey = _inx;
    },
    //侧边分类栏
    onChange(_key) {
      this.activeBadgeKey = _key;
      //console.log(this.goodsCategoryData[_key].d);
      let _c = this.goodsCategoryData[_key].d;
      this.getCategoryGoodsListFn(_c);

      //tabActive是横向栏目索引
      this.tabActive = _key;
    },
    //查询栏目所属的商品列表
    getCategoryGoodsListFn(_c) {
      axios
        .get(API_LIST.getCategoryGoodsList, {
          params: { categoryId: _c },
        })
        .then((_d) => {
          //console.log(_d.data);
          //this.goodsListData = _d.data;
          //分类下的所有商品的总数，用在分页上
          this.totalItems = _d.data.length;
        });
    },
    //录入商品
    entryGoodsToDb() {
      this.isEntryGoods = true;
      this.isEntryGoodsDivBg = true;
    },
    //添加商品信息到总的商品信息的数组的对象
    pushGoodsInfo(_goodsInfoObj) {
      //判断商品名称是否重复
      let _is = true;
      for (let i = 0; i < this.entryGoodsObj.length; i++) {
        if (this.entryGoodsObj[i].n === _goodsInfoObj.n) {
          _is = false; //有相同的
          break;
        }
      }
      if (_is) {
        this.entryGoodsObj.push(_goodsInfoObj);
        this.isNameRepeat = true;
      } else {
        this.isNameRepeat = false;
        this.$dialog.alert({
          message: "商品重名了",
        });
      }
      //四个框填写完了
      this.isGoodsInfoWrite = true;
    },
    //四个框没写完时，触发
    isVoidFalseFn() {
      this.isGoodsInfoWrite = false;
    },
    //四个框全写完,且不重名，才能增加新的空白框
    addGoodsInputBtn() {
      if (this.isGoodsInfoWrite && this.isNameRepeat) {
        this.emptyGoodsDomArr.push({});
      } else {
        this.$dialog.alert({
          message: "有框还没写完或者商品重名",
        });
      }
    },
    //提交新增商品
    submitBtn() {
      console.table(this.entryGoodsObj);
      axios.post(API_LIST.insertGoods, this.entryGoodsObj).then((_d) => {
        console.log(_d.data);
        this.$dialog
          .alert({
            message: _d.data.regInfo,
          })
          .then(() => {
            //商品录入窗口,背景关闭
            this.isEntryGoods = false;
            this.isEntryGoodsDivBg = false;
            //空白输入框的数量重置
            this.emptyGoodsDomArr = [{}];
            //获得商品列表-大类 更新页面
            this.getGoodsCategoryFn();
          });
      });
    },
    //取消提交商品
    cancelBtn() {
      this.isEntryGoods = false;
      this.isEntryGoodsDivBg = false;
    },
    //获得商品列表-大类
    getGoodsCategoryFn() {
      axios.get(API_LIST.getGoodsCategory).then((_d) => {
        //console.table(_d.data);
        this.goodsCategoryData = _d.data;
      });
    },
    //分页时触发
    pageChangeFn() {
      //console.log(this.currentPage);
      /*
      点击下一页时，要跳过的文档数是（currentPage-1)*每页显示2个
      所以在翻页的接口，需要传入两个值
      ---要跳过的文档数
      ---你要查询的集合
      */
      //获得集合名，它里面的索引和分页没有关系
      let _c = "";
      if (!this.goodsCategoryData) {
        _c = "goodsList_a";
      } else {
        _c = this.goodsCategoryData[this.activeBadgeKey].d;
      }

      axios
        .get(API_LIST.getPageChange, {
          params: {
            startNum: (this.currentPage - 1) * 2,
            c: _c,
          },
        })
        .then((_d) => {
          // console.log( _d.data );
          this.goodsListData = _d.data;
        });
    },
    //跳转到商品详情页
    gotoGoodsProduct(_item) {
      //console.log(_item);
      this.$router.push({
        name: "goodsProduct",
        query: { _goodsObjId: _item._id, _collectionName: _item.category },
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
.cle:after {
  content: ".";
  overflow: hidden;
  visibility: hidden;
  height: 0;
  display: block;
  clear: both;
}
.wrapDiv {
  width: 80%;
  overflow: hidden;
  border: 1px solid #666;
  background: #eee;
  border-radius: 10px;
  margin: 10px auto;
}
.wrapDiv p.tip {
  font-size: 22px;
  text-align: center;
  padding: 0;
  margin: 5px 0;
  color: #666;
}
.leftDiv {
  float: left;
  width: 60%;
  margin: 10px;
  border-radius: 10px;
  border: 1px solid #999;
  padding: 10px;
  line-height: 30px;
  text-align: center;
  font-size: 22px;
}
.rightDiv {
  float: right;
  width: 20%;
  margin: 10px;
  border-radius: 10px;
  border: 1px solid #999;
  padding: 10px;
  line-height: 30px;
  text-align: center;
  font-size: 22px;
}
.sliderDiv {
  width: 80%;
  margin: 10px auto;
}
.sliderDiv img {
  width: 100%;
  height: 188px;
}

.goodsEntry {
  width: 80%;
  position: absolute;
  top: 25%;
  left: 8%;
  margin-left: -40%;
  z-index: 112;
  padding: 10px;
  background: #ddd;
  border-radius: 10px;
  border: 1px solid #999;
  line-height: 30px;
  text-align: center;
  font-size: 16px;
}
.goodCategory {
  clear: both;
  margin: 10px 0;
}
.goodCategory li {
  float: left;
}
.goodCategory li img {
  width: 50px;
  height: 50px;
  border-radius: 10px;
  border: 1px solid #666;
}
.goodsEntry {
  width: 80%;
  margin: 10px auto;
  padding: 10px;
  border-radius: 10px;
  border: 1px solid #999;
  line-height: 30px;
  text-align: center;
  font-size: 16px;
}
.entryGoodsDivBg {
  width: 100%;
  height: 100%;
  background: #000;
  opacity: 0.3;
  z-index: 111;
  position: absolute;
  top: 0;
  left: 0;
}
.imgSize {
  width: 100%;
  height: 100%;
}
.sideBarFn {
  width: 80px;
  position: absolute;
  top: 250px;
  left: 0;
  z-index: 10;
}
.columnData {
  clear: both;
  width: 70%;
  /* height: 300px; */
  background-color: #eee;
  border: 1px solid #666;
  border-radius: 10px;
  margin: 0 0 0 90px;
}
.columnData ul {
  display: block;
  clear: both;
  overflow: hidden;
  margin: 5px;
  background: #ddd;
  border-radius: 10px;
}
.columnData ul li {
  float: left;
  margin: 5px;
}
.columnData ul li.tip {
  background: #eee;
  padding: 2px;
}
.columnData ul li img {
  width: 50px;
  height: 50px;
}
.pageChange {
  width: 85%;
  float: right;
  clear: both;
}
</style>