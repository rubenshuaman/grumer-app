addEventListener("load", function() {
  setTimeout(hideURLbar, 0);
}, false);

function hideURLbar() {
  window.scrollTo(0, 1);
}
//config
$(function() {
  var query = window.location.search;
  if (query !== "") {
    $(".nav li").removeClass("active");
    $("#linkCatalogue").parent('li').addClass('active');
    $("#divSlider").css('display', 'none');
  }

  $("#slider").responsiveSlides({
    auto: true,
    nav: true,
    speed: 500,
    namespace: "callbacks",
    pager: true,
  });

  var menu_ul = $('.menu > li > ul'),
    menu_a = $('.menu > li > a');
  menu_ul.hide();
  menu_a.click(function(e) {
    e.preventDefault();
    if (!$(this).hasClass('active')) {
      menu_a.removeClass('active');
      menu_ul.filter(':visible').slideUp('normal');
      $(this).addClass('active').next().stop(true, true).slideDown('normal');
    } else {
      $(this).removeClass('active');
      $(this).next().stop(true, true).slideUp('normal');
    }
  });
});
//functions
$(function() {
  toastr.options = {
    "progressBar": true,
    "positionClass": "toast-top-center"
  }

  var getProducts = function () {
    $.ajax({
      type: "GET",
      contentType: "application/json; charset=utf-8",
      url: "http://190.119.245.52:4191/api/v1/products",
      data: {},
      dataType: "json",
      async: true,
      success: function(data, textStatus, xhr) {
        if (data.length > 0) {
          mapProduct(data);
        }
      },
      error: function(xhr, textStatus, ex) {
        console.log(xhr);
        console.log(textStatus);
        console.log(ex);
        alert("Ocurrió un error!");
      }
    });
    }

    var mapProduct = function(data){
      $("#divProducts").empty();
      $.each(data, function(key, val) {
        var html = '<div class="col-sm-4 top_grid1-box1"><div class="grid_1">' +
          '<div class="b-link-stroke b-animate-go thickbox"> <div class="b-bottom-line"></div><div class="b-top-line"></div>' +
          '<img src="images/' + val.image + '" class="img-responsive" alt=""/></div>' +
          '<div class="grid_2"><p>' + val.name + '</p><ul class="grid_2-bottom">' +
          '<li class="grid_2-left"><p> S/. ' + val.priceSun.toFixed(2) + '<!--small>.00</small--></p></li><li class="grid_2-right">' +
          '<button id="btnProduct' + val.id + '" class="btn btn-primary btn-normal btn-inline" target="_self" title="Obtener">Obtener</button>' +
          '</li><div class="clearfix"></div></ul></div></div></div>';
        $("#divProducts").append(html);
        $("#btnProduct" + val.id).on('click', function() {
          localStorage.setItem("product", JSON.stringify(val));
          location.replace("single.html");
        });
      });
    }

  var cartProducts = [];

  function getCartProducts() {
    $("#divCartProducts").empty();
    $("#lblCountCart").html("(0)");
    if (localStorage.getItem('products')) {
      cartProducts = JSON.parse(localStorage.getItem('products'));
      $("#lblCountCart").html("(" + cartProducts.length + ")");
      var totalSun = 0,
        totalDollar = 0;
      $.each(cartProducts, function(key, val) {
        var money = val.measureId === 1 ? "S/. " : "$ ";
        var measure = val.measureId === 1 ? " kg." : " tn.";
        var price = val.measureId === 1 ? (val.quantity * val.priceSun) : (val.quantity * val.priceDollar);
        totalSun = val.measureId === 1 ? (totalSun + (val.quantity * val.priceSun)) : (totalSun + 0);
        totalDollar = val.measureId === 1 ? (totalDollar + 0) : (totalDollar + (val.quantity * val.priceDollar));
        var html = '<div id="divCartProduct' + val.id + '" class="row modal-row"><div class="col-xs-3">' +
          '<div class="pull-left"><img src="images/' + val.image + '" width="60" height="60" alt=""/>' +
          '</div></div><div class="col-xs-3"><div class="pull-left"><label>' + val.name + '</label><div class="clearfix"></div>' +
          '<label class="lbl-quantity">' + val.quantity + measure + '</label><div class="clearfix"></div>' +
          '<span id="btnDelete' + val.id + '" title="Eliminar" class="glyphicon glyphicon-remove icon-remove"></span>' +
          '</div></div><div class="col-xs-6"><label class="pull-right">' + money + price.toFixed(2) + '</label></div></div>';
        $("#divCartProducts").append(html);
        $("#btnDelete" + val.id).on('click', function() {
          for (var i = 0; i < cartProducts.length; i++) {
            if (val.id === cartProducts[i].id) {
              $("#divCartProduct" + val.id).remove();
              cartProducts.splice(i, 1);
              localStorage.setItem("products", JSON.stringify(cartProducts));
              $("#lblCountCart").html("(" + cartProducts.length + ")");
              var pricee = val.measureId === 1 ? (val.quantity * val.priceSun) : (val.quantity * val.priceDollar);
              if (val.measureId === 1)
                $("#lblTotalSuns").html("S/. " + (totalSun - pricee).toFixed(2));
              else
                $("#lblTotalDollar").html("$ " + (totalDollar - pricee).toFixed(2));
            }
          }
        });
      });
      $("#lblTotalSuns").html("S/. " + totalSun.toFixed(2));
      $("#lblTotalDollar").html("$ " + totalDollar.toFixed(2));
    }
  }

  $("#btnCheckout").on('click', function() {
    if (cartProducts.length > 0)
      location.replace("reservation.html");
    else
      toastr.warning('No existe ningún producto para verificar?');
  });

  $("ul li.subitem1").on('click', function() {
    var productTypeId = $(this).data("id");
    getProduct(parseInt(productTypeId));
  });

  var getProduct = function (productTypeId) {
    $.ajax({
      type: "GET",
      contentType: "application/json; charset=utf-8",
      url: "http://190.119.245.52:4191/api/v1/product/"+productTypeId,
      data: {},
      dataType: "json",
      async: true,
      success: function(data, textStatus, xhr) {
        if (data.length > 0) {
          mapProduct(data);
        }
      },
      error: function(xhr, textStatus, ex) {
        console.log(xhr);
        console.log(textStatus);
        console.log(ex);
        alert("Ocurrió un error!");
      }
    });
    }

  $("#btnSearch").on('click', function(){
    var description = $("#txtSearch").val();
    if (description !== "") {
      //searchProduct(description);
    }
  });

  var searchProduct = function (description) {
    $.ajax({
      type: "GET",
      contentType: "application/json; charset=utf-8",
      url: "http://190.119.245.52:4191/api/v1/search/"+description,
      data: {},
      dataType: "json",
      async: true,
      success: function(data, textStatus, xhr) {
        console.log(data);
        if (data.length > 0) {
          mapProduct(data);
        }
      },
      error: function(xhr, textStatus, ex) {
        console.log(xhr);
        console.log(textStatus);
        console.log(ex);
        alert("Ocurrió un error!");
      }
    });
    }

  getCartProducts();
  getProducts();
});
