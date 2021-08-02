$(document).ready(function () {


// window.intlTelInputGlobals.loadUtils("assets/js/utils.js");

  let input = document.querySelector("#phone");
  window.intlTelInput(input, {
    // allowDropdown: false,
    // autoHideDialCode: false,
    // autoPlaceholder: "off",
    // dropdownContainer: document.body,
    // excludeCountries: ["us"],
    // formatOnDisplay: false,
    
    initialCountry: "auto",
    // geoIpLookup: function(callback) {
    //   $.get("http://ipinfo.io", function() {}, "jsonp").always(function(resp) {
    //     var countryCode = (resp && resp.country) ? resp.country : "";
    //     callback(countryCode);

    //     console.log(countryCode)
    //   });
    // },

    geoIpLookup: function(callback) {
      $.get('https://ipinfo.io', function() {}, "jsonp").always(function(resp) {
        var countryCode = (resp && resp.country) ? resp.country : "us";
        callback(countryCode);
      });
    },
    utilsScript: "assets/js/utils.js",
    // https://pro.ip-api.com/json/?fields=status,countryCode&key=aM3qNyuQeQg7p0t

    // t.getJSON("https://pro.ip-api.com/json/?fields=status,countryCode&key=aM3qNyuQeQg7p0t", function(e) {
    //         if ("success" == e.status) {
    //             console.log(e);
    //             var o = e.countryCode.toLowerCase()
    //               , n = t(".flag-container .country-list li[data-country-code=" + o + "]");
    //             void 0 != n && l(n),
    //             t(".amazon-bestseller .col-lg-12").prepend(t('<p>Exclusive Offer For: <span class="iti-flag ' + o + '" style="display: inline-block;"></span></p>'))
    //         }
    //     }),


    // hiddenInput: "full_number",
    // initialCountry: "auto",
    // localizedCountries: { 'de': 'Deutschland' },
    // nationalMode: false,
    // onlyCountries: ['us', 'gb', 'ch', 'ca', 'do'],
    // placeholderNumberType: "MOBILE",
    // preferredCountries: ['cn', 'jp'],
    separateDialCode: true,

  });

// console.log(intlTelInput.input)
// var countryData = instance.getSelectedCountryData();

// console.log(countryData)



  $(document).on("click", ".stepsBtnJs", function () {
    $(".first-form-step").addClass("hidden");
    $(".second-form-step").addClass("active");
    $(".form-head .item-personal").removeClass("active");
    $(".form-head .item-billing").addClass("active");
    $(".form-head").addClass("billing-step");
  });

  $(document).on("click", ".backBtnJs", function (e) {
    e.preventDefault();
    $(".second-form-step").removeClass("active");
    $(".first-form-step").removeClass("hidden");
    $(".form-head .item-personal").addClass("active");
    $(".form-head .item-billing").removeClass("active");
    $(".form-head").removeClass("billing-step");
  });

});
