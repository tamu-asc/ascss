var sessions;
var curr_session;
var curr_course;
var repeat_session=0;
var startTime = 1558297380;
var endTIme =  1558300980;

function markfn(session_id) {

}

function popfn(session_id) {

var x = document.getElementById("description"+session_id);
 if (x.class == "behidden") {
   $('#description'+session_id).hide();
   x.class="bevisible";
 } else {
   x.class = "behidden";
   $('#description'+session_id).show();
 }
}

$(document).ready(function() {

    $.get('/api/user').then(
        function(data){

        var getUrlParameter = function getUrlParameter(sParam) {
            var sPageURL = window.location.search.substring(1),
                sURLVariables = sPageURL.split('&'),
                sParameterName,
                i;

            for (i = 0; i < sURLVariables.length; i++) {
                sParameterName = sURLVariables[i].split('=');

                if (sParameterName[0] === sParam) {
                    return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
                }
            }
        };

                var courseid=getUrlParameter('courseid');
                curr_course = courseid;
                var coursename;
//
                coursename = "Software";

/*
                $.get('/api/course/'+courseid).then(function(data){
                coursename = data.course.title;

                }).fail(function(err) {
                    alert(err.statusCode)
                    console.log(err)
                })


*/
          //      var sessionfilename="js/StdSession" + courseid+".json";

                $.get('/api/leader/course/'+courseid + '/sessions').then(function(data){
                    sessions = data.sessions;
                                $('#coursetitle').append($('<h1>'+coursename+'</h1>'))
                            $(data.sessions).each(function(i,sessionn){

                        var $mark_attendance_object;
                        var $session_name;

        $session_name='<td>'+sessionn.name;
                        if(sessionn.state=="active")
                        {
                        $mark_attendance_object='<td><button id="markbutton'+sessionn.id+'" onclick="markfn(\''+sessionn.id+'\')" class="btn btn-danger btn-sm" type="button">Mark</button>';
                        }

                        if(sessionn.state=="past")
                        {
                        //$mark_attendance_object='<td><button disabled id="markbutton'+sessionn.id+'"class="btn btn-danger btn-sm" type="button">Mark</button></td>';
                          $mark_attendance_object='<td>';
                        }

                        if(sessionn.state=="future")
                        {
                          $mark_attendance_object='<td>';
                        }

                        var utcSeconds_starttime = sessionn.start_time;
                        var starttime = new Date(0);
                        starttime.setUTCSeconds(utcSeconds_starttime);
                        starttime=starttime.toLocaleString();
                        //starttime=starttime.toString().substring(4,21);



                        var utcSeconds_endtime = sessionn.end_time;
                        var endtime = new Date(0);
                        endtime.setUTCSeconds(utcSeconds_endtime);
                        endtime=endtime.toLocaleString();
                        //endtime=endtime.toString().substring(4,21);


                        //$('#SISessionPageBody').append($('<tr onclick="popfn(\''+sessionn.id+'\')">')
                        //.append($("<th>").append(sessionn.name))
                         $('#StdSessionPageBody').append($('<tr onclick="popfn(\''+sessionn.id+'\')">')
                            .append($session_name)
                            .append($("<td>").append(starttime))
                            .append($("<td>").append(endtime))
                            .append($("<td>").append(sessionn.address))
                            .append($("<td>").append(sessionn.instructor))
                            .append($mark_attendance_object)                      );
                            $('#StdSessionPageBody').append($('<tr>')
                            .append($('<td colspan="100%" class= "bevisible" style="display:none;font-style:italic" id="description'+sessionn.id+'" >').append(sessionn.description))
                                                          );
                            });

                }).fail(function(err) {
                    alert(err.statusCode)
                    console.log(err)
                })

                $("#logout").click(function () {
                    $.post("/api/logout", function (data) {
                        localStorage.setItem("login", "FALSE");
                        window.location.assign('/index')
                    });
                });

                $("#Returnbutton").click(function(){
                var redirectpage="home.html";
                window.location.replace(redirectpage);
                });

    }).fail(function(err) {
        if(err.status == 401) {
            window.location.assign('/index')
        }
    })

})
