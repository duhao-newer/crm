$(function () {
    //校验用户名
    function checkusername() {
        let username = $('.username').val().trim();
        if (username.length == 0) {
            $('.spanusername').html('此项为必填项~');
            return false;
        }
        if (!/^[\u4e00-\u9fa5]{2,10}$/.test(username)) {
            $('.spanusername').html('要求为2~10个汉字~');
            return false;
        }
        $('.spanusername').html('ok~');
        return true;
    }
    //校验邮箱
    function checkuseremail() {
        let useremail = $('.useremail').val().trim();
        if (useremail.length == 0) {
            $('.spanuseremail').html('此项为必填项~');
            return false;
        }
        if (!/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/.test(useremail)) {
            $(".spanuseremail").html('邮箱格式不正确~');
            return false;
        }
        $(".spanuseremail").html('ok~');
        return true;
    }
    //校验电话
    function checkuserphone() {
        let userphone = $('.userphone').val().trim();
        if (userphone.length == 0) {
            $('.spanuserphone').html('此项为必填项~');
            return false;
        }
        if (!/^[1][3,4,5,7,8,9][0-9]{9}$/.test(userphone)) {
            $(".spanuserphone").html('手机格式不正确~');
            return false;
        }
        $(".spanuserphone").html('ok~');
        return true;
    }
    //校验qq
    function checkuserqq() {
        let qq = $('.userqq').val().trim();
        if (qq.length == 0) {
            $('.spanuserqq').html('此项为必填项~');
            return false;
        }
        if (!/[1-9][0-9]{4,10}$/.test(qq)) {
            $('.spanuserqq').html('qq格式不正确~');
            return false;
        }
        $(".spanuserqq").html('ok~');
        return true;
    }
    //校验微信
    function checkuserweixin() {
        let userweixin = $(".userweixin").val().trim();
        if (userweixin.length == 0) {
            $('.userweixin').html('此项为必填项~');
            return false;
        }
        if (!/^[a-zA-Z\d_]{5,}$/.test(userweixin)) {
            $('.userweixin').html('微信格式不正确~');
            return false;
        }
        $('.userweixin').html('ok~');
        return true;
    }
    $('.username').blur(checkusername);
    $('.useremail').blur(checkuseremail);
    $('.userphone').blur(checkuserphone);
    $('.userqq').blur(checkuserqq);
    $('.userweixin').blur(checkuserweixin);
    //提交数据
    $('.submit').click(async function () {
        if (!checkusername() || !checkuseremail() || !checkuserphone() || !checkuserqq() || !checkuserweixin()) {
            alert("你填写的数据不合法~");
            return;
        }
        let params = {
            name: $('.username').val().trim(),
            sex: $('#man').prop('checked') ? 1 : 0,
            email: $('.useremail').val().trim(),
            phone: $('.userphone').val().trim(),
            QQ: $('.userqq').val().trim(),
            weixin: $(".userweixin").val().trim(),
            type: $('.select').val(),
            address: $('textarea').val(),
        }
        //post请求params并不是必须的~
        let result = await axios.post('/customer/add', params);
        if (result.code != 0) {
            return alert('网络不给力~');
        }
        alert('添加客户成功~');
        window.location.href = 'customerlist.html?lx=my';
    })
})