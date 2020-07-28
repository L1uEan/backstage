<template>
  <div id="User">
      <!-- 面包屑区域 -->
      <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片区域 -->
    <el-card class="box-card">
       <!-- layout布局 -->
          <el-row :gutter="20">
            <el-col :span="10">
                        <!-- 搜索框部分 -->
                <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable>
                    <el-button @click="UserSearchList" slot="append" icon="el-icon-search"></el-button>
                </el-input>
            </el-col>
            <el-col :span="4">
                <el-button type="primary" @click="addUserInfo">添加用户</el-button>
            </el-col>
          </el-row>

          <!-- 用户列表部分 -->
        <el-table :data='userList' border stripe>
             <el-table-column type='index' label='#' ></el-table-column>
             <el-table-column label='姓名' prop='username'></el-table-column>
             <el-table-column label='邮箱' prop='email'></el-table-column>
             <el-table-column label='电话' prop='mobile'></el-table-column>
             <el-table-column label='角色' prop='role_name'></el-table-column>
             <el-table-column label='状态' prop='mg_state'>
                 <!-- slot-scope插槽  -->
                 <template slot-scope="scope">
                     <!-- scope.row.mg_state 返回值为布尔类型 -->
                     <el-switch
                        v-model="scope.row.mg_state" @change="userStateChange(scope.row)">
                     </el-switch>
                 </template>
             </el-table-column>
             <el-table-column label='操作' prop='role_name' width='180'>
                   <!-- slot-scope插槽  -->
                 <template slot-scope="scope">
                     <!-- 修改按钮 -->
                     <el-button type="primary" @click="editShowMessage(scope.row.id)" icon="el-icon-edit" size='mini'></el-button>
                     <!-- 删除按钮 -->
                     <el-button type="danger" @click="openUserDelete(scope.row.id)" icon="el-icon-delete" size='mini'></el-button>
                     <!-- 分配权限 -->
                       <el-tooltip  effect="dark" content="分配角色" placement="top" :enterable='false'>
                              <el-button type="warning" icon="el-icon-setting" size='mini'></el-button>
                     </el-tooltip>
                 </template>
             </el-table-column>
        </el-table>

         <!-- 分页器功能 -->
            <pagination @pagin='getUserList' :queryInfo='queryInfo' :total='total' @getUserList='getUserList'></pagination>   
    </el-card>
        <!-- 添加用户片段部分 -->
            <el-dialog
                title="添加用户"
                :visible.sync="adddialogVisible"
                width="50%"
                @close='UserMessageClose'
                >
                <!-- 内容主题区域 -->
                <!-- addForm添加用户的表单数据 :rules表示表单验证 refdom节点  -->
                <el-form :model="addForm" :rules="addFormrules" ref="addruleForm" label-width="70px" >
                    <el-form-item label="用户名" prop="username"><!--prop表示验证规则 -->
                        <!--addForm.username input框内的值  -->
                        <el-input v-model="addForm.username"></el-input>
                    </el-form-item>
                    <!-- 密码部分 -->
                     <el-form-item label="密码" prop="userpassword"><!--prop表示验证规则 -->
                        <el-input v-model="addForm.userpassword"></el-input>
                    </el-form-item>
                      <!-- 邮箱部分 -->
                     <el-form-item label="Emial" prop="useremail"><!--prop表示验证规则 -->
                        <el-input v-model="addForm.useremail"></el-input>
                    </el-form-item>
                      <!-- 手机部分 -->
                     <el-form-item label="Tel" prop="usertel"><!--prop表示验证规则 -->
                        <el-input v-model="addForm.usertel"></el-input>
                    </el-form-item>
                </el-form>
                <!-- 底部区域 取消 确定按钮的显示部分 -->
                <span slot="footer" class="dialog-footer">
                    <el-button @click="adddialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="addUser">确 定</el-button>
                </span>
        </el-dialog>

        <!-- 用户修改片段 -->
        <el-dialog
            title="修改用户信息"
            :visible.sync="edmitdialogVisible"
             width="50%"
            >
                <el-form :model="editForm" :rules="editFormrules" ref="editruleForm" label-width="70px" >

                    <!-- 用户名部分 -->
                     <el-form-item label="用户名" prop="username" ><!--prop表示验证规则 -->
                        <!--addForm.username input框内的值  -->
                        <el-input v-model="editForm.username" disabled></el-input>
                    </el-form-item>
                    <!-- 邮箱部分 -->
                     <el-form-item label="邮箱" prop="email"><!--prop表示验证规则 -->
                        <!--addForm.username input框内的值  -->
                        <el-input v-model="editForm.email"></el-input>
                    </el-form-item>
                    <!-- 手机号部分 -->
                     <el-form-item label="手机号" prop="mobile"><!--prop表示验证规则 -->
                        <!--addForm.username input框内的值  -->
                        <el-input v-model="editForm.mobile"></el-input>
                    </el-form-item>
                </el-form>
                 <span slot="footer" class="dialog-footer">
                    <el-button @click="edmitdialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="edmitUser(editForm.id)">确 定</el-button>
                </span>
        </el-dialog>
  </div>
