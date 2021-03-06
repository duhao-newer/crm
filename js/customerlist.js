$(function () {
    let lx = 'my';
    let limit = 10;
    let page = 1;
    let totaPage = 1;
    let total = 0;
    let params = window.location.href.queryURLParams();
    params.lx ? lx = params.lx : null;
    //获取客户列表
    showCustomerList();
    async function showCustomerList() {
        let result = await axios.get('/customer/list', {
            params: {
                lx,
                type: $(".selectBox").val(),
                search: $(".searchInp").val().trim(),
                limit,
                page,
            }
        })
        if (result.code != 0) return alert("网络不给力，稍后再试~")
        totalPage = parseInt(result.totalPage);
        total = parseInt(result.total);
        let str = ``;
        result.data.forEach(item => {
            let {
                id,
                name,
                sex,
                email,
                phone,
                QQ,
                weixin,
                type,
                address,
                userName
            } = item;
            str += `<tr>
				<td class="w8">${name}</td>
				<td class="w5">${sex == 0 ? '男' : '女'}</td>
				<td class="w10">${email}</td>
				<td class="w10">${phone}</td>
				<td class="w10">${weixin}</td>
				<td class="w10">${QQ}</td>
				<td class="w5">${type}</td>
				<td class="w8">${userName}</td>
				<td class="w20">${address}</td>
				<td class="w14" customerId="${id}">
					<a href="javascript:;">编辑</a>
					<a href="javascript:;">删除</a>
					<a href="visit.html?id=${id}">回访记录</a>
				</td>
			</tr>`;
        })
        $("tbody").html(str);
        if (totalPage > 1) {
            str = ``;
            page > 1 ? str += `<a href="javascript:;">上一页</a>` : null;
            str += `<ul class="pageNum">`;
            for (let i = 1; i <= totalPage; i++) {
                str += `<li class="${i == page ? 'active' : ''}">${i}</li>`;
            }
            str += `</ul>`;
            page < totalPage ? str += `<a href="javascript:;">下一页</a>` : null;
            $(".pageBox").html(str);
        }
    }
    // 根据条件显示客戶列表
    searchHandle();
    function searchHandle() {
        $(".selectBox").change(showCustomerList);
        $(".searchInp").on("keydown", e => {
            if (e.keyCode === 13) {  // 回车
                showCustomerList();
            }
        })
    }
    // 使用事件委托实现分页功能
    $(".pageBox").click(e => {
        let target = e.target,
            tag = target.tagName,
            text = target.innerHTML,
            temp = page;

        if (tag === "A") {
            // 点击了上一页和下一页
            if (text === "上一页") { temp--; }
            if (text === "下一页") { temp++; }
        }
        if (tag === "LI") {
            // 点击了中间的数字
            temp = parseInt(text)
        }
        temp !== page ? (page = temp, showCustomerList()) : null;
    });
    //利用事件委托实现编辑，删除
    $('tbody').on('click', 'a',async e => {
        // console.log(e.target)//<a href="javascript:;">编辑</a>
        let target = e.target,
            text = target.innerHTML.trim(),
            tag = target.tagName;
        if (tag == 'A') {
            let customerId=$(target).parent().attr('customerId');
            if(text=='编辑'){
                window.location.href=`customeradd.html?id=${customerId}`
                return;
             }
            if(text=='删除'){
                let flag=confirm('你确定要删除此客户吗？');
                if(!flag) return;
                let result=await axios.get('/customer/delete',{
                    params:{
                        customerId
                    }
                })
                if(result.code ==0){
                    alert('删除客户成功~');
                    $(target).parent().parent().remove();
                    return;
                }
                return;
            }
        }

    })
})