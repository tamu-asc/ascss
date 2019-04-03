

$.ajaxSetup({
    contentType: "application/json; charset=utf-8"
});

$(document).ready(function () {

    $("#loginButton").click(function () {
        var loginCreds = {
            "user": {
                "email": $("#inputEmail").val(),
                "password": $("#inputPassword").val()
            }
        };

        $.post("/api/login", JSON.stringify(loginCreds), function (data) {
            window.location.assign('/home')
        });
    });
});