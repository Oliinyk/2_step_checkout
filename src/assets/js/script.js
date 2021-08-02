$(document).ready(function () {
  let input = document.querySelector("#phone");
  window.intlTelInput(input, {  
    initialCountry: "auto",
    geoIpLookup: function(callback) {
      $.get('https://ipinfo.io', function() {}, "jsonp").always(function(resp) {
        var countryCode = (resp && resp.country) ? resp.country : "us";
        callback(countryCode);
      });
    },
    utilsScript: "assets/js/utils.js",
    separateDialCode: true
  });

  $(document).on("click", ".backBtnJs", function (e) {
    e.preventDefault();
    $(".second-form-step").removeClass("active");
    $(".first-form-step").removeClass("hidden");
    $(".form-head .item-personal").addClass("active");
    $(".form-head .item-billing").removeClass("active");
    $(".form-head").removeClass("billing-step");
  });

  let checkedVal= $(".radio-group-options input[type='radio']:checked").val();
  $(".amountTotalJs").text(checkedVal);

  $(document).on("click", ".form-check .form-check-label, .form-check .form-check-input", function () {
    let thisVal = $(this).closest('.form-check').find('input').val();
    $(".amountTotalJs").text(thisVal);
  });

  $(".validateJsInfo").validate({
    rules: {
      required: 'required',
      firstName: 'required',
      email: {
        required: true,
        email: true
      }
    },
    messages: {
      required: '',
      firstName: '',
      email: '',
    },
    submitHandler: function (form) {
      // form.submit();
      $(".first-form-step").addClass("hidden");
      $(".second-form-step").addClass("active");
      $(".form-head .item-personal").removeClass("active");
      $(".form-head .item-billing").addClass("active");
      $(".form-head").addClass("billing-step");
    }
  })

});
