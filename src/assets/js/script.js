$(document).ready(function () {
  let input = document.querySelector("#phone-send");
  window.iti = window.intlTelInput(input, {
    initialCountry: "auto",
    geoIpLookup: function (callback) {
      $.get('https://ipinfo.io', function () { }, "jsonp").always(function (resp) {
        var countryCode = (resp && resp.country) ? resp.country : "us";
        callback(countryCode);
      });
    },
    // utilsScript: "assets/js/utils.js",
    separateDialCode: true
  });

  $('#phone-send').on('input', function () {
    $('.phoneHiddenJs').val('(' + $('.iti__selected-dial-code').text() + ') ' + $('.phone-dis').val());
    if ($(this).val() > 0) {
      $('.phone-dis').removeClass('_has_error');
      $('.phone-dis').closest('.form-group').find('._error').remove();
      document.querySelector('#_form_3_submit').disabled = false;
    } else {
      document.querySelector('#_form_3_submit').disabled = true;
    }
  })
  input.addEventListener("countrychange", function () {
    $('.phoneHiddenJs').val('(' + $('.iti__selected-dial-code').text() + ') ' + $('.phone-dis').val());
  });



  $(document).on("click", ".backBtnJs", function (e) {
    e.preventDefault();
    $(".second-form-step").removeClass("active");
    $(".first-form-step").removeClass("hidden");
    $(".form-head .item-personal").addClass("active");
    $(".form-head .item-billing").removeClass("active");
    $(".form-head").removeClass("billing-step");
    document.querySelector('#_form_3_submit').disabled = false;
  });

  $(document).on("click", ".billing-step .item-personal", function (e) {
    $(".second-form-step").removeClass("active");
    $(".first-form-step").removeClass("hidden");
    $(".form-head .item-personal").addClass("active");
    $(".form-head .item-billing").removeClass("active");
    $(".form-head").removeClass("billing-step");
    document.querySelector('#_form_3_submit').disabled = false;
  });

  let checkedVal = $(".radio-group-options input[type='radio']:checked").attr('data-val');
  let checkedTitle = $(".radio-group-options input[type='radio']:checked ~ .form-check-label").text();
  $(".amountTotalJs").text(checkedVal);
  $(".titleTotalJs").text(checkedTitle);
  $(document).on("click", ".form-check .form-check-label, .form-check .form-check-input", function () {
    let thisVal = $(this).closest('.form-check').find('input').val();
    let thisTitle = $(this).closest('.form-check').find('.form-check-label').text();
    $(".amountTotalJs").text(thisVal);
    $(".titleTotalJs").text(thisTitle);
  });

  $(document).on("click", ".form-check .form-check-label", function () {
    $(".form-check .form-check-input").removeAttr("checked");
    if ($(this).closest('.form-check').find('input').prop("checked", true)) {
      $(this).closest('.form-check').find('input').attr('checked', true)
    }
  })

  //checkbox on step 2
  $(document).on("click", ".customCheckJs", function () {
    if ($(this).find('input').prop("checked")) {
      $('.strapiBtn').removeClass('disabled');
    } else {
      $('.strapiBtn').addClass('disabled');
    }
  });

  // activecampaign
  window.cfields = [];
  window._show_thank_you = function (id, message, trackcmp_url, email) {

    $(".first-form-step").addClass("hidden");
    $(".second-form-step").addClass("active");
    $(".form-head .item-personal").removeClass("active");
    $(".form-head .item-billing").addClass("active");
    $(".form-head").addClass("billing-step");

    // on checkout-1 page
    $(".paypalChecoutJs").removeClass("hidden");

    //add value on hidden form
    let nameVal = $('.first-form-step').find('input[name="fullname"]').val();
    $(".hiddenFormJs").find('input[name="fullname"]').val(nameVal);
    let mailVal = $('.first-form-step').find('input[name="email"]').val();
    $(".hiddenFormJs").find('input[name="email"]').val(mailVal);
    let phoneVal = $('.first-form-step').find('.phoneHiddenJs').val();
    $(".hiddenFormJs").find('input[name="phone"]').val(phoneVal);

    // $("#_form_7_").find('.priceHolderJs').val('$1,497');
    // $("#_form_9_").find('.priceHolderJs').val('$797');

    $("._form_7.hiddenFormJs").find('input[data-name="price"]').val('$1,497');
    $("._form_9.hiddenFormJs").find('input[data-name="price"]').val('$797');


    // var form = document.getElementById('_form_' + id + '_'), thank_you = form.querySelector('._form-thank-you');
    // form.querySelector('._form-content').style.display = 'none';
    // thank_you.innerHTML = message;
    // thank_you.style.display = 'block';
    const vgoAlias = typeof visitorGlobalObjectAlias === 'undefined' ? 'vgo' : visitorGlobalObjectAlias;
    var visitorObject = window[vgoAlias];
    if (email && typeof visitorObject !== 'undefined') {
      visitorObject('setEmail', email);
      visitorObject('update');
    } else if (typeof (trackcmp_url) != 'undefined' && trackcmp_url) {
      // Site tracking URL to use after inline form submission.
      _load_script(trackcmp_url);
    }
    if (typeof window._form_callback !== 'undefined') window._form_callback(id);
  };
  window._show_error = function (id, message, html) {
    var form = document.getElementById('_form_' + id + '_'), err = document.createElement('div'), button = form.querySelector('button'), old_error = form.querySelector('._form_error');
    if (old_error) old_error.parentNode.removeChild(old_error);
    err.innerHTML = message;
    err.className = '_error-inner _form_error _no_arrow';
    var wrapper = document.createElement('div');
    wrapper.className = '_form-inner';
    wrapper.appendChild(err);
    button.parentNode.insertBefore(wrapper, button);
    document.querySelector('[id^="_form"][id$="_submit"]').disabled = false;
    if (html) {
      var div = document.createElement('div');
      div.className = '_error-html';
      div.innerHTML = html;
      err.appendChild(div);
    }
  };
  window._load_script = function (url, callback) {
    var head = document.querySelector('head'), script = document.createElement('script'), r = false;
    script.type = 'text/javascript';
    script.charset = 'utf-8';
    script.src = url;
    if (callback) {
      script.onload = script.onreadystatechange = function () {
        if (!r && (!this.readyState || this.readyState == 'complete')) {
          r = true;
          callback();
        }
      };
    }
    head.appendChild(script);
  };
  (function () {
    if (window.location.search.search("excludeform") !== -1) return false;
    var getCookie = function (name) {
      var match = document.cookie.match(new RegExp('(^|; )' + name + '=([^;]+)'));
      return match ? match[2] : null;
    }
    var setCookie = function (name, value) {
      var now = new Date();
      var time = now.getTime();
      var expireTime = time + 1000 * 60 * 60 * 24 * 365;
      now.setTime(expireTime);
      document.cookie = name + '=' + value + '; expires=' + now + ';path=/';
    }
    var addEvent = function (element, event, func) {
      if (element.addEventListener) {
        element.addEventListener(event, func);
      } else {
        var oldFunc = element['on' + event];
        element['on' + event] = function () {
          oldFunc.apply(this, arguments);
          func.apply(this, arguments);
        };
      }
    }
    var _removed = false;
    var form_to_submit = document.getElementById('_form_3_');
    var allInputs = form_to_submit.querySelectorAll('input, select, textarea'), tooltips = [], submitted = false;

    var getUrlParam = function (name) {
      var regexStr = '[\?&]' + name + '=([^&#]*)';
      var results = new RegExp(regexStr, 'i').exec(window.location.href);
      return results != undefined ? decodeURIComponent(results[1]) : false;
    };

    for (var i = 0; i < allInputs.length; i++) {
      var regexStr = "field\\[(\\d+)\\]";
      var results = new RegExp(regexStr).exec(allInputs[i].name);
      if (results != undefined) {
        allInputs[i].dataset.name = window.cfields[results[1]];
      } else {
        allInputs[i].dataset.name = allInputs[i].name;
      }
      var fieldVal = getUrlParam(allInputs[i].dataset.name);

      if (fieldVal) {
        if (allInputs[i].dataset.autofill === "false") {
          continue;
        }
        if (allInputs[i].type == "radio" || allInputs[i].type == "checkbox") {
          if (allInputs[i].value == fieldVal) {
            allInputs[i].checked = true;
          }
        } else {
          allInputs[i].value = fieldVal;
        }
      }
    }

    var remove_tooltips = function () {
      for (var i = 0; i < tooltips.length; i++) {
        tooltips[i].tip.parentNode.removeChild(tooltips[i].tip);
      }
      tooltips = [];
    };
    var remove_tooltip = function (elem) {
      for (var i = 0; i < tooltips.length; i++) {
        if (tooltips[i].elem === elem) {
          tooltips[i].tip.parentNode.removeChild(tooltips[i].tip);
          tooltips.splice(i, 1);
          return;
        }
      }
    };
    var create_tooltip = function (elem, text) {
      var tooltip = document.createElement('div'), arrow = document.createElement('div'), inner = document.createElement('div'), new_tooltip = {};
      if (elem.type != 'radio' && elem.type != 'checkbox') {
        tooltip.className = '_error';
        arrow.className = '_error-arrow';
        inner.className = '_error-inner';
        inner.innerHTML = text;
        tooltip.appendChild(arrow);
        tooltip.appendChild(inner);
        elem.parentNode.appendChild(tooltip);
      } else {
        tooltip.className = '_error-inner _no_arrow';
        tooltip.innerHTML = text;
        elem.parentNode.insertBefore(tooltip, elem);
        new_tooltip.no_arrow = true;
      }
      new_tooltip.tip = tooltip;
      new_tooltip.elem = elem;
      tooltips.push(new_tooltip);
      return new_tooltip;
    };
    var resize_tooltip = function (tooltip) {
      var rect = tooltip.elem.getBoundingClientRect();
      var doc = document.documentElement, scrollPosition = rect.top - ((window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0));
      // if (scrollPosition < 40) {
      //   tooltip.tip.className = tooltip.tip.className.replace(/ ?(_above|_below) ?/g, '') + ' _below';
      // } else {
      tooltip.tip.className = tooltip.tip.className.replace(/ ?(_above|_below) ?/g, '') + ' _above';
      // }
    };
    var resize_tooltips = function () {
      if (_removed) return;
      for (var i = 0; i < tooltips.length; i++) {
        if (!tooltips[i].no_arrow) resize_tooltip(tooltips[i]);
      }
    };
    var validate_field = function (elem, remove) {
      var tooltip = null, value = elem.value, no_error = true;
      remove ? remove_tooltip(elem) : false;
      if (elem.type != 'checkbox') elem.className = elem.className.replace(/ ?_has_error ?/g, '');
      if (elem.getAttribute('required') !== null) {
        if (elem.type == 'radio' || (elem.type == 'checkbox' && /any/.test(elem.className))) {
          var elems = form_to_submit.elements[elem.name];
          if (!(elems instanceof NodeList || elems instanceof HTMLCollection) || elems.length <= 1) {
            no_error = elem.checked;
          }
          else {
            no_error = false;
            for (var i = 0; i < elems.length; i++) {
              if (elems[i].checked) no_error = true;
            }
          }
          if (!no_error) {
            tooltip = create_tooltip(elem, "Please select an option.");
          }
        } else if (elem.type == 'checkbox') {
          var elems = form_to_submit.elements[elem.name], found = false, err = [];
          no_error = true;
          for (var i = 0; i < elems.length; i++) {
            if (elems[i].getAttribute('required') === null) continue;
            if (!found && elems[i] !== elem) return true;
            found = true;
            elems[i].className = elems[i].className.replace(/ ?_has_error ?/g, '');
            if (!elems[i].checked) {
              no_error = false;
              elems[i].className = elems[i].className + ' _has_error';
              err.push("Checking %s is required".replace("%s", elems[i].value));
            }
          }
          if (!no_error) {
            tooltip = create_tooltip(elem, err.join('<br/>'));
          }
        } else if (elem.tagName == 'SELECT') {
          var selected = true;
          if (elem.multiple) {
            selected = false;
            for (var i = 0; i < elem.options.length; i++) {
              if (elem.options[i].selected) {
                selected = true;
                break;
              }
            }
          } else {
            for (var i = 0; i < elem.options.length; i++) {
              if (elem.options[i].selected && !elem.options[i].value) {
                selected = false;
              }
            }
          }
          if (!selected) {
            elem.className = elem.className + ' _has_error';
            no_error = false;
            tooltip = create_tooltip(elem, "Please select an option.");
          }
        } else if (value === undefined || value === null || value === '') {
          elem.className = elem.className + ' _has_error';
          no_error = false;
          tooltip = create_tooltip(elem, "This field is required.");
        }
      }
      if (no_error && elem.name == 'email') {
        if (!value.match(/^[\+_a-z0-9-'&=]+(\.[\+_a-z0-9-']+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,})$/i)) {
          elem.className = elem.className + ' _has_error';
          no_error = false;
          tooltip = create_tooltip(elem, "Enter a valid email address.");
        }
      }
      if (no_error && /date_field/.test(elem.className)) {
        if (!value.match(/^\d\d\d\d-\d\d-\d\d$/)) {
          elem.className = elem.className + ' _has_error';
          no_error = false;
          tooltip = create_tooltip(elem, "Enter a valid date.");
        }
      }
      tooltip ? resize_tooltip(tooltip) : false;
      return no_error;
    };
    var needs_validate = function (el) {
      if (el.getAttribute('required') !== null) {
        return true
      }
      if (el.name === 'email' && el.value !== "") {
        return true
      }
      return false
    };
    var validate_form = function (e) {
      var err = form_to_submit.querySelector('._form_error'), no_error = true;
      if (!submitted) {
        submitted = true;
        for (var i = 0, len = allInputs.length; i < len; i++) {
          var input = allInputs[i];
          if (needs_validate(input)) {
            if (input.type == 'text') {
              addEvent(input, 'blur', function () {
                this.value = this.value.trim();
                validate_field(this, true);
              });
              addEvent(input, 'input', function () {
                validate_field(this, true);
              });
            } else if (input.type == 'radio' || input.type == 'checkbox') {
              (function (el) {
                var radios = form_to_submit.elements[el.name];
                for (var i = 0; i < radios.length; i++) {
                  addEvent(radios[i], 'click', function () {
                    validate_field(el, true);
                  });
                }
              })(input);
            } else if (input.tagName == 'SELECT') {
              addEvent(input, 'change', function () {
                validate_field(this, true);
              });
            } else if (input.type == 'textarea') {
              addEvent(input, 'input', function () {
                validate_field(this, true);
              });
            }
          }
        }
      }
      remove_tooltips();
      for (var i = 0, len = allInputs.length; i < len; i++) {
        var elem = allInputs[i];
        if (needs_validate(elem)) {
          if (elem.tagName.toLowerCase() !== "select") {
            elem.value = elem.value.trim();
          }
          validate_field(elem) ? true : no_error = false;
        }
      }
      if (!no_error && e) {
        e.preventDefault();
      }
      resize_tooltips();
      return no_error;
    };
    addEvent(window, 'resize', resize_tooltips);
    addEvent(window, 'scroll', resize_tooltips);
    window._old_serialize = null;
    if (typeof serialize !== 'undefined') window._old_serialize = window.serialize;
    _load_script("//d3rxaij56vjege.cloudfront.net/form-serialize/0.3/serialize.min.js", function () {
      window._form_serialize = window.serialize;
      if (window._old_serialize) window.serialize = window._old_serialize;
    });
    var form_submit = function (e) {
      e.preventDefault();
      if (validate_form()) {
        // Saving user data
        collect_userdata();

        // use this trick to get the submit button & disable it using plain javascript
        document.querySelector('#_form_3_submit').disabled = true;
        var serialized = _form_serialize(document.getElementById('_form_3_')).replace(/%0A/g, '\\n');
        var err = form_to_submit.querySelector('._form_error');
        err ? err.parentNode.removeChild(err) : false;
        _load_script('https://alextjackson1.activehosted.com/proc.php?' + serialized + '&jsonp=true');
      }
      return false;
    };
    addEvent(form_to_submit, 'submit', form_submit);
  })();


  $(".first-form-step").submit(function (e) {
    e.preventDefault();

    if ($('.phone-dis').val() < 1) {
      document.querySelector('#_form_3_submit').disabled = true;
      $('.phone-dis').addClass('_has_error');
      $('.phone-dis').closest('.form-group').append('<div class="_error _above"><div class="_error-arrow"></div><div class="_error-inner">This field is required.</div></div>');
      // e.preventDefault();
      // return false;
    } else {
      $('.phone-dis').removeClass(' _has_error');
      $('.phone-dis').closest('.form-group').find('._error').remove();
      document.querySelector('#_form_3_submit').disabled = false;
    }
  });


  // Submiting PayPal form
  $('#paypal-form .paypal-btn').click(function () {
    // Load user data
    let pp_userdata = get_userdata();

    if (pp_userdata) {
      $('#paypal-form input[name=email]').val(pp_userdata.email);
      $('#paypal-form input[name=first_name]').val(pp_userdata.name);
      $('#paypal-form input[name=night_phone_a]').val(pp_userdata.phone1);
      $('#paypal-form input[name=night_phone_b]').val(pp_userdata.phone2);

      // Submit hihhen form to ActiveCampaign
      //$('.hiddenFormJs ._form_7').submit();
      let formAC = $('.hiddenFormJs ._form_7');
      let iframe = document.createElement("iframe");
      let uniqueString = "ACpostFormSubmitting";
      document.body.appendChild(iframe);
      iframe.style.display = "none";
      iframe.contentWindow.name = uniqueString;
      let form = document.createElement("form");
      form.target = uniqueString;
      form.action = formAC.attr('action');
      form.method = "POST";
      $('input', formAC).each(function () {
        let input = document.createElement("input");
        input.type = "hidden";
        input.name = $(this).attr('name');
        input.value = $(this).val();
        form.appendChild(input);
      })
      document.body.appendChild(form);
      form.submit();
      console.log('Full Pay Members');

      $('#paypal-form').submit();
    } else {
      console.log('User data is not set. Form not possible to submit.');
    }

    return false;
  });

  $('#_form_1_submit').click(function () {
    // Saving user data
    collect_userdata();
  });


  $('#go-to-paypal').click(function () {
    // Saving user data
    collect_userdata();
  });

  // Saving user data to local storage for use on other pages
  function collect_userdata() {
    let email = $('.first-form-step #email').val();
    let name = $('.first-form-step #fullname').val();
    let phone1 = $('.iti__selected-dial-code').text();
    let phone2 = $('.first-form-step #phone-send').val();

    const pp_userdata = {
      email: email,
      name: name,
      phone1: phone1,
      phone2: phone2
    }

    window.localStorage.setItem('pp_userdata', JSON.stringify(pp_userdata));
  }

  function get_userdata() {
    let pp_userdata_str = window.localStorage.getItem('pp_userdata');
    if (pp_userdata_str) {
      return JSON.parse(pp_userdata_str);
    } else {
      return null;
    }
  }

  if ($('#paypal-form')) {
    // Load user data
    let pp_userdata = get_userdata();

    if (pp_userdata) {
      $('.first-form-step #email').val(pp_userdata.email);
      $('.first-form-step #fullname').val(pp_userdata.name);
      if (pp_userdata.phone1) {
        iti.setNumber(pp_userdata.phone1 + pp_userdata.phone2);
      }
      $('.first-form-step #phone-send').val(pp_userdata.phone2);
    }
  }

});

