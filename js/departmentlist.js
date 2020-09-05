$(function(){
    //获取部门信息
    showdepartmentlist();
    async function showdepartmentlist(){
       let result =await axios.get('/department/list');
       if (result.code != 0) return alert("网络不给力，稍后再试~")
       let str=``;
       result.data.forEach(item=>{
           str+=`<tr>
           <td class="w10">${item.id}</td>
           <td class="w20">${item.name}</td>
           <td class="w40">${item.desc}</td>
           <td class="w20" departmentid='${item.id}'>
               <a href="javascript:;">编辑</a>
               <a href="javascript:;">删除</a>
           </td>
       </tr>
           `
       })
       $('tbody').html(str);
    }
    //编辑
    $('tbody').on('click',"a",async e=>{
      let target=e.target,
      tag=target.tagName,
      text = target.innerHTML.trim();
      if(tag == 'A'){
        let departmentId = $(target).parent().attr('departmentid');
        if(text=='编辑'){
            window.location.href=`departmentadd.html?id=${departmentId}`
            return;
        }  
        if(text=='删除'){
            let flag = confirm("你确定要删除此用户吗？")
            if (!flag) return;
            let result=await axios.get('/department/delete',{
                params:{
                    departmentId 
                }
            })
            if (result.code === 0) {
                alert("删除用户信息~");
                localStorage.removeItem('department');
                // 调用接口，删除掉的是数据库中的数据，还需要把页面中的用户删除了
                $(target).parent().parent().remove();
                return;
            }
            return;
        }
    }
    })
})
