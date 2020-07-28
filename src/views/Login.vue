<template>
  <div id="Login">
      <!--登录界面盒子部分 -->
      <div class="login-box">
          <!-- div 图标部分 -->
          <div class="login-img">
              <img src="../assets/logo.png" alt="">
          </div>

          <!-- input 输入框部分 -->
          <form action="" class="el-from">
              <!-- 用户名部分 -->
              <div class="user">
                <span class="el-fixed">
                  <i class="el-icon-user-solid"></i>
                </span>
                  <input type="text" v-model="usermsg">
              </div>

               <!-- 用户名密码部分 -->
              <div class="user">
                <span class="el-fixed">
                  <i class="el-icon-delete-solid"></i>
                </span>
                   
                  <input type="password"  v-model="password">
              </div>

              <!-- button按钮  -->
              <div class="login-btn">
                    <el-button type="primary" class="login-send" @click="send">登录</el-button>
                    <el-button type="info">重置</el-button>
              </div>
          </form>
      </div>
  </div>
</template>

<script>
export default {
name:"Login",
data() {
return {
  usermsg:'admin',
  password:'123456'
}
},
methods:{
  // 点击确定进行数据请求
  send(){ 
      // ajax数据请求
      this.http.post('http://127.0.0.1:8888/api/private/v1/login',{
        username:this.usermsg,
        password:this.password
      }).then((msg)=>{
        console.log(msg)
        if(msg.data.meta.status==200){
           this.$message({
              message: '登录成功',
              type: 'success'
           });
          console.log(msg.data.data.token)
          var token=msg.data.data.token
          localStorage.setItem('token',token)
          this.$router.push('/home')
        }else{
           this.$message({
              message: '登录失败',
              type: 'warning'
           });
        }
      })
  }
},
//生命周期 - 创建完成（访问当前this实例）
created() {

},
//生命周期 - 挂载完成（访问DOM元素）
mounted() {

}
}
</script>
<style scoped lang='scss'>
/* @import url(); 引入css类 */
#Login{
     background-color: #2b4b6b;
    height: 100%;
    overflow: hidden;
}
/* 登录盒子部分 */
.login-box{
  width: 450px;
  height: 300px;
  background: white;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%,-50%);
}
/* 图标部分 */
.login-img{
  width: 130px;
  height: 130px;
  border: 1px solid #fff;
  border-radius: 50%;
  background-color: #fff;
  position: absolute;
  padding: 8px;
  box-shadow: 0 0 10px #eee;
  left: 50%;
  transform: translateX(-50%) translateY(-50%);
  >img{
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: #eee;
  }
}

// input框部分
.el-from{
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 20px;
    box-sizing: border-box;
}
.user{
  width: 100%;
  height: 30px;
  background: rebeccapurple;
  margin-bottom: 22px;
  position: relative;
}

.el-fixed{
    position: absolute;
    top: 9px;
    height: 100%;
    color: #c0c4cc;
    text-align: center;
    left: 5px;
    transition: all .3s;
    >i{
      font-size: 16px;
    }
}
.user>input{
     -webkit-appearance: none;
    background-color: #fff;
    background-image: none;
    border-radius: 4px;
    border: 1px solid #dcdfe6;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    color: #606266;
    display: inline-block;
    font-size: inherit;
    height: 40px;
    line-height: 40px;
    outline: 0;
    padding: 0 20px;
    -webkit-transition: border-color .2s cubic-bezier(.645,.045,.355,1);
    transition: border-color .2s cubic-bezier(.645,.045,.355,1);
    width: 100%;

}

// login-btn
.login-btn{
  width: 100%;
}
.login-send{
  margin-left: 247px;
}
</style>