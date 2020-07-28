<template>
  <div id="Pagination">
           <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum"
                :page-sizes="[1,2,5,10]"
                :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
  </div>
</template>

<script>
export default {
name:"Pagination",
props:[
    "queryInfo",
    "total",
],
data() {
return {

}
},
methods:{
        // 监听
    handleSizeChange(newSize){
        // console.log(newSize)
        this.queryInfo.pagesize=newSize;
        this.$emit('getUserList')
    },
    //监听页码值改变的事件 
    handleCurrentChange(newPage){
        console.log(newPage)
        this.queryInfo.pagenum=newPage;
        this.$emit('getUserList')
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
<style scoped>
/* @import url(); 引入css类 */

</style>