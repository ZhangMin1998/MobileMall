<template>
  <div>
    <!-- 导航栏 -->
    <van-nav-bar :title="msg" left-text="返回" left-arrow @click-left="goBackFn" />
    <!-- 输入框 -->
    <van-field
      v-model="username"
      required
      clearable
      label="用户名"
      placeholder="请输入用户名"
      :error-message="userErr"
    />
    <van-field
      v-model="password"
      type="password"
      required
      clearable
      label="密码"
      placeholder="请输入密码"
      :error-message="passErr"
    />
    <van-field
      v-model="password2"
      type="password"
      required
      clearable
      label="再输入密码"
      placeholder="请再输入密码"
      :error-message="passErr2"
    />
    <van-field v-model="describe" clearable label="个人签名" placeholder="请再输入个人签名" />

    <van-button type="primary" @click="registerFn">立即注册</van-button>
    <van-button type="info" @click="registerResetFn">重置</van-button>

    <footerBar></footerBar>
  </div>
</template>

<script>
import axios from "axios";
import API_LIST from "@/APIList.config"; //@等价于src/这个目录
import footerBar from "./footerBar";

export default {
  name: "register",
  data() {
    return {
      msg: "注册页面",
      username: "",
      password: "",
      password2: "",
      describe: "",
      userErr: "",
      passErr: "",
      passErr2: "",
    };
  },
  components: { footerBar },
  methods: {
    //回到上一步
    goBackFn() {
      this.$router.go(-1);
    },
    //立即注册
    registerFn() {
      //每次重置err信息
      this.userErr = "";
      this.passErr = "";
      this.passErr2 = "";

      //注册信息Obj
      let _registerObj = {
        username: this.username,
        password: this.password,
        password2: this.password2,
        describe: this.describe,
      };

      if (_registerObj.username === "") {
        this.userErr = "用户名不能为空";
        return;
      }
      if (_registerObj.password === "") {
        this.passErr = "密码不能为空";
        return;
      }
      if (_registerObj.password2 === "") {
        this.passErr2 = "重复密码不能为空";
        return;
      }
      if (_registerObj.password !== _registerObj.password2) {
        this.passErr2 = "两次密码不一致";
        return;
      }
      console.log(_registerObj);
      this.postRegisterObj(_registerObj);
    },
    //提交
    postRegisterObj(_registerObj) {
      axios.post(API_LIST.register_post, _registerObj).then((_d) => {
        console.log(_d.data);
        this.$dialog
          .alert({
            message: _d.data.regInfo,
          })
          .then(() => {
            //注册成功，回到首页
            this.$router.push({ path: "/" });
          });
      });
    },
    //重置
    registerResetFn() {
      (this.username = ""),
        (this.password = ""),
        (this.password2 = ""),
        (this.describe = "");
    },
  },
};
</script>


<style lang="">
</style>