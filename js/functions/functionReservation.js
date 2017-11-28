addEventListener("load", function() {
  setTimeout(hideURLbar, 0);
}, false);

function hideURLbar() {
  window.scrollTo(0, 1);
}
$(function() {
  toastr.options = {
    "progressBar": true,
    "positionClass": "toast-top-center"
  }
  $('#txtPhone').on("keypress", function(e) {
    var key = window.Event ? e.which : e.keyCode
    return ((key >= 48 && key <= 57) || key === 43)
  });
  $('#txtDni').on("keypress", function(e) {
    var key = window.Event ? e.which : e.keyCode
    return (key >= 48 && key <= 57)
  });
  var getProducts = function() {
    $("#tblProducts > tbody").empty();
    if (localStorage.getItem('products')) {
      var products = JSON.parse(localStorage.getItem('products'));
      var totalSun = 0,
        totalDollar = 0;
      $.each(products, function(key, val) {
        var money = val.measureId === 1 ? "S/. " : "$ ";
        var measure = val.measureId === 1 ? " kg." : " tn.";
        var price = val.measureId === 1 ? (val.quantity * val.priceSun) : (val.quantity * val.priceDollar);
        totalSun = val.measureId === 1 ? (totalSun + (val.quantity * val.priceSun)) : (totalSun + 0);
        totalDollar = val.measureId === 1 ? (totalDollar + 0) : (totalDollar + (val.quantity * val.priceDollar));
        var html = '<tr id="trProduct' + val.id + '"><td class="td-zise">' +
          '<img src="images/' + val.image + '" class="img-responsive" width="80" height="80" alt=""/></td>' +
          '<td class="td-center">' + val.name + '</td>' +
          '<td class="td-center">' + val.quantity + measure + '</td>' +
          '<td class="td-center">' + money + price.toFixed(2) + '</td>' +
          '<td class="td-center"><span id="btnDelete' + val.id + '" title="Eliminar" class="glyphicon glyphicon-remove icon-remove"></span></td>' +
          '</tr>';
        $("#tblProducts > tbody").append(html);
        $("#btnDelete" + val.id).on('click', function() {
          $.dialog({
            titleText: 'Notificación',
            type: 'confirm',
            buttonText: {
              ok: 'Aceptar',
              cancel: 'Cancelar'
            },
            onClickOk: function() {
              for (var i = 0; i < products.length; i++) {
                if (val.id === products[i].id) {
                  $("#trProduct" + val.id).remove();
                  products.splice(i, 1);
                  localStorage.setItem("products", JSON.stringify(products));
                  var pricee = val.measureId === 1 ? (val.quantity * val.priceSun) : (val.quantity * val.priceDollar);
                  if (val.measureId === 1)
                    $("#lblTotalSun").html("S/. " + (totalSun - pricee).toFixed(2));
                  else
                    $("#lblTotalDollar").html("$ " + (totalDollar - pricee).toFixed(2));
                }
              }
            },
            onClickCancel: function() {},
            contentHtml: '<p>Está seguro de eliminar?</p>'
          });
        });
      });
      $("#lblTotalSun").html("S/. " + totalSun.toFixed(2));
      $("#lblTotalDollar").html("$ " + totalDollar.toFixed(2));
    }
  }

  var getProductss = function() {
    $("#tblProductss > tbody").empty();
    if (localStorage.getItem('products')) {
      var products = JSON.parse(localStorage.getItem('products'));
      var totalSun = 0,
        totalDollar = 0;
      $.each(products, function(key, val) {
        var money = val.measureId === 1 ? "S/. " : "$ ";
        var measure = val.measureId === 1 ? " kg." : " tn.";
        var price = val.measureId === 1 ? (val.quantity * val.priceSun) : (val.quantity * val.priceDollar);
        totalSun = val.measureId === 1 ? (totalSun + (val.quantity * val.priceSun)) : (totalSun + 0);
        totalDollar = val.measureId === 1 ? (totalDollar + 0) : (totalDollar + (val.quantity * val.priceDollar));
        var html = '<tr><td class="td-zise">' +
          '<img src="images/' + val.image + '" class="img-responsive" width="80" height="80" alt=""/></td>' +
          '<td class="td-center">' + val.name + '</td>' +
          '<td class="td-center">' + val.quantity + measure + '</td>' +
          '<td class="td-center">' + money + price.toFixed(2) + '</td>' +
          '</tr>';
        $("#tblProductss > tbody").append(html);
      });
      $("#lblTotalSunn").html("S/. " + totalSun.toFixed(2));
      $("#lblTotalDollarr").html("$ " + totalDollar.toFixed(2));
    }
  }

  getProducts();
  getProductss();

  $('.nav-tabs > li a[title]').tooltip();
  //Wizard
  $('a[data-toggle="tab"]').on('show.bs.tab', function(e) {
    var $target = $(e.target);
    if ($target.parent().hasClass('disabled')) {
      return false;
    }
  });

  $(".next-step").click(function(e) {
    var id = $(this).attr("id");
    if (id === "btnShoppingCart") {
      $("#lblTitleCart").html("Dirección de envío");
    }else if(id === "btnShippingAddress"){
      if (!validate()) {
        return;
      }
      $("#lblTitleCart").html("Forma de pago");
    }else if (id === "btnPaymentMethod") {
      $("#lblTitleCart").html("Confirmar");
    }else if(id === "btnConfirm"){
      $.dialog({
        titleText: 'Notificación',
        type: 'confirm',
        buttonText: {
          ok: 'Aceptar',
          cancel: 'Cancelar'
        },
        onClickOk: function() {
          saveOrder();
        },
        onClickCancel: function() {},
        contentHtml: '<p>Está seguro de confirmar su pedido?</p>'
      });
    }
    var $active = $('.wizard .nav-tabs li.active');
    $active.next().removeClass('disabled');
    nextTab($active);
  });

  $(".prev-step").click(function(e) {
    var id = $(this).attr("id");
    if (id === "btnShippingAddressBack") {
      $("#lblTitleCart").html("Revisar carrito de compras");
    }else if(id === "btnPaymentMethodBack"){
      $("#lblTitleCart").html("Dirección de envío");
    }else if (id === "btnConfirmBack") {
      $("#lblTitleCart").html("Forma de pago");
    }
    var $active = $('.wizard .nav-tabs li.active');
    prevTab($active);
  });

  function nextTab(elem) {
    $(elem).next().find('a[data-toggle="tab"]').click();
  }

  function prevTab(elem) {
    $(elem).prev().find('a[data-toggle="tab"]').click();
  }

  var saveOrder =  function(){
    var customerDTO = {};
    customerDTO.name = $("#txtName").val();
    customerDTO.surname = $("#txtSurname").val();
    customerDTO.dni = $("#txtDni").val();
    customerDTO.phone = $("#txtPhone").val();
    customerDTO.email = $("#txtEmail").val();
    customerDTO.city = $("#txtCity").val();
    customerDTO.country = $("#slcCountry").val();
    var data = {customer: customerDTO, products: JSON.parse(localStorage.getItem('products'))};
    $.ajax({
      type: "POST",
      contentType: "application/json; charset=utf-8",
      url: "http://190.119.245.52:4191/api/v1/order",
      data: JSON.stringify(data),
      dataType: "json",
      async: true,
      success: function(data, textStatus, xhr) {
        if (data.status > 0) {
          toastr.success("Pedido realizado exitosamente!");
            localStorage.removeItem("products");
            var timeout = setTimeout(function(){
              clearTimeout(timeout);
              location.replace("index.html?p=#");
            }, 3000);
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

  var validate = function(){
    if ($("#txtName").val() === "") {
      toastr.warning("Ingrese su nombre!");
      $("#txtName").focus();
      return false;
    }
    if ($("#txtSurname").val() === "") {
      toastr.warning("Ingrese sus apellidos!");
      $("#txtSurname").focus();
      return false;
    }
    if ($("#txtDni").val() === "") {
      toastr.warning("Ingrese su DNI!");
      $("#txtDni").focus();
      return false;
    }
    if ($("#txtPhone").val() === "") {
      toastr.warning("Ingrese su numero de teléfono!");
      $("#txtPhone").focus();
      return false;
    }
    if ($("#txtEmail").val() === "") {
      toastr.warning("Ingrese su correo!");
      $("#txtEmail").focus();
      return false;
    }
    var pattern = /^\w+([-+.'][^\s]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
    if (!pattern.test($("#txtEmail").val())) {
      toastr.warning("Ingrese un correo válido!");
      $("#txtEmail").focus();
      return false;
    }
    if ($("#txtCity").val() === "") {
      toastr.warning("Ingrese su ciudad!");
      $("#txtCity").focus();
      return false;
    }
    if ($("#slcCountry").val() === "0") {
      toastr.warning("Seleccione su País!");
      $("#slcCountry").focus();
      return false;
    }
    return true;
  }
});
