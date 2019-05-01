var sessions;
var curr_session;
var curr_course;
var repeat_session=0;
var startTime = 1558297380;
var endTIme =  1558300980;

function markfn(session_id) {

         $.ajax({
            url: "/api/student/course/" +  curr_course  + "/session/" + session_id + "/mark_attendance",
            type: 'POST',
            contentType: "application/json",
            dataType: 'json',
            success: function ({}, textStatus, xhr) {
                location.reload()
            },
            error: function (xhr, textStatus, errorThrown) {
                alert('some error occures, try again later! \n if error persists, contact admin')
                console.log('Error in Operation',errorThrown);
            }
        })

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
                var course_code;
                var coursename;

                $.get('/api/course/'+courseid).then(function(data) {
                    coursename = data.course.title;
                    course_code = data.course.code;
                    coursename = course_code + ' - ' + coursename;
                }).fail(function(err){
                    alert('error while fetching course details ')
                })

                $.get('/api/student/course/'+courseid + '/sessions').then(function(data){
                    sessions = data.sessions;
                                $('#coursetitle').append($('<h1>'+coursename+'</h1>'))
                            $(data.sessions).each(function(i,sessionn){

                        var $mark_attendance_object;
                        var $session_name;

        $session_name='<td>'+sessionn.name;
                        if(sessionn.state=="active")
                        {
                            if(!sessionn.hasOwnProperty('attendance')) {
                        $mark_attendance_object='<td><button id="markbutton'+sessionn.id+'" onclick="markfn(\''+sessionn.id+'\')" class="btn btn-danger btn-sm" type="button">Mark</button>';
                            } else {
                                $mark_attendance_object='<td style="color:green;"><b>In time: '+new Date(sessionn.attendance.in_time * 1000).toLocaleString() +'</b>';

                            }

                        }

                        if(sessionn.state=="past")
                        {

                            if(!sessionn.hasOwnProperty('attendance')) {
                                $mark_attendance_object='<td style="color:red"><b>Not Available</b>';
                                    } else {
                                        $mark_attendance_object='<td style="color:green;"><b>In time: '+new Date(sessionn.attendance.in_time * 1000).toLocaleString() +'</b>';        
                                    }
                        }

                        if(sessionn.state=="future")
                        {
                          $mark_attendance_object='<td style="color:red"><b>Not Available</b>';
                        }

                        var utcSeconds_starttime = sessionn.start_time;
                        var starttime = new Date(0);
                        starttime.setUTCSeconds(utcSeconds_starttime);
                        starttime=starttime.toLocaleString();



                        var utcSeconds_endtime = sessionn.end_time;
                        var endtime = new Date(0);
                        endtime.setUTCSeconds(utcSeconds_endtime);
                        endtime=endtime.toLocaleString();


                         $('#StdSessionPageBody').append($('<tr onclick="popfn(\''+sessionn.id+'\')">')
                            .append($session_name)
                            .append($("<td>").append(starttime))
                            .append($("<td>").append(endtime))
                            .append($("<td>").append(sessionn.address))
                            .append($("<td>").append(sessionn.leader.first_name + sessionn.leader.last_name))
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
