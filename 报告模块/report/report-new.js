const ul1=$("#myDiv")
axios.defaults.baseURL = 'http://192.168.31.5:3000'
// btn3.onclick=function(){
  axios({
      method:'get',
      // url:"/useing/public",
      // url:"useing/master",
      url:"report/new",
      // url:"report/hot",
      // url:"play/new",
      // url:"play/hot",双重
      // url:"guid/new",
      // url:"guid/hot",

  }).then(response=>{
console.log(response.data);
     

  
      for (let i = 0; i < 7; i++) {
         let newNode= `
         <li>
                      <a href="../report/report-hot.html">
                          <img src="${response.data[i+6].img}" width="700" height="412">
                          <div class="info">
                              <p class="title">${response.data[i+6].text}</p>
                              <div class="btm fix">
                                  <div class="userInfo left">
                                      <span class="avt"></span>
                                      <span class="name">苏苏</span>
                                      <span class="time">${response.data[i+6].endTime}</span>
                                  </div>
                                  <div class="right icon">
                                      <span class="zan">3</span>
                                      <span class="look">3</span>
                                  </div>
                              </div>
                          </div>
                      </a>
                  </li>
`

ul1.append(newNode)
     
  }

})