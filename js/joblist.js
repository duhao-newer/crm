$(function(){
    //获取职位信息
    showjoblist();
    async function showjoblist(){
        let result = await axios.get('/job/list');
        if (result.code != 0) return alert("网络不给力，稍后再试~")
        let str=``;
        result.data.forEach(item=>{
            str+=`
            	<tr>
				<td class="w8">${item.id}</td>
				<td class="w10">${item.name}</td>
				<td class="w20">${item.desc}</td>
				<td class="w50">${item.power}</td>
				<td class="w12" jobid=${item.id}>
					<a href="javascript:;">编辑</a>
					<a href="javascript:;">删除</a>
				</td>
			</tr>
            `
        })
        $('tbody').html(str);
    }
    //事件
    $('tbody').on('click',"a",async e=>{
        let target=e.target,
        tag=target.tagName,
        text = target.innerHTML.trim();
        if(tag == 'A'){
          let jobId = $(target).parent().attr('jobid');
          if(text=='编辑'){
              window.location.href=`jobadd.html?id=${jobId}`
              return;
          }  
          if(text=='删除'){
              let flag = confirm("你确定要删除此职位吗？")
              if (!flag) return;
              let result=await axios.get('/job/delete',{
                  params:{
                    jobId 
                  }
              })
              if (result.code === 0) {
                  alert("删除职位信息~");
                  localStorage.removeItem('job');
                  // 调用接口，删除掉的是数据库中的数据，还需要把页面中的用户删除了
                  $(target).parent().parent().remove();
                  return;
              }
              return;
          }
      }
    })

})