<template>
  <div>
    <!-- 导航栏 -->
    <van-nav-bar :title="msg" left-text="返回" left-arrow @click-left="goBackFn" />
    <!-- 输入框 -->
    <van-field v-model="username" required clearable label="用户名" placeholder="请输入用户名" />
    <van-field
      v-model="password"
      type="password"
      required
      clearable
      label="密码"
      placeholder="请输入密码"
    />
    <van-button type="primary" @click="userLoginFn">登录</van-button>
    <van-button type="primary" @click="registerBtn">注册</van-button>

    <footerBar></footerBar>
  </div>
</template>

<script>
import axios from "axios";
import API_LIST from "@/APIList.config"; //@等价于src/这个目录
import footerBar from "./footerBar";

export default {
  name: "userLogin",
  data() {
    return {
      msg: "登录",
      username: "",
      password: "",
    };
  },
  components: { footerBar },
  methods: {
    //回到上一步
    goBackFn() {
      this.$router.go(-1);
    },
    //登陆
    userLoginFn() {
      let _loginObj = {
        u: this.username,
        p: this.password,
      };

      //console.log(_loginObj)
      axios.post(API_LIST.userLogin_post, _loginObj).then((_d) => {
        console.log(_d.data);
        this.$dialog
          .alert({
            message: "欢迎您:" + _d.data.regInfo.username + ",登录成功!",
          })
          .then(() => {
            if (_d.data.reg_code === 3) {
              //转为字符串存
              localStorage.userName = JSON.stringify(_d.data.regInfo);
            }
            //回到首页
            this.$router.push({ path: "/" }, () => {
              localStorage.setItem("inxState", 0);
            });
          });
      });
    },
    //注册
    registerBtn() {
      //console.log('11111')
      this.$router.push("/register");
    },
  },
};
</script>


<style lang="">
</style>