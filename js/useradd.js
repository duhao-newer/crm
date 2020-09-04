$(function () {
    let userId = null;
    let ids = window.location.href.queryURLParams();
    initDeptAndJob();
    //初始化部门和职务
    async function initDeptAndJob() {
        let dapartment = await queryDepart();
        let jobData = await queryJob();
        if (dapartment.code == 0) {
            dapartment = dapartment.data;
            let str = ``;
            dapartment.forEach(item => {
                str += `<option value="${item.id}">${item.name}</option>`;
            })
            $(".userdepartment").html(str);
        }
        if (jobData.code == 0) {
            jobData = jobData.data;
            let str = ``;
            jobData.forEach(item => {
                str += `<option value="${item.id}">${item.name}</option>`;
            })
            $(".userjob").html(str);
        }
    }
    //对名字进行校验
    function checkname() {
        let val = $('.username').val().trim();
        if (val.length == 0) {
            $(".spanusername").html('此为必填项~');
            return false;
        }
        if (!/^[\u4e00-\u9fa5]{2,10}$/.test(val)) {
            $(".spanusername").html('名字必须是2到10个汉字~');
            return false;
        }
        $(".spanusername").html('ok~');
        return true;
    }
    //对邮箱进行校验
    function checkemail() {
        let val = $('.useremail').val().trim();
        if (val.length == 0) {
            $(".spanuseremail").html('此为必填项~');
            return false;
        }
        if (!/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/.test(val)) {
            $(".spanuseremail").html('邮箱格式不正确~');
            return false;
        }
        $(".spanuseremail").html('ok~');
        return true;
    }
    //对手机号进行校验
    function checkphone() {
        let val = $('.userphone').val().trim();
        if (val.length == 0) {
            $(".spanuserphone").html('此为必填项~');
            return false;
        }
        if (!/^[1][3,4,5,7,8,9][0-9]{9}$/.test(val)) {
            $(".spanuserphone").html('手机格式不正确~');
            return false;
        }
        $(".spanuserphone").html('ok~');
        return true;
    }
    $('.userphone').blur(checkphone)
    $('.username').blur(checkname)
    $('.useremail').blur(checkemail)
    //提交数据
    $('.submit').click(async function () {
        if (!checkphone() || !checkname() || !checkemail()) {
            alert("你填写的数据不合法~");
            return;
        }
        //提交数据
        let params = {
            name: $('.username').val().trim(),
            sex: $("#man").prop('checked') ? 0 : 1,
            email: $('.useremail').val().trim(),
            phone: $('.userphone').val().trim(),
            departmentId: $(".userdepartment").val(),
            jobId: $(".userjob").val(),
            desc: $(".userdesc").val().trim()
        }
        //判断是编辑提交还是新增提交
        if(userId){
            params.userId = userId;
            // 编辑
            let result = await axios.post("/user/update",params)
            if(result.code == 0){
                alert("修改数据成功")
                window.location.href = "userlist.html"
                return ;
            }
            alert("网络不给力，稍后再试~")
            return ; // 如果编辑了，程序就结束了，写个return
        }
        let result = await axios.post('/user/add', params)
        if (result.code == 0) {
            alert('添加员工成功~');
            window.location.href = 'userlist.html';
            return;
        }
        alert('网络不给力~');
    })
    //编辑之数据回显
    if (ids.hasOwnProperty('id')) {
        userId = ids.id;
        getBaseInfo();
    }
    async function getBaseInfo() {
        let result = await axios.get("/user/info", {
            params: { userId }
        })
        if (result.code === 0) {
            // 给表单中塞数据，实现数据的回显
            result = result.data;
            $(".username").val(result.name);
            result.sex == 0 ? $("#man").prop('checked', true) : $("#woman").prop('checked', true);
            $(".useremail").val(result.email);
            $(".userphone").val(result.phone);
            $(".userdepartment").val(result.departmentId);
            $(".userjob").val(result.jobId);
            $(".userdesc").val(result.desc);
            return;
        }
        alert("编辑不成功，可能是网络不给力....")
        userId = null;
    }
})