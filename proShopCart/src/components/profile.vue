<template>
  <div>
    <van-nav-bar
      :title="msg"
      left-text="返回"
      left-arrow
      right-text="退出"
      @click-left="goBack"
      @click-right="logOutBtn"
    />

    <div class="userImgDiv">
        <p>欢迎:{{this.userNameObj.username}}</p>
        <p>{{userNameObj.describe}}</p>
    </div>
    <footerBar></footerBar>
  </div>
</template>


<script>
import axios from "axios";
import API_LIST from "@/APIList.config";
import footerBar from "./footerBar";

export default {
  name: "profile",
  data() {
    return {
      msg: "个人中心",
      userNameObj:'',
    };
  },
  components: { footerBar },
  created() {
      this.userNameObj=JSON.parse(localStorage.userName);
  },
  methods: {
    //返回
    goBack() {
      this.$router.push({ path: "/" }, () => {
        localStorage.setItem("inxState", 0);
      });
    },
    //退出登录
    logOutBtn() {
      
      this.$dialog
        .alert({
          message: "已退出！",
        })
        .then(() => {
          this.goBack();
        });
        localStorage.userName = "";
    },
  },
};
</script>

<style scoped>
.pr {
  position: relative;
}
.pa {
  position: absolute;
}
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
.wrapDiv {
  width: 90%;
  overflow: hidden;
  border: 1px solid #666;
  background: #eee;
  border-radius: 10px;
  margin: 10px auto;
}
.userImgDiv {
  /* width: 200px;
  height: 100px;
  float: left;
  overflow: hidden; */
  position: relative;
  border-radius: 10px;
  margin: 10px;
  font-size: 20px;
}
.userImgDiv img {
  position: absolute;
  top: 0;
  left: -20px;
  width: 260px;
}
.userInfoDiv {
  font-size: 14px;
  float: left;
  text-align: left;
}
.wrapDiv {
  width: 90%;
  overflow: hidden;
  border: 1px solid #666;
  background: #eee;
  border-radius: 10px;
  margin: 10px auto;
}
</style>