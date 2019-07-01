// blowup.js
// Paul Krishnamurthy 2016

$(function ($) {

  $.fn.blowup = function (attributes) {

    var $element = this;

    // If the target element is not an image
    if (!$element.is("img")) {
      console.log("%c Blowup.js Error: " + "%cTarget element is not an image.", 
        "background: #FCEBB6; color: #F07818; font-size: 17px; font-weight: bold;",
        "background: #FCEBB6; color: #F07818; font-size: 17px;");
      return;
    }

    // Constants
    var $IMAGE_URL    = $element.attr("src");
    var $IMAGE_WIDTH  = $element.width();
    var $IMAGE_HEIGHT = $element.height();
    var NATIVE_IMG    = new Image();
    NATIVE_IMG.src    = $element.attr("src");

    // Default attributes
    var defaults = {
      round      : true,
      width      : 200,
      height     : 200,
      background : "#FFF",
      shadow     : "0 8px 17px 0 rgba(0, 0, 0, 0.2)",
      border     : "6px solid #FFF",
      cursor     : true,
      zIndex     : 999999
    }

    // Update defaults with custom attributes
    var $options = $.extend(defaults, attributes);

    // Modify target image
    $element.on('dragstart', function (e) { e.preventDefault(); });
    $element.css("cursor", $options.cursor ? "crosshair" : "none");

    // Create magnification lens element
    var lens = document.createElement("div");
    lens.id = "BlowupLens";

    // Attack the element to the body
    $("body").append(lens);

    // Updates styles
    $blowupLens = $("#BlowupLens");

    $blowupLens.css({
      "position"          : "absolute",
      "visibility"        : "hidden",
      "pointer-events"    : "none",
      "zIndex"            : $options.zIndex,
      "width"             : $options.width,
      "height"            : $options.height,
      "border"            : $options.border,
      "background"        : $options.background,
      "border-radius"     : $options.round ? "50%" : "none",
      "box-shadow"        : $options.shadow,
      "background-repeat" : "no-repeat",
      // 调整放大倍数
      "transform": "translate(0, 0) scale(1.8)"
    });

    // Show magnification lens,鼠标进入（穿过元素时），显示放大镜
    $element.mouseenter(function () {
      $blowupLens.css("visibility", "visible");
    })

    // Mouse motion on image，获取鼠标位置，计算放大镜的位置
    $element.mousemove(function (e) {

      // Lens position coordinates，镜头位置坐标
      var lensX = e.pageX - $options.width / 2;
      var lensY = e.pageY - $options.height / 2;

      // Relative coordinates of image,计算鼠标的相对位置
      var relX = e.pageX - this.offsetLeft;
      var relY = e.pageY - this.offsetTop;
      // var relX = e.screenX;
      // var relY = e.screenY;
     
      // Zoomed image coordinates ， 这里获取的鼠标位置是相对于DIV的位置，并不是相对于浏览器的位置，
      // 所以需要加上DIV到顶部以及DIV到左边的距离
      console.log("NATIVE_IMG:", NATIVE_IMG.height, NATIVE_IMG.width);
      console.log("$element:", $element.width(), $element.height() );
      var zoomX = -Math.floor(relX / $element.width() * NATIVE_IMG.width - $options.width / 2) + 460;
      var zoomY = -Math.floor(relY / $element.height() * NATIVE_IMG.height - $options.height / 2) + 135;


      // Apply styles to lens
      $blowupLens.css({
        left                  : lensX,
        top                   : lensY,
        "background-image"    : "url(" + $IMAGE_URL + ")",
        "background-position" : zoomX + "px" + " " + zoomY + "px"
      });

    })

    // Hide magnification lens
    $element.mouseleave(function () {
      $blowupLens.css("visibility", "hidden");
    })
  }
})
