$("#back").click(function() {
    $("html, body").animate({
        scrollTop: $("#top11").offset().top }, {duration: 500,easing: "swing"});
    return false;
}); 