$(function(){
    //登录功能
    $(".submit").click(async function(e){
        let account=$(".userName").val().trim();
        let password=$(".userPass").val().trim();
        //判断是否为空
        if(account=='' || password =='') return alert("用户名和密码不能为空！");
        //对密码进行加密
        password=md5(password);
        //普通的axios
        // axios.post('/user/login',{
        //     account,
        //     password
        // }).then(res=>{
        //     console.log(res);
        // }).catch(reason=>{
        //     console.log(reason);
        // })
        //进行升级改进,使用 async+await只能获取正确的结果，想要获取错误，需要用try/catch
        let res=await axios.post('/user/login',{account,password})
        if(parseInt(res.code)==0){
            alert('登录成功');
            window.location.href='index.html';
            return;
        }
        alert('用户名和密码出错了');
    })

})