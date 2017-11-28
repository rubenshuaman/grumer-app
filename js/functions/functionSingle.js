addEventListener("load", function() {
  setTimeout(hideURLbar, 0);
}, false);

function hideURLbar() {
  window.scrollTo(0, 1);
}
//functions
$(function() {
  toastr.options = {
    "progressBar": true,
    "positionClass": "toast-top-center"
  }
  $('#txtQuantity').on("keypress", function(e) {
    var key = window.Event ? e.which : e.keyCode
    return (key >= 48 && key <= 57)
  });

  var cartProducts = [];

  var getCartProducts = function () {
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

  var currentProduct = {};

  var getProduct = function () {
    if (localStorage.getItem("product")) {
      currentProduct = JSON.parse(localStorage.getItem('product'));
      $("#lblProduct").html(currentProduct.name);
      $("#lblPrice").html("S/. " + currentProduct.priceSun.toFixed(2));
      $("#liDescription").html(currentProduct.description);
      $("#btnReservation").prop("disabled", false);
      $("#imgEtalage1").attr("src","images/s_" + currentProduct.image);
      $("#imgEtalage2").attr("src","images/s_" + currentProduct.image);
      $("#imgEtalage3").attr("src","images/s_" + currentProduct.image);
      $("#imgEtalage4").attr("src","images/s_" + currentProduct.image);
    } else {
      $("#btnReservation").prop("disabled", true);
    }
  }

  $('#slctMeasure').on('change', function() {
    $('#txtQuantity').val('');
    if (this.value === "1")
      $("#lblPrice").html("S/. " + currentProduct.priceSun.toFixed(2));
    else
      $("#lblPrice").html("$ " + currentProduct.priceDollar.toFixed(2));
  });

  $("#txtQuantity").on('blur', function() {
    var money = $('#slctMeasure').val() === "1" ? "S/. " : "$ ";
    var price = $('#slctMeasure').val() === "1" ? currentProduct.priceSun : currentProduct.priceDollar;
    if (this.value !== "" && this.value > 0)
      $("#lblPrice").html(money + (price * this.value).toFixed(2));
  });

  $("#btnReservation").on('click', function() {
    var measure = $('#slctMeasure').val();
    var quantity = $('#txtQuantity').val();
    if (measure === "1" && (quantity === "" || quantity < 50)) {
      toastr.warning('Ingrese un valor mayor igual a 50');
      $("#txtQuantity").focus();
      return;
    } else if (measure === "2" && (quantity === "" || quantity === "0")) {
      toastr.warning('Ingrese un valor mayor a 0');
      $("#txtQuantity").focus();
      return;
    }
    var products = [];
    if (localStorage.getItem('products')) {
      products = JSON.parse(localStorage.getItem('products'));
    }
    currentProduct.measureId = parseInt(measure);
    currentProduct.quantity = parseInt(quantity);
    for (var i = 0; i < products.length; i++) {
      if (currentProduct.id === products[i].id) {
        products.splice(i, 1);
      }
    }
    products.push(currentProduct);
    localStorage.setItem("products", JSON.stringify(products));
    location.replace("index.html?p=#");
  });
  getProduct();
  getCartProducts();
  var numeros1 = [1, 2, 3];
  $("#divProducts").empty();
  $.each(numeros1, function(i, val) {
    var html = '<div class="col-sm-4 top_grid1-box1"><a href="index.html?p=#"><div class="grid_1">' +
      '<div class="b-link-stroke b-animate-go thickbox"> <div class="b-bottom-line"></div><div class="b-top-line"></div>' +
      '<img src="images/img' + val + '.jpg" class="img-responsive" alt=""/></div>' +
      '<div class="grid_2"><p>Maní</p><ul class="grid_2-bottom">' +
      '<li class="grid_2-left"><p>S/. 10<small>.00</small></p></li><li class="grid_2-right">' +
      '<div class="btn btn-primary btn-normal btn-inline" title="Obtener">Obtener</div>' +
      '</li><div class="clearfix"></div></ul></div></div></a></div>';
    $("#divProducts").append(html);
  });
});
//config
$(function() {
  $('#etalage').etalage({
    thumb_image_width: 300,
    thumb_image_height: 400,
    source_image_width: 900,
    source_image_height: 1200,
    show_hint: true,
    click_callback: function(image_anchor, instance_id) {
      //alert('Callback example:\nYou clicked on an image with the anchor: "' + image_anchor + '"\n(in Etalage instance: "' + instance_id + '")');
    }
  });

  $('#horizontalTab').easyResponsiveTabs({
    type: 'default', //Types: default, vertical, accordion
    width: 'auto', //auto or any width like 600px
    fit: true // 100% fit in a container
  });
});
