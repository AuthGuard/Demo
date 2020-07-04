/*!
    * Start Bootstrap - SB Admin v6.0.1 (https://startbootstrap.com/templates/sb-admin)
    * Copyright 2013-2020 Start Bootstrap
    * Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-sb-admin/blob/master/LICENSE)
    */
    (function($) {
    "use strict";

    // Add active state to sidbar nav links
    var path = window.location.href; // because the 'href' property of the DOM element is the absolute path
        $("#layoutSidenav_nav .sb-sidenav a.nav-link").each(function() {
            if (this.href === path) {
                $(this).addClass("active");
            }
        });

    // Toggle the side navigation
    $("#sidebarToggle").on("click", function(e) {
        e.preventDefault();
        $("body").toggleClass("sb-sidenav-toggled");
    });
})(jQuery);

function setCookie(name, value, maxAgeMinutes) {
  var cookie = name + "=" + encodeURIComponent(value) + "; path=/; SameSite=Strict;";
  document.cookie = cookie;
}

async function login(username, password) {
  const response = await fetch('/api/auth/authn', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      username: username,
      password: password
    })
  });

  if (response.ok) {
    return {
      success: true,
      response: response
    };
  } else {
    return {
      success: false,
      error: '' // TODO set a proper error
    };
  }
}

async function signup(signupRequest) {
  const response = await fetch('/api/auth/signup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(signupRequest)
  });

  if (response.ok) {
    return {
      success: true
    };
  } else {
    console.error(response);
    return {
      success: false,
      error: '' // TODO cause of the error
    };
  }
}

(
  function setLoginClickEvent() {
    const loginBtn = document.getElementById('loginBtn');

    if (loginBtn) {
      loginBtn.onclick = () => {
        const username = document.getElementById('inputUsername').value;
        const password = document.getElementById('inputPassword').value;

        if (username && password) {
          login(username, password)
            .then(result => {
              if (result.success) {
                console.log('Successful login');
                result.response.json()
                  .then(json => {
                    console.log(json);
                    const token = json.token;
                    setCookie('token', token);
                    // window.location.href = "/";
                  });
              } else {
                console.error('Failed login', result);
              }
            });
        }
      };
    }
  }
)();

(
  function setRegisterClickEvent() {
    const signupBtn = document.getElementById('signupBtn');

    if (signupBtn) {
      signupBtn.onclick = () => {
        const firstName = document.getElementById('inputFirstName').value;
        const lastName = document.getElementById('inputLastName').value;
        const email = document.getElementById('inputEmailAddress').value;
        const username = document.getElementById('inputUsername').value;
        const password = document.getElementById('inputPassword').value;

        const signupRequest = {
          firstName: firstName,
          lastName: lastName,
          email: email,
          username: username,
          password: password
        };

        signup(signupRequest)
          .then(result => {
            if (result.success) {
              console.log('Successful signup');
              document.getElementById('signupFormDialog').style.display = 'none';
              document.getElementById('successDialog').style.display = 'block';
            } else {
              console.error('Non-successful signup', result);
              // TODO display an error label
            }
          })
          .catch(err => {
            console.error('Something went horribly wrong');
          });
      };
    }
  }
)();
