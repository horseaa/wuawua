const ul1=$(".one5-1").eq(0)
  axios.defaults.baseURL = 'http://192.168.31.5:3000'
    axios({
        method:'get',
        // url:"/useing/public",
        url:"useing/master",
        // url:"report/new",
        // url:"report/hot",
        // url:"play/new",
        // url:"play/hot",双重
        // url:"guid/new",
        // url:"guid/hot",

    }).then(response=>{
console.log(response.data);
        for (let i = 0; i < response.data.length; i++) {
           let newNode= `
           <li>
                        <span class="one5-2">首发</span>
                        <img src="${response.data[i].img}" width="220" height="130">
                        <div class="one5-3">
                            <h2 class="name">${response.data[i].text}</h2>
                            <p class="one5-4">
                                <span>${response.data[i].totalnum}</span>
                                <span>${response.data[i].num}台</span>
                            </p>
                            <p class="one5-5">
                                <span>${response.data[i].apply}</span>
                                申请
                            </p>
                            <p class="one5-6">报告数量：8</p>
                        </div>
                    </li>
`
ul1.append(newNode)
        
    }

})