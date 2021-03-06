jQuery(document).ready(function ($) {
  // A reference to Stripe.js initialized with your real test publishable API key.
  var stripe = Stripe(ENV_VARS.STRIPE_PUBLIC_KEY);

  // Disable the button until we have Stripe set up on the page
  // document.querySelector("#strapiBtn").disabled = true;
  document.querySelector(".strapiBtn").disabled = true;

  var elements = stripe.elements();
  var style = {
    base: {
      color: "#32325d",
      fontFamily: 'Arial, sans-serif',
      fontSmoothing: "antialiased",
      fontSize: "16px",
      "::placeholder": {
        color: "#32325d"
      }
    },
    invalid: {
      fontFamily: 'Arial, sans-serif',
      color: "#fa755a",
      iconColor: "#fa755a"
    }
  };
  var card = elements.create("card", { style: style });
  // Stripe injects an iframe into the DOM
  card.mount("#card-element");

  card.on("change", function (event) {
    // Disable the Pay button if there are no card details in the Element
    document.querySelector(".strapiBtn").disabled = event.empty;
    document.querySelector("#card-error").textContent = event.error ? event.error.message : "";
  });

  $(document).on("click", "#strapiBtn", function (event) {
    event.preventDefault();
    if ($(this).is(":disabled")) {
      return false;
    }

    if ( ! window.clientSecret) {
      console.log("Server response has not arrived. clientSecret is empty.")
      return false;
    }

    // Complete payment when the submit button is clicked
    payWithCard(stripe, card, window.clientSecret);
  });

  function server_endpoint() {
    fetch(ENV_VARS.SERVER_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        payment: $('[name=flexRadioDefault]:checked').val(),
        name: $('#fullname').val(),
        email: $('#email').val(),
        phone: $('.phoneHiddenJs').val()
      })
    })
      .then(function (result) {
        return result.json();
      })
      .then(function (data) {

/* @1819
        var form = document.getElementById("payment-form");
        form.addEventListener("submit", function (event) {
          event.preventDefault();

          // Complete payment when the submit button is clicked
          payWithCard(stripe, card, data.clientSecret);

        });
 */
        window.clientSecret = data.clientSecret;
      });

  }
  server_endpoint();

  // 
  $(document).on("click", ".form-check .form-check-label", function () {
    server_endpoint();
  });

  // Calls stripe.confirmCardPayment
  // If the card requires authentication Stripe shows a pop-up modal to
  // prompt the user to enter authentication details without leaving your page.
  var payWithCard = function (stripe, card, clientSecret) {
    loading(true);
    stripe
      .confirmCardPayment(clientSecret, {
        payment_method: {
          card: card
        }
      })
      .then(function (result) {
        if (result.error) {
          // Show error to your customer
          showError(result.error.message);
          $( "#card-element" ).effect( "shake" );
        } else {
          // The payment succeeded!
          orderComplete(result.paymentIntent.id);

          //emulate click on hidden form
          if ($(".radio-group-options input[type='radio']:checked").val() == 'paymentOneTime') {
            $('.hiddenFormJs ._form_7').submit();
            console.log('Full Pay Members');
          } else {
            $('.hiddenFormJs ._form_9').submit();
            console.log('Payment Plan Members');
          }

        }
      });
  };

  /* ------- UI helpers ------- */

  // Shows a success message when the payment is complete
  var orderComplete = function (paymentIntentId) {
    loading(false);

    document
      .querySelector(".result-message a")
      .setAttribute(
        "href",
        "https://dashboard.stripe.com/test/payments/" + paymentIntentId
      );
    document.querySelector(".result-message").classList.remove("hidden");

    // document.querySelector(".strapiBtn").disabled = true;
    document.querySelector(".strapiBtn").classList.add("hidden");

  };

  // Show the customer the error from Stripe if their card fails to charge
  var showError = function (errorMsgText) {
    loading(false);
    var errorMsg = document.querySelector("#card-error");
    errorMsg.textContent = errorMsgText;
    $("#card-form-control").addClass("red");
    setTimeout(function () {
      errorMsg.textContent = "";
      $("#card-form-control").removeClass("red");
    }, 4000);
  };

  // Show a spinner on payment submission
  var loading = function (isLoading) {
    if (isLoading) {
      // Disable the button and show a spinner
      document.querySelector(".strapiBtn").disabled = true;
      document.querySelector(".spinner").classList.remove("hidden");
      document.querySelector(".button-text").classList.add("hidden");
      $(".strapiBtn").attr("disabled", true);
      $("#overlay").removeClass("hidden");
    } else {
      document.querySelector(".strapiBtn").disabled = false;
      document.querySelector(".spinner").classList.add("hidden");
      document.querySelector(".button-text").classList.remove("hidden");
      $(".strapiBtn").removeAttr("disabled");
      $("#overlay").addClass("hidden");
    }
  };

});
