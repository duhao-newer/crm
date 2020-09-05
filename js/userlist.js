$(function () {
    let checkList = null;
    //初始化部门下拉菜单
    initdepart();
    async function initdepart() {
        let dapartment = await queryDepart();
        if (dapartment.code == 0) {
            dapartment = dapartment.data;
            let str = ``;
            dapartment.forEach(item => {
                str += `<option value="${item.id}">${item.name}</option>`;
            })
            $(".selectBox").html(str);
        }
    }
    //展示员工列表
    showUserList();
    async function showUserList() {
        let params = {
            departmentId: $(".selectBox").val(),
            search: $(".searchInp").val().trim()
        }
        let result = await axios.get('/user/list', { params });
        if (result.code != 0) return alert("没有找到相关人员");
        let str = ``;
        result.data.forEach(item => {
            let {
                id, name, sex, email, phone, department, job, desc
            } = item;
            str += `<tr>
            <td class="w3"><input type="checkbox" userId="${id}"></td>
            <td class="w10">${name}</td>
            <td class="w5">${sex == 0 ? '男' : '女'}</td>
            <td class="w10">${department}</td>
            <td class="w10">${job}</td>
            <td class="w15">${email}</td>
            <td class="w15">${phone}</td>
            <td class="w20">${desc}</td>
            <td class="w12" userId="${id}">
                <a href="javascript:;">编辑</a>
                <a href="javascript:;">删除</a>
                <a href="javascript:;">重置密码</a>
            </td>
        </tr>`;
        })
        $("tbody").html(str);
        checkList = $("tbody").find('input[type="checkbox"]');
    }
    // 根据条件显示员工列表
    searchHandle();
    function searchHandle() {
        $(".selectBox").change(showUserList);
        $(".searchInp").on("keydown", e => {
            if (e.keyCode === 13) {  // 回车
                showUserList();
            }
        })
    }
    //基于事件委托实现功能
    delegate();
    async function delegate() {
        $('tbody').on('click', 'a', async e => {
            let target = e.target,
                tag = target.tagName,
                text = target.innerHTML.trim();
            if (tag == "A") {
                let userId = $(target).parent().attr('userid');
                if (text == '编辑') {
                    window.location.href = `useradd.html?id=${userId}`
                    return;
                }
                if (text == '删除') {
                    let flag = confirm("你确定要删除此用户吗？")
                    if (!flag) return;
                    let result = await axios.get("/user/delete", {
                        params: { userId }
                    })
                    if (result.code === 0) {
                        alert("删除用户信息~");
                        // showUserList();
                        // 调用接口，删除掉的是数据库中的数据，还需要把页面中的用户删除了
                        $(target).parent().parent().remove();
                        checkList = $("tbody").find('input[type="checkbox"]')
                        return;
                    }
                    return;
                }
                if (text == '重置密码') {
                    // 不是去修改密码，修改密码，后面说
                    let flag = confirm("你确定要重置此用户的密码吗？")
                    if (!flag) return;
                    let result = await axios.post("/user/resetpassword", {
                        userId
                    })
                    if (result.code === 0) {
                        alert("重置密码成功，告诉你的员工~")
                        return;
                    }
                    return;
                }
            }
        })
    }
    //全选
    $('#checkAll').click(e => {
        let checked = $("#checkAll").prop("checked")
        checkList.prop("checked", checked)
    })
    //矫正全选
    $("tbody").on("click", "input", e => {
        if (e.target.tagName === "INPUT") {
            let flag = true;
            // console.log(checkList)
            newCheckList = Array.from(checkList)
            newCheckList.forEach(item => {
                if (!$(item).prop("checked")) {
                    // 有小框框没有勾选
                    flag = false;
                }
            })
            $("#checkAll").prop("checked", flag)
        }
    })
    // 实现批量删除
    $(".deleteAll").click(e => {
        // 找到你勾选的用户，把此用户的userId放到一个数组中
        let arr = [];
        [].forEach.call(checkList, item => {
            if ($(item).prop("checked")) {
                // 选中了
                arr.push($(item).attr('userid'))
            }
        })
        // console.log(arr)
        if (arr.length === 0) {
            alert("你需要先选中一些用户~")
            return;
        }
        let flag = confirm("你确定要删除这些用户吗？")
        if (!flag) return;
        let index = -1;
        async function deleteUser() {
            let userId = arr[++index];
            if (index >= arr.length) { // 递归的出口
                alert("已成功删除员工~")
                showUserList();
                return;
            }
            let result = await axios.get("/user/delete", {
                params: {
                    userId
                }
            })
            if (result.code != 0) {
                // 删除失败了
                return;
            }
            deleteUser();
        }
        deleteUser();
    });
})