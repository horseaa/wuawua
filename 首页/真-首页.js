    var mySwiper = new Swiper('.swiper-container', {
        direction: 'horizontal', // 水平切换选项
        autoplay: true,
        loop: true, // 循环模式选项

        // 如果需要分页器
        pagination: {
            el: '.swiper-pagination',
        },

        // 如果需要前进后退按钮
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        autoplay: {
        delay: 3000,
        stopOnLastSlide: false,
        disableOnInteraction: true,
        },
    })

// <!-- 报告 -->

{/* <a href="../试用2模块/试用2.html"></a>
<a href="../gao、html/导购3.html"></a>
<a href="../gao、html/导购清单1.html"></a>
<a href="../gao、html/导购清单2.html"></a>
<a href="../报告模块/report/report-hot.html"></a>
<a href="../帮助与合作模块/合作.html"></a>
../gao、html/酷玩1.html
<a href="../帮助与合作模块/帮助.html"></a>
<a href="../试用模块/use_all.html"></a> */}
    const ul11=$("#ul11")
axios.defaults.baseURL = 'http://192.168.31.5:3000'
// btn3.onclick=function(){
  axios({
      method:'get',
      url:"report/hot",
  }).then(response=>{
console.log(response.data);
      for (let i = 0; i < 8; i++) {
         let newNode= `       
                  <li>
					<a href="../报告模块/report/report-hot.html">
						<img src="${response.data[i].img}" width="220" height="130">
						<div class="info">
							<p class="name">${response.data[i].text}</p>
							<div class="tip fix">
								<span class="nick left"> 苏苏</span>
								<div class="right icon">
									<span class="zan">3</span>
									<span class="look">3</span>
								</div>
							</div>
						</div>
					</a>
				</li>
`
ul11.append(newNode)     
  }
})

// <!-- 导购精选 -->

const ul22=$("#ul22")
  axios.defaults.baseURL = 'http://192.168.31.5:3000'
    axios({
        method:'get',
        url:"guid/new",
    }).then(response=>{
console.log(response.data);

for (let i = 0; i < 4; i++) {
           let newNode= `    
          <li>
				<a href="../gao、html/导购3.html">
					<img src="${response.data[i].img}" width="220" height="130">
					<div class="info">
						<p class="name">${response.data[i].text}</p>
						<div class="tip fix">
							<div class="right icon">
								<span class="xin">>${response.data[i].like}</span>
								<span class="look">${response.data[i].words}</span>
							</div>
						</div>
					</div>
				</a>
			</li>
`
ul22.append(newNode)
    }
})

// <!-- -------------------发现酷玩---------------- -->

      const myDiv=$("#myDiv")
  axios.defaults.baseURL = 'http://192.168.31.5:3000'
    axios({
        method:'get',
        url:"play/new",
    }).then(response=>{
console.log(response.data);
        for(let k=0;k<4;k++){
        for (let i = 0; i < 6; i++) {
           let newNode= `
          <li>
					<a href="../gao、html/酷玩1.html">
						<img src="${response.data[k][i+2].img}" height="130">
						<div class="info">
							<p class="name"><span>${response.data[k][i+2].text}</span></p>
							<div class="tip fix">
								<span class="price left"> ${response.data[k][i+2].price}</span>
								<div class="right icon">
									<span class="xin">${response.data[k][i+2].like}</span>
									<span class="look">${response.data[k][i+2].words}</span>
								</div>
							</div>
						</div>
					</a>
				</li>
`
myDiv.append(newNode)     
    }}
})


// <!-- 加载更多 -->

    let playmore=document.getElementsByClassName("playMore")[0];
    let play=document.getElementById('play');
    play.style.height="942px"
    playmore.onclick=function(){
        play.style.height=parseInt(play.style.height)+ 294 +"px"
    
        
    }


// <!-- 回到顶部 -->

  $("#back").click(function() {
        $("html, body").animate({
            scrollTop: $("#top11").offset().top }, {duration: 500,easing: "swing"});
        return false;
    }); 