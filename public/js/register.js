

$.ajaxSetup({
    contentType: "application/json; charset=utf-8"
});

$(document).ready(function () {


  jQuery.fn.shake = function(intShakes, intDistance, intDuration) {
    this.each(function() {
    $(this).css("position","relative");
    for (var x=1; x<=intShakes; x++) {
    $(this).animate({left:(intDistance*-1)}, (((intDuration/intShakes)/4)))
    .animate({left:intDistance}, ((intDuration/intShakes)/2))
    .animate({left:0}, (((intDuration/intShakes)/4)));
    }
    });
    return this;
    };

// $('#inputPassword').tooltip({'trigger':'focus', 'title': 'Password tooltip'});
    $("#registerButton").click(function () {
      const expression = /\S+@\S+/;


        var loginCreds = {
            "user": {
                "first_name": $("#firstName").val(),
                "last_name": $("#lastName").val(),
                "username": $("#userName").val(),
                "email": $("#inputEmail").val(),
                "password": $("#inputPassword").val(),
                "password_confirmation": $("#inputPasswordConfirmation").val()
            }
        };
        if (loginCreds["user"]["first_name"] == "" || loginCreds["user"]["last_name"] == "" || loginCreds["user"]["last_name"] == undefined
        || loginCreds["user"]["first_name"] == undefined || loginCreds["user"]["username"] == ""
        || loginCreds["user"]["username"] == undefined ||
        !expression.test(String(loginCreds["user"]["email"]).toLowerCase())
        ||  !(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/).test(loginCreds["user"]["password"])
        || loginCreds["user"]["password"]!==loginCreds["user"]["password_confirmation"]
      ) {

        if (loginCreds["user"]["first_name"] == "" ||   loginCreds["user"]["first_name"] == undefined)
        {
          $('#firstnameflash').show();
        }
        else {
          $('#firstnameflash').hide();
        }

        if(loginCreds["user"]["last_name"] == "" || loginCreds["user"]["last_name"] == undefined)
        {
 	        $('#lastnameflash').show();
        }
        else {
          $('#lastnameflash').hide();
        }

        if(loginCreds["user"]["username"] == ""  || loginCreds["user"]["username"] == undefined)
        {
 	        $('#usernameflash').show();
        }
        else {
          $('#usernameflash').hide();
        }

        if(!expression.test(String(loginCreds["user"]["email"]).toLowerCase()) )
        {
 	        $('#emailflash').show();
        }
        else {
          $('#emailflash').hide();
        }


        if( !(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/).test(loginCreds["user"]["password"]) )
        {
 	        $('#passwordflash').show();
        }
        else {
          $('#passwordflash').hide();
        }


        if( loginCreds["user"]["password"]!==loginCreds["user"]["password_confirmation"])
        {
 	        $('#passwordconfirmflash').show();
        }
        else {
          $('#passwordconfirmflash').hide();
        }






      //  alert('please fill out all fields correctly')
      $("#registerbody").shake(3,7,800);
        return
      }  else {
        $.post("/api/signup", JSON.stringify(loginCreds), function (data) {
            window.location.assign("/index")
        }).fail(function(error){
          alert('please fill out all fields correctly')
        });
      }
    });
});
