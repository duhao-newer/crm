$(function () {
    let visitids = window.location.href.queryURLParams();
    //获取回访记录
    showvisit();
    async function showvisit() {
        let result = await axios.get('/visit/list', {
            params: {
                customerId: visitids.id
            }
        })
        let str = ``;
        if (result.code == 0) {
            result.data.forEach(item => {
                str += `<tr>
                <td class="w10">${item.id}</td>
                <td class="w15">${item.visitTime}</td>
                <td class="w45 wrap">${item.visitText}</td>
                <td class="w30" visitid=${item.id} >
                    <a href="javascript:;">编辑</a>
                    <a href="javascript:;">删除</a>
                </td>
            </tr>
                `;
                $('tbody').html(str);
            })
        }
    }
    //新增客户回访记录
    $('.submit').click(async function () {
        let visitTime = $('.visitTime').val();
        let customerId = $('.customerId').val();
        let visitId = $('.visitId').val();
        let visitText = $('.visitText').val().trim();
        let params = {
            visitTime,
            visitText,
            customerId: visitids.id
        }
        // params.customerId=customerId;
        // console.log(params)
        if(customerId){
            params.visitId=visitId;
            params.customerId=customerId;
            let result =await axios.post('/visit/update',params);
            if(result.code == 0){
                alert("修改记录成功");
                $('.visitTime').val('');
                $('.visitText').val('');
                $('.customerId').val('');
                $('.visitId').val('');
                showvisit();
                return ;
            }
            alert("网络不给力，稍后再试~")
            return ; // 如果编辑了，程序就结束了，写个return
        }
        let result = await axios.post('/visit/add', params);
        if (result.code != 0) {
            return alert('网络不给力~');
        }
        alert('添加客户成功~');
        $('.visitTime').val('');
        $('.visitText').val('');
        showvisit();
    })
    //删除
    $('tbody').on('click', 'a', async e => {
        let target = e.target,
            text = target.innerHTML.trim(),
            tag = target.tagName;
        if (tag == 'A') {
            let visitId = $(target).parent().attr('visitid');
            if (text == '编辑') {
                let result = await axios.get('/visit/info', {
                    params: {
                        visitId
                    }
                })
                $('.visitTime').val(result.data.visitTime);
                $('.visitText').val(result.data.visitText);
                $('.customerId').val(result.data.customerId);
                $('.visitId').val(result.data.id);
            }
            if (text == '删除') {
                let flag = confirm('你确定要删除此客户吗？');
                if (!flag) return;
                let result = await axios.get('/visit/delete', {
                    params: {
                        visitId
                    }
                })
                if (result.code == 0) {
                    alert('删除记录成功~');
                    $(target).parent().parent().remove();
                    return;
                }
                return;
            }
        }
    })
})