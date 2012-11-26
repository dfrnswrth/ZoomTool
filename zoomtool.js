/* ZoomTool */
/*jshint jquery:true browser:true expr:true smarttabs:true*/
(function($){
	"use strict";
	var ZoomTool = function(element, options){
		options = $.extend({},$.fn.zoomTool.defaults, options);
		var $el = element, $body = $("body"), inited = false, pX, pY, tX, tY,
			$orig = $el.is("img") ? $el : $el.find("img"),
			href = $el.attr("href") ? $el.attr("href") : $el.data("image"),
			$large = $("<img />"),
			$zoomTool = $('<div class="' + options.tool_class + '"></div>'),
			origPosition, origWidth, origHeight, largeWidth, largeHeight;

		$el.on("click", function(){ return false; });
		$orig.on("mouseenter", enter);

		function _init(e){
			origPosition = $orig.offset(),
			origWidth = $orig.outerWidth(),
			origHeight = $orig.outerHeight(),
			largeWidth, largeHeight;

			inited = true;
			e.preventDefault();
			$body.append($zoomTool);
			$zoomTool.css({
				display: "block",
				height: options.height,
				width: options.width
			});
			$large.attr("src", href).load(appendImage);
		}
		function enter(e) {
			!inited && _init(e);
			$(document).on("mousemove.zoomtool",getPosition);
			$zoomTool.css({ display: "block"});
		}
		function leave() {
			$(document).off("mousemove.zoomtool");
			$zoomTool.css({ display: "none"});
		}
		function getPosition(e) {
			pX = e.pageX;
			pY = e.pageY;
			tX = options.width / 2;
			tY = options.height / 2;
			if (pX > origPosition.left + origWidth + options.padding ||
				pX < origPosition.left - options.padding ||
				pY > origPosition.top + origHeight + options.padding ||
				pY < origPosition.top - options.padding) {
				return leave();
			}
			moveImage();
			moveTool();
		}
		function moveTool() {
			$zoomTool.css({
				left: pX - options.width / 2,
				top: pY - options.height / 2
			});
		}
		function moveImage() {
			$large.css({
				left: -(((pX - origPosition.left) / origWidth) * largeWidth - tX),
				top: -(((pY - origPosition.top) / origHeight) * largeHeight - tY)
			});
		}
		function appendImage(){
			$zoomTool.append($large).css({ background: "#000" });
			largeWidth = $large.width();
			largeHeight = $large.height();
		}
	};
	$.fn.zoomTool = function(args){
		return this.each(function(){
			var target = $(this),
				data = target.data("zoomer");
			if (args === "destroy") {
			} else if (!data) {
				target.data("zoomer", new ZoomTool(target, args));
			}
		});
	};
	$.fn.zoomTool.defaults = {
		tool_class: "zoom_tool",
		width: 200,
		height: 200,
		padding: 8
	};
})(jQuery);