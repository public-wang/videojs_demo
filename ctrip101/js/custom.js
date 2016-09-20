
/*!VIPABC | Author by Mike Li*/
/*!v3.0 | 2016-7-29*/
/*!License: vipabc.com*/

$(document).ready(function() {


	/*----------------- 关闭兼容性提示 ----------------*/
	$(".cp-tips-close").click(function(e) {
        $(".cp-tips").slideUp(400);
    });


	/*------------- 立即体验 ------------*/
	if (navigator.userAgent.match(/mobile/i) && !navigator.userAgent.match(/iPad/i) ) {

		$(".getFree").click(function(e) {

			$("html,body").animate({
				scrollTop: $("#form-wrap").offset().top

			});
			return false;

		});


	}else{

		$(".getFree").click(function(e) {

			var $form_wrap = $("#section-form-wrap");
			//$form_wrap.css({"z-index":10000});

			// if($(".bg_lay")){
			// 	$(".bg_lay").remove();
			// }
			var _top = $form_wrap.offset().top - 190;
			//$("body").append('<div class="bg_lay"></div>');
			$("html,body").animate({
				scrollTop: _top

			});

			return false;

		});

	}


});


//fix header

var Is_show = false;      //全局变量

$(document).ready(function() {


	function nav_fixed(){

		var $offset = $(".header-fixed").offset();
		var $follow = $(".header");
		var $header_btn = $("#header-btn");
		var _top = 0;
		//var final = $(".section06").offset().top;
		var winTop = $(window).scrollTop();
		if( winTop > 40 ){
			if( Is_show === false ){
				$follow.css({
					"position":"fixed",
					"_position":"absolute",
					"top": _top,
					"left":$offset.left,
					"box-shadow":"rgba(0, 0, 0, 0.4) 0px 1px 3px",
					"z-index":"9020"
				});

				$header_btn.fadeIn();

				Is_show = true;
			}
			else{
				$follow.css({
					"top":_top
				});
			}
		}else{
			$follow.removeAttr("style");

			if($header_btn.is(":visible")){
				$header_btn.hide();
			}

			Is_show = false;
		}


	};

	//PC导航随着页面一起滚动
	if (!(navigator.userAgent.match(/mobile/i) && !navigator.userAgent.match(/iPad/i) )) {

		$(window).on("scroll",function(){
			nav_fixed();
		});
		nav_fixed();  //浮动表单初始化

	}

	function _calcMoment() {
        if (typeof beforeDateTime == "undefined") {return false;}
        var beforeTime = Math.round((new Date(beforeDateTime)).getTime()/1000);
        var range = Math.max(0,beforeTime-Math.round((new Date()).getTime()/1000));
        if (range === 0) {
            clearInterval(timer);
            $(".timespan c").html("2016/10/31");
            $('#pc_count').flipcountdown({
                showHour: true,
                showMinute: true,
                showSecond: false,
                am: false,
                beforeDateTime: "10/31/2016 23:23:59"
            });

            $('#mobile_count').flipcountdown({
                showHour: true,
                showMinute: true,
                showSecond: false,
                am: false,
                size: 'xs',
                beforeDateTime: "10/31/2016 23:59:59"
            });
        }

    }
	

    $(".timespan c").html("2016/10/08");

    var beforeDateTime = '10/8/2016 23:59:59';

    $('#pc_count').flipcountdown({
        showHour: true,
        showMinute: true,
        showSecond: false,
        am: false,
        beforeDateTime: beforeDateTime
    });

    $('#mobile_count').flipcountdown({
        showHour: true,
        showMinute: true,
        showSecond: false,
        am: false,
        size: 'xs',
        beforeDateTime: beforeDateTime
    });

    var timer = 0;
    clearInterval(timer);
    if( true )
        timer = setInterval( _calcMoment, 1000);
    _calcMoment();


});
