$(function () {
    init();
    let $plan = $.Callbacks();
    $plan.add((_, baseInfo) => {
        $('.baseBox>span').html(`你好，${baseInfo.name || ''} `)
    })
    $plan.add(power => {
        
    })
    //初始化，查看用户的信息和权限
    async function init() {
        //查看用户是否登录
        let res = await axios.get('/user/login');
        if (res.code != 0) {
            alert('请先登录');
            window.location.href = 'login.html';
            return;
        }
        //获取用户信息和权限
        let [power, baseInfo] = await axios.all([
            axios.get('/user/power'),
            axios.get('/user/info')
        ])
        baseInfo.code == 0 ? baseInfo = baseInfo.data : null;
        $plan.fire(power,baseInfo); 
    }
    //退出登录
    $(".baseBox>a").click(async function(){
        let res=await axios.get('/user/signout');
        if(res.code ==0){
            window.location.href='login.html';
            return;
        }
        alert("网络不给力，稍后再试")
    })
})