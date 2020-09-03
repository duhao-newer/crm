$(function () {
    let navBoxList = $('.navBox>a');
    let itemBoxList = null;
    init();
    let $plan = $.Callbacks();
    $plan.add((_, baseInfo) => {
        $('.baseBox>span').html(`你好，${baseInfo.name || ''} `)
    })
    $plan.add(power => {// "userhandle|departhandle|jobhandle|customerall"
        //初始化列表
        let str = ``;
        if (power.includes('userhandle')) {
            str += `
            <div class="itemBox" text='员工管理'>
            <h3>
                <i class="iconfont icon-yuangong"></i>
                员工管理
            </h3>
            <nav class="item">
                <a href="page/userlist.html" target="iframeBox">员工列表</a>
                <a href="page/useradd.html" target="iframeBox">新增员工</a>
            </nav>
        </div>
            `
        }
        if (power.includes('departhandle')) {
            str += `
            <div class="itemBox" text='部门管理'>
				<h3>
					<i class="iconfont icon-yuangong"></i>
					部门管理
				</h3>
				<nav class="item">
					<a href="page/departmentlist.html" target="iframeBox">部门列表</a>
					<a href="page/departmentadd.html" target="iframeBox">部门管理</a>
				</nav>
			</div>
            `
        }
        if (power.includes('jobhandle')) {
            str += `
            <div class="itemBox" text='职位管理'>
				<h3>
					<i class="iconfont icon-yuangong"></i>
					职位管理
				</h3>
				<nav class="item">
					<a href="page/joblist.html" target="iframeBox">职位列表</a>
					<a href="page/jobadd.html" target="iframeBox">新增职位</a>
				</nav>
			</div>
            `
        }
        if (power.includes('customerall')) {
            str += `
            <div class="itemBox" text='客户管理'>
				<h3>
					<i class="iconfont icon-kehuguanli"></i>
					客户管理
				</h3>
				<nav class="item">
                    <a href="page/customerlist.html" target="iframeBox">我的客户</a>
                    <a href="page/customerlist.html" target="iframeBox">全部客户</a>
					<a href="page/customeradd.html" target="iframeBox">新增客户</a>
				</nav>
			</div>
            `
        }
        $(".menuBox").html(str);
        itemBoxList = $('.menuBox').find(".itemBox");
        //初始化左侧列表
        let initindex = power.includes('customerall') ? 0 : 1;
        navBoxList.eq(initindex).addClass("active").siblings().removeClass('active');
        handGroup(initindex);
        //实现tab选项卡
        navBoxList.click(function () {
            let text = $(this).html().trim();
            let index = $(this).index();
            //控制权限
            if ((text == '客户管理') && !/customerall/.test(power) || (text == '组织结构') && !/(userhandle|departhandle|jobhandle)/.test(power)) {
                 alert('你没有权限访问!!!');
                 return;
            }
            $(this).addClass("active").siblings().removeClass('active');
            handGroup(index);
        })
        //初始默认页面
        let url='page/customerlist.html';
        if(power.includes('customerall')){
            $(".iframeBox").attr('src',url);
        }
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
        power.code == 0 ? power = power.power : null;
        baseInfo.code == 0 ? baseInfo = baseInfo.data : null;
        $plan.fire(power, baseInfo);
    }
    //把列表分组
    function handGroup(index) {
        let group1 = itemBoxList.filter((_, item) => {
            let text = $(item).attr("text");
            return text == '客户管理';
        })
        let group2 = itemBoxList.filter((_, item) => {
            let text = $(item).attr("text");
            return /^(员工管理|部门管理|职位管理)/.test(text);
        })
        if (index == 0) {
            group1.css('display', 'block');
            group2.css("display", 'none');
        } else {
            group1.css('display', 'none');
            group2.css("display", 'block');
        }
    }
    //退出登录
    $(".baseBox>a").click(async function () {
        let res = await axios.get('/user/signout');
        if (res.code == 0) {
            window.location.href = 'login.html';
            return;
        }
        alert("网络不给力，稍后再试")
    })
})