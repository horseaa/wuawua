(function() {
    var day = hour = minitus = second = ms = 0;
    var year = new Date().getFullYear() + 1;
    var tmp = new Date(year, 0, 1) - new Date(); day = Math.floor(tmp / 86400000);
    (function() {
        tmp = (new Date(year, 0, 1) - new Date()) % 86400000;
        hour = Math.floor(tmp / 3600000);
        tmp %= 3600000;
        minitus = Math.floor(tmp / 60000);
        tmp %= 60000;
        second = Math.floor(tmp / 1000);
        ms = tmp - 1000 * second;
        
        document.getElementsByClassName("time")[0].innerHTML = "距离" + year + "年还有 " + day + " 天 " + hour + " 小时 " + minitus + " 分 " + second + " 秒 " ;
        setTimeout(arguments.callee, 50);
    })(); 
})();


function apply(){
let apply_btn=document.getElementById("apply_btn");
let apply_num=document.getElementById("apply_num");
let  residue_num=document.getElementById("residue_num");
apply_btn.onclick=function(){

if((parseInt(residue_num.textContent)-1 )>=0){
apply_num.textContent= parseInt(apply_num.textContent)+1 +"人申请";
residue_num.textContent= parseInt(residue_num.textContent)-1 +"台";
// apply_num.innerHTML=apply_num.textContent
// residue_num.innerHTML=residue_num.textContent
}
else{
alert("被抢完了")
}
}
}