import * as $ from 'jquery'

var container = ""
var autoplaySpeed: number = undefined
var autoplay: boolean = false
var timer: any = undefined
var clickHandler: (id: string) => void

var init = function (options: any) {
  container = ""
  autoplaySpeed = undefined
  autoplay = false
  clickHandler = undefined

  container = options.container
  autoplaySpeed = options.autoplaySpeed
  autoplay = options.autoplay
  clickHandler = options.clickHandler
  $(container).html('')
  createCarousel(options)
  arrowHover()
  tabImg()
  setZindex()
  if (options.autoplay || autoplay == true) {
    autoPlay(autoplaySpeed)
  }
}

var createCarousel = function (options: any) {
  createDOM(options)
  addListener()
}

var createDOM = function (options: any) {
  var html = ""
  html = "<div class='carousel-box clearfix'>" +
    "<div class='transverse-box pull-left'>" +
    "</div>" +
    "<div class='vertical-box pull-right'>" +
    "<ul>" +
    "</ul>" +
    "</div>" +
    "<span class='left-arrow'>‹ </span>" +
    "<span class='right-arrow'>›</span>" +
    "</div>"
  $(container).html(html)
  var imgLength = options.datas.length
  for (var i = 0; i < imgLength; i++) {
    $(".transverse-box").append("<div class='img-item'><img class='c' data-id=" + options.datas[i].id + " src='" + options.datas[i].src + "'></div>")
  }
  $(".vertical-box ul").append("<li><img data-id=" + options.datas[1].id + " class='c' src='" + options.datas[1].src + "'></li>")
  $(".vertical-box ul").append("<li><img data-id=" + options.datas[2].id + " class='c' src='" + options.datas[2].src + "'></li>")
}

var addListener = function () {
  $('.c').on('click', function (e) {
    const id: string = e.target.dataset.id
    clickHandler && clickHandler(id)
  })
}

var arrowHover = function () {
  $(".carousel-box").hover(function () {
    $(".left-arrow,.right-arrow").css("display", "flex")
  }, function () {
    $(".left-arrow,.right-arrow").css("display", "none")
  })
}

var tabImg = function () {
  $(".left-arrow").on("click", function () {
    if (timer) {
      clearTimeout(timer)
      autoPlay(autoplaySpeed)
    }
    changeZindex_add()
  })
  $(".right-arrow").on("click", function () {
    if (timer) {
      clearTimeout(timer)
      autoPlay(autoplaySpeed)
    }
    changeZindex_sub()
  })
}

var setZindex = function () {
  var imgNum = $(".transverse-box").find(".img-item").length
  for (var i = 0; i < imgNum; i++) {
    $(".img-item").eq(i).css({
      "zIndex": i
    })
    $(".img-item").eq(i).attr("Zindex", i)
  }
}

var changeZindex_add = function () {
  var firstImgSrc = $(".transverse-box").find(".img-item").eq(0).find("img").attr("src")
  var lastImgSrc = $(".transverse-box").find(".img-item").eq(length - 1).find("img").attr("src")
  var last2ImgSrc = $(".transverse-box").find(".img-item").eq(length - 2).find("img").attr("src")
  $(".transverse-box").find(".img-item").eq(0).remove()
  $(".transverse-box").append("<div class='img-item'><img src='" + firstImgSrc + "'><div>")
  $(".vertical-box ul").find("li").eq(0).find("img").attr("src", lastImgSrc)
  $(".vertical-box ul").find("li").eq(1).find("img").attr("src", last2ImgSrc)
  $(".transverse-box").find(".img-item").each(function (a, b) {
    if (a == 0) {
      $(b).css('zIndex', 2)
    } else if (a == length - 1) {
      $(b).css('zIndex', 3)
    } else {
      $(b).css('zIndex', 2)
    }
  })

  $(".transverse-box").find(".img-item").eq(length - 1).css('opacity', 0).animate({
    opacity: 1
  }, 500)
}

var changeZindex_sub = function () {
  var lastImgSrc = $(".transverse-box").find(".img-item").eq(length - 1).find("img").attr("src")
  var firstImgSrc = $(".transverse-box").find(".img-item").eq(0).find("img").attr("src")
  var first2ImgSrc = $(".transverse-box").find(".img-item").eq(1).find("img").attr("src")
  $(".transverse-box").find(".img-item").eq(length - 1).remove()
  $(".transverse-box").prepend("<div class='img-item'><img src='" + lastImgSrc + "'><div>")
  $(".vertical-box ul").find("li").eq(0).find("img").attr("src", firstImgSrc)
  $(".vertical-box ul").find("li").eq(1).find("img").attr("src", first2ImgSrc)
  $(".transverse-box").find(".img-item").each(function (a, b) {
    if (a == 0) {
      $(b).css('zIndex', 2)
    } else if (a == length - 1) {
      $(b).css('zIndex', 3)
    } else {
      $(b).css('zIndex', 2).css('opacity', 0)
    }
  })
  $(".transverse-box").find(".img-item").eq(length - 1).css('opacity', 0).animate({
    opacity: 1
  }, 500)
}

var autoPlay = function (x: number) {
  if (timer) {
    clearTimeout(timer)
  }
  timer = setTimeout(function () {
    changeZindex_add()
    autoPlay(x)
  }, x)
}

export default {
  init,
}