</template>

<script>
// 注册分页器的功能
import pagination from '../../components/Pagination';
export default {
name:"User",
components:{pagination},
data() {

    //自定义邮箱 手机表单验证

    // 邮箱验证
    var checkEmial=(rule,value,callback)=>{
        // rule 表示 value:表示input框内的值,callback表示一个回调方法
        const Emial=/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
        if(Emial.test(value)){
            return callback()   
        }
        // 如果验证不同过走以下
        return callback(new Error('请输入正确的邮箱'))
    }
    
    // 手机验证
    var checkTel =(rule,value,callback)=>{
        const mobile=/^(0|[3-9]|17951)?(13[0-9]|15[0123456789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
        if(mobile.test(value)){
            return callback()
        }
         // 如果验证不同过走以下
        return callback(new Error('请输入正确的手机号'))
    }

return {
    // 用户搜索的model值
    userserch:'',
    // 获取用户列表的参数
    queryInfo:{
        query:'',
        // 当前页数
        pagenum:1,
        // 当前页数可显示的数据
        pagesize:2 
    },
    // 用户列表的数据渲染 管理员身份
    userList:[],
    // 所有的数据
    total:0,
    // 控制用户对话框的显示和隐藏
    adddialogVisible:false,
    // 添加用户的表单数据
    addForm:{
        username:'',
        userpassword:'',
        useremail:'',
        usertel:''
    },
    // 添加用户的表单验证对象 
    addFormrules:{
        //用户名的验证规则
        username:[
            // 必填项  必须输入用户名
             { required: true, message: '请输入用户名', trigger: 'blur' },
             { min: 3, max: 10, message: '长度在 3 到 10个字符', trigger: 'blur' }
        ],
        userpassword:[
             { required: true, message: '请输入密码', trigger: 'blur' },
             { min: 3, max: 15, message: '长度在 3 到 15个字符', trigger: 'blur' }
        ],
        useremail:[
             { required: true, message: '请输入邮箱', trigger: 'blur' },
             {validator:checkEmial , trigger: 'blur'}
        ],
        usertel:[
             { required: true, message: '请输入手机号', trigger: 'blur' },
             {validator: checkTel, trigger: 'blur'}
        ]
    },
    // 点击某一项用户的id
    userId:null,
    // 控制用户修改弹出层的显示和隐藏
    edmitdialogVisible:false,
    // 当前修改框内的值
    editForm:{},
    // 用户修改表单验证
    editFormrules:{
       email:[
             { required: true, message: '请输入邮箱', trigger: 'blur' },
             {validator:checkEmial , trigger: 'blur'}
        ],
        mobile:[
             { required: true, message: '请输入手机号', trigger: 'blur' },
             {validator: checkTel, trigger: 'blur'}
        ]
    }
}
},
methods:{

 // 获取当前用户列表的数据
    getUserList(){
        this.http.get('/users',{
            params:this.queryInfo
        }).then((msg)=>{
            if(msg.data.meta.status==200){
                this.$message({
                message: '获取数据成功',
                type: 'success'
            });
            this.total=msg.data.data.total;
            this.userList=msg.data.data.users;
            }else{
            this.$message({
                message: '获取失败',
                type: 'warning'
            });
            }
        })
    },
    //  点击搜索进行我们的搜索渲染
    UserSearchList(){
        // 直接调用我们用户列表的数据进行同步
        this.getUserList()
    },
    // 用户列表状态的切换和改变
    userStateChange(e){
        console.log(e.id)
        this.http.put(`users/${Number(e.id)}/state/${e.mg_state}`).then((msg)=>{
            if(msg.data.meta.status==200){
                this.$message.warning('状态设置成功')
            }else{
                this.$message.error('状态切换失败')
            }
        })
    },
    // 点击添加用户显示隐藏
    addUserInfo(){
        this.adddialogVisible=!this.adddialogVisible;
    },
    // 点击确定进行用户添加
    addUser(){
        // 获取当前from表单的节点 内含有validate的回调方法\
        // 参数1就表示from表单的所有验证是否通过
        this.$refs.addruleForm.validate( valid =>{
            // 如果验证通过的话我们则发送一个ajax请求
            if(valid){
                this.http.post('/users',{
                    username:this.addForm.username,
                    password:this.addForm.userpassword,
                    email:this.addForm.useremail,
                    mobile:this.addForm.usertel
                }).then((msg)=>{
                    // 如果接口status的状态为201就重新刷新
                    console.log(msg.data)
                    if(msg.data.meta.status==201){
                        // 当他的状态码成功时,我们关闭当前层
                        this.adddialogVisible=!this.adddialogVisible;
                        this.$message.success('添加用户成功')
                        this.getUserList()
                    }else{
                          this.$message.error('添加用户失败')
                    }
                })
            }else{
                alert('重新检查用户信息是否有误')
            }
        })
    },
    // 点击修改 显示隐藏弹出层 并进行数据的亲求
    async editShowMessage(id){
        this.userId=id;
        this.edmitdialogVisible=true;
        // 请求当前修改项的数据
        let { data:res} = await this.http.get('/users/'+id);
        // 赋值
        this.editForm=res.data;
        console.log(this.editForm)
    },
    // 用户添加信息重置功能
    UserMessageClose(){
        // alert(1)
        console.log( this.$refs.addruleForm)
        this.$refs.addruleForm.resetFields()
    },
    // 点击修改的弹出层内的确定进行接口的调用
    async edmitUser(id){
        // alert(1)
        // 获取当前最后的from表单校验 如果都对则进行ajax请求
        this.$refs.editruleForm.validate(valid=>{
            if(valid){
                this.http.put('/users/'+id,this.editForm).then((msg)=>{
                     if(msg.data.meta.status==200){
                        this.edmitdialogVisible=false;
                        this.$message.success('编辑成功')
                        // 调用接口
                        this.getUserList()
                     }else{
                        this.$message.error('编辑失败')
                     }
                })
            }else{
                alert('重新检查用户信息是否有误')
            }
        })
    },

    // 点击删除
  openUserDelete(id) {
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',

        }).then(() => {
        // 数据进行删除
                this.http.delete('users/'+id).then((msg)=>{
                    console.log(msg)
                    if(msg.data.meta.status==200){
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        })
                        this.getUserList()
                    }
                })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
      }
},
//生命周期 - 创建完成（访问当前this实例）
created() {
    this.getUserList()
},
//生命周期 - 挂载完成（访问DOM元素）
mounted() {

}
}
</script>
<style scoped lang='scss'>
/* @import url(); 引入css类 */
.el-breadcrumb{
    margin-bottom: 15px;
    font-size: 12px;
}
.el-card{
    box-shadow: 0 1px 1px rgb(0, 0, 0.15) !important;
}
// tabel
.el-table{
    margin-top: 15px;
    font-size: 12px;
}

</style>