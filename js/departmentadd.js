$(function () {
    let departmentId=null;
    let departids = window.location.href.queryURLParams();
    //校验部门
    function checkdepartname() {
        let departname = $('.departname').val().trim();
        if (departname.length == 0) {
            $('.spandepartname').html('此项为必填项~');
            return false;
        }
        if (!/^[\u4e00-\u9fa5]{2,5}$/.test(departname)) {
            $(".spandepartname").html('名字必须是2到5个汉字~');
            return false;
        }
        $(".spandepartname").html('ok~');
            return true;
    }
    $(".departname").blur(checkdepartname);
    //新增部门
    $('.submit').click(async function(){
        if(!checkdepartname()){
            alert("你填写的数据不合法~");
            return;
        }
        let params={
            name:$('.departname').val().trim(),
            desc:$('textarea').val(),
        }
        if(departmentId){
            params.departmentId = departmentId;
            let result=await axios.post('/department/update',params);
            if(result.code == 0){
                alert("修改数据成功")
                window.location.href = "departmentlist.html"
                return ;
            }
            alert("网络不给力，稍后再试~")
            return ; // 如果编辑了，程序就结束了，写个return
        }
        let result=await axios.post('/department/add',params);
        if (result.code == 0) {
            localStorage.removeItem('department');
            alert('添加部门成功~');
            window.location.href = 'departmentlist.html';
            return;
        }
        alert('网络不给力~');
    })
    //编辑之数据回显
    if (departids.hasOwnProperty('id')) {
        departmentId = departids.id;
        getdepartmentInfo();
    }
    async function getdepartmentInfo(){
        let result=await axios.get('/department/info',{
            params: { departmentId }
        })
        if(result.code==0){
            $('.departname').val(result.data.name);
            $('textarea').val(result.data.desc);
            return;
        }
        alert("编辑不成功，可能是网络不给力....")
        departmentId=null;
    }
})