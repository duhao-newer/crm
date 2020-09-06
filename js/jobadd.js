$(function () {
    let jobId = null;
    let jobids = window.location.href.queryURLParams();
    //判断是否为编辑
    if (jobids.hasOwnProperty("id")) {
        jobId = jobids.id;
        showjob();
    }
    //校验部门
    function checkjobname() {
        let jobname = $('.jobname').val().trim();
        if (jobname.length == 0) {
            $('.spanjobname').html('此项为必填项~');
            return false;
        }
        if (!/^[\u4e00-\u9fa5]{2,5}$/.test(jobname)) {
            $(".spanjobname").html('名字必须是2到5个汉字~');
            return false;
        }
        $(".spanjobname").html('ok~');
        return true;
    }
    $(".jobname").blur(checkjobname);
    //新增job
    $('.submit').click(async function () {
        if (!checkjobname()) {
            alert("你填写的数据不合法~");
            return;
        }
        let id_array = new Array();
        $('input[name="job"]:checked').each(function () {
            id_array.push($(this).val());//向数组中添加元素  
        });
        let idstr = id_array.join('|');//将数组元素连接起来以构建一个字符串  
        let params = {
            name: $('.jobname').val().trim(),
            desc: $('textarea').val().trim(),
            power: idstr
        }
        //判断是编辑还是新增
        if(jobId){
            params.jobId = jobId;
            let result=await axios.post('/job/update',params);
            if(result.code == 0){
                alert("修改数据成功")
                window.location.href = "joblist.html"
                return ;
            }
            alert("网络不给力，稍后再试~")
            return ; // 如果编辑了，程序就结束了，写个return
        }
        //执行新增
        let result = await axios.post('/job/add', params);
        if (result.code == 0) {
            localStorage.removeItem('job');
            alert('添加部门成功~');
            window.location.href = 'joblist.html';
            return;
        }
        alert('网络不给力~');
    })
    //回显数据
    async function showjob() {
        let result = await axios.get('/job/info', {
            params: { jobId }
        })
        if (result.code == 0) {
            $('.jobname').val(result.data.name);
            $('textarea').val(result.data.desc);
            if (result.data.power.includes('userhandle')) {
                $('#userhandle').prop('checked',true);
            }
            if (result.data.power.includes('departhandle')) {
                $('#departhandle').prop('checked',true);
            }
            if (result.data.power.includes('jobhandle')) {
                $('#jobhandle').prop('checked',true);
            }
            if (result.data.power.includes('customerall')) {
                $('#customerall').prop('checked',true);
            }
            if (result.data.power.includes('customermy')) {
                $('#customermy').prop('checked',true);
            }
            return;
        }
        alert("编辑不成功，可能是网络不给力....")
        jobId = null;
    }
})