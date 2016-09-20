
/*-------------- VIPABC | Author by Mike Li  ---------------*/
/*                   v2.0 | 2016-4-12                       */
/*                  License: vipabc.com                     */
/*----------------------------------------------------------*/


$(document).ready(function() {
			var _move = false;//移动标记
	    var move_dis = 0; //表格 移动距离
	    var move_dis_bar = 0; //滚动条 移动距离
	    var _x = 0; //鼠标离控件左上角的相对位置
	    var win_width = $(window).width(); //视口宽度
	    var scrollBar = $("#cp_scrollBar"); //移动的滚动条
	    var column_R_Move = $(".cp_column_R_Move"); //移动的栏目
	    var CR1_width = $(".cp_CR1 li").width(); //列表宽度
	    var scrollBar_wrap_width = $(".cp_scrollBar_wrap").width(); //滚动条总宽度

        var $document = $(document),
        selector = '[data-rangeslider]',
        $element = $(selector);

        // Example functionality to demonstrate a value feedback
        function valueOutput(element) {
            var value = element.value;
            var output = element.parentNode.getElementsByTagName('output')[0];
            //移动距离计算
            var width=(value/100)*(parseInt($(".cp_CR1 li").width())*3-parseInt($(".cp_column_R").width()));
            move_dis=width;
            $(".cp_column_R_Move").css("left","-"+width+"px");

            //output.innerHTML = value;
        }
        for (var i = $element.length - 1; i >= 0; i--) {
            valueOutput($element[i]);
        };

        $('input[type="range"]').change(function (e) {
            valueOutput(e.target);
        });

        // Example functionality to demonstrate disabled functionality
        $('#js-example-disabled button[data-behaviour="toggle"]').click(function (e) {
            var $inputRange = $('input[type="range"]', e.target.parentNode);

            if ($inputRange[0].disabled) {
                $inputRange.prop("disabled", false);
            }
            else {
                $inputRange.prop("disabled", true);
            }
            $inputRange.rangeslider('update');
        });

        // Example functionality to demonstrate programmatic value changes
        $('#js-example-change-value button').click(function (e) {
            var $inputRange = $('input[type="range"]', e.target.parentNode),
            value = $('input[type="number"]', e.target.parentNode)[0].value;
            $inputRange.val(value).change();
        });
        $element.rangeslider({

            // Deactivate the feature detection
            polyfill: false,

            // Callback function
            onInit: function () { },

            // Callback function
            onSlide: function (position, value) {
                //console.log('onSlide');
                //console.log('position: ' + position, 'value: ' + value);
            },

            // Callback function
            onSlideEnd: function (position, value) {
                //console.log('onSlideEnd');
                //console.log('position: ' + position, 'value: ' + value);
            }
        });






	$(".cp_arrow_ToR").click(function(e) {
        var liWidth = parseInt($(".cp_CR1 li").width());
        var rWidth = parseInt($(".cp_column_R").width());
        if ( move_dis < 3*liWidth-rWidth ){
            judge=0;
			move_dis += 17;
			if ( move_dis_bar < ( scrollBar_wrap_width - 140 ) ){
				move_dis_bar += 7.5;
			}

		}

        var $inputRange = $('input[type="range"]', e.target.parentNode),


		value = 100*move_dis/(3*liWidth-rWidth);

        $inputRange.val(value).change();

		//console.log(move_dis);
		cp_move(move_dis,move_dis_bar);

    });


	//鼠标按下动作
	scrollBar.mouseover(function(e){
		_move = true;

	}).mousemove(function() {

		_x = parseInt($(this).css("left")) / ( scrollBar_wrap_width - 185) * (win_width- CR1_width ) ;
		//console.log(parseInt($(this).css("left")));
        if ( _move && _x < ( 2*CR1_width + 8) ) {
			cp_mouseMove(_x);
		}
		//console.log(_x);

    }).mouseup(function(){

		_move=false;

	});

	//点击移动函数
	function cp_move(move_dis,move_dis_m){

		column_R_Move.animate({
			left: -move_dis + "px"
		},200);

		scrollBar.animate({
			left: move_dis_bar + "px"
		},200);

	};

	//鼠标按压移动 函数
	function cp_mouseMove(move_dis){
		//console.log(move_dis);
		if ( move_dis < 308 )
		{
			column_R_Move.css({

				"left": -move_dis  + "px"
			});
		}

	};

	//控制小皇冠logo的尺寸切换
	$(window).bind("ready",bTitle_logo).bind("resize",bTitle_logo);

		function bTitle_logo() {

			var img = $(".cp_vipabc_logo img");
			var win_width = $(window).width();
			if ( win_width > 490 && win_width < 768 ){

				img.attr("src","http://source.vipabc.com/ext/images/website/share/B_cp_vipabc_logo.png").css("width","100%");
			}
			else{
				img.attr("src","http://source.vipabc.com/ext/images/website/share/cp_vipabc_logo.png");
			}

			if( win_width > 490 && parseInt(column_R_Move.css("left")) != 0  ){
				cp_move(0,0);
			}
	  };





});
