var sessions;
var curr_session;
var curr_course;
var repeat_session=0;
var startTime = 1558297380;
var endTIme =  1558300980;
var username_list = [];

  $(function () {
    $('#starttimeid').datetimepicker();
    });

  $(function () {
    $('#start_timeid').datetimepicker();
    });

  $(function () {
    $('#endtimeid').datetimepicker();
      });

  $(function () {
    $('#end_timeid').datetimepicker();
    });

function editfn(sessionn_id)
{
curr_session = sessionn_id;
sess = sessions.filter((data)=> data.id==sessionn_id);
sess = sess[0];
for(key in sess)
{
if(sess.hasOwnProperty(key))
$('input[name='+key+']').val(sess[key]);
}

var starttime_epochsecs=sess.start_time;
var endtime_epochsecs=sess.end_time;

var starttime_millis=starttime_epochsecs*1000;
var endtime_millis=endtime_epochsecs*1000;

var starttime_dateobject= new Date(starttime_millis);
var endtime_dateobject= new Date(endtime_millis);

var starttime_day = (starttime_dateobject.getDate() < 10 ? '0' : '') + starttime_dateobject.getDate();
var starttime_month = (starttime_dateobject.getMonth() < 9 ? '0' : '') + (starttime_dateobject.getMonth() + 1);
var starttime_year = starttime_dateobject.getFullYear();
var starttime_hours = starttime_dateobject.getHours();
var starttime_minutes = (starttime_dateobject.getMinutes() < 10 ? '0' : '') + starttime_dateobject.getMinutes();

var endtime_day = (endtime_dateobject.getDate() < 10 ? '0' : '') + endtime_dateobject.getDate();
var endtime_month = (endtime_dateobject.getMonth() < 9 ? '0' : '') + (endtime_dateobject.getMonth() + 1);
var endtime_year = endtime_dateobject.getFullYear();
var endtime_hours = endtime_dateobject.getHours();
var endtime_minutes = (endtime_dateobject.getMinutes() < 10 ? '0' : '') + endtime_dateobject.getMinutes();

var startstring=starttime_year+'/'+starttime_month+'/'+starttime_day+' '+starttime_hours+':'+starttime_minutes;
var endstring=endtime_year+'/'+endtime_month+'/'+endtime_day+' '+endtime_hours+':'+endtime_minutes;
$('#starttimeid').val(startstring);
$('#endtimeid').val(endstring);



}

function attendancefn(sessionn_id) {
    curr_session = sessionn_id;
    username_list = [];
    update_attendance_username_list();
}

function update_attendance_username_list() {
    document.getElementById("attn_username_id").value = "";
    var username_list_str = "";
    for(var i in username_list) {
        username_list_str += (username_list[i] + "<br>");
    }
    document.getElementById("attn_username_list_id").innerHTML = username_list_str;
}

function endfn(session_id) {
    $.ajax({
        url: '/api/leader/course/' + curr_course + '/session/' + session_id +'/end_session',
        type: 'POST',
        contentType: "application/json",
        dataType: 'json',
        success: function (data, textStatus, xhr) {
            location.reload()
        },
        error: function (xhr, textStatus, errorThrown) {
            alert('error occured while ending session (session is expired)')
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

    $('.update_attendacne').click(function () {
        var obj = {
            usernames: username_list
        };
        $.ajax({
            url: '/api/leader/course/' + curr_course + '/session/' + curr_session + '/mark_attendance',
            type: 'POST',
            contentType: "application/json",
            data: JSON.stringify(obj),
            dataType: 'json',
            success: function (data, textStatus, xhr) {
                location.reload()
            },
            error: function (xhr, textStatus, errorThrown) {
                alert('Error occured while performing the Operation', errorThrown);
                console.log('Error in Operation',errorThrown);
            }
        });
    });

    $('.add_user_name_attn').on('keypress', function (e) {
        if (e.which == 13) {
            let username = document.getElementById("attn_username_id").value;
            username = username.trim();
            if (username != "" && username_list.indexOf(username) == -1) {
                username_list.push(username);
            } else {
                alert("Blank or duplicate entry");
            }
            update_attendance_username_list();
            return false;
        }
    });


    $('.delete_session').click(function() {
        $.ajax({
            url: '/api/leader/course/' + curr_course + '/session/' + curr_session,
            type: 'DELETE',
            success: function(result) {
                location.reload()
            }
        });
    })

    $('.save_session').click(function() {
        var obj = {
            "session": {
              "name": $('.edit_session_name').val(),
              "start_time": Number(new Date(document.getElementById('starttimeid').value))/1000,
              "end_time": Number(new Date(document.getElementById('endtimeid').value))/1000,
            //   "state": "future",
              "address": $('.edit_session_address').val(),
              "description": $('.edit_session_description').val()
            }
          }

          var timenow=Number(new Date())/1000;


          if( (obj["session"]["start_time"] == obj["session"]["end_time"]) || (obj["session"]["start_time"] <= timenow) || (obj["session"]["end_time"] <= timenow)  || obj["session"]["name"] == "" || obj["session"]["name"] == undefined || obj["session"]["address"] == "" || obj["session"]["address"] == undefined || obj["session"]["description"] == "" || obj["session"]["description"] == undefined || obj["session"]["start_time"] == "" || obj["session"]["start_time"] == undefined ||  isNaN(obj["session"]["start_time"]) || obj["session"]["end_time"] == "" || obj["session"]["end_time"] == undefined || isNaN(obj["session"]["end_time"]) || (obj["session"]["start_time"] > obj["session"]["end_time"]) )
          {
            if(obj["session"]["name"] == "" || obj["session"]["name"] == undefined)
            {
              $('#editsessionflash').show();
            }
            else {
              $('#editsessionflash').hide();
            }

            if((obj["session"]["start_time"] == obj["session"]["end_time"]) || obj["session"]["start_time"] == "" || obj["session"]["start_time"] == undefined ||  isNaN(obj["session"]["start_time"]) || (obj["session"]["start_time"] > obj["session"]["end_time"]) || (obj["session"]["start_time"] <= timenow) )
            {
              $('#editstarttimeflash').show();
            }
            else {
              $('#editstarttimeflash').hide();
            }

            if((obj["session"]["start_time"] == obj["session"]["end_time"]) || obj["session"]["end_time"] == "" || obj["session"]["end_time"] == undefined || isNaN(obj["session"]["end_time"]) || (obj["session"]["start_time"] > obj["session"]["end_time"]) || (obj["session"]["end_time"] <= timenow)  )
            {
              $('#editendtimeflash').show();
            }
            else {
              $('#editendtimeflash').hide();
            }

            if(obj["session"]["address"] == "" || obj["session"]["address"] == undefined)
            {
              $('#editaddressflash').show();
            }
            else {
              $('#editaddressflash').hide();
            }


            if(obj["session"]["description"] == "" || obj["session"]["description"] == undefined)
            {
              $('#editdescriptionflash').show();
            }
            else {
              $('#editdescriptionflash').hide();
            }

            //alert('please fill out all fields correctly')
            $("#bodyofcoursepage").shake(3,7,800);
            return
          } else {

            $.ajax({
                url: '/api/leader/course/' + curr_course + '/session/' + curr_session,
                type: 'PATCH',
                contentType: "application/json",
                data: JSON.stringify(obj),
                dataType: 'json',
                success: function (data, textStatus, xhr) {
                    location.reload()
                },
                error: function (xhr, textStatus, errorThrown) {
                  alert('Error occured while performing the Operation', errorThrown);
                    console.log('Error in Operation',errorThrown);
                }
            })
          }
    })

    $('.create_session').click(function() {
        var obj = {
            "session": {
              "name": $('.create_session_name').val(),
              "start_time": Number(new Date(document.getElementById('start_timeid').value))/1000,
              "end_time": Number(new Date(document.getElementById('end_timeid').value))/1000,
            //   "state": "future",
              "address": $('.create_session_address').val(),
              "description": $('.create_session_description').val()
            }
          }
          var timenow=Number(new Date())/1000;
          //console.log(obj)
        if(repeat_session==1)
        {
          var repeat_count = $('.create_session_repeatcount').val();
          redir_url = '/api/leader/course/' + curr_course + '/session/' + '?repeatcount=' + repeat_count;
        }
        else {
          redir_url = '/api/leader/course/' + curr_course + '/session/';
        }

        if( (obj["session"]["start_time"] == obj["session"]["end_time"]) || (obj["session"]["start_time"] <= timenow) || (obj["session"]["end_time"] <= timenow)  || obj["session"]["name"] == "" || obj["session"]["name"] == undefined || obj["session"]["address"] == "" || obj["session"]["address"] == undefined || obj["session"]["description"] == "" || obj["session"]["description"] == undefined || obj["session"]["start_time"] == "" || obj["session"]["start_time"] == undefined ||  isNaN(obj["session"]["start_time"]) || obj["session"]["end_time"] == "" || obj["session"]["end_time"] == undefined || isNaN(obj["session"]["end_time"]) || (obj["session"]["start_time"] > obj["session"]["end_time"]) )
        {
          if(obj["session"]["name"] == "" || obj["session"]["name"] == undefined)
          {
            $('#createsessionflash').show();
          }
          else {
            $('#createsessionflash').hide();
          }

          if((obj["session"]["start_time"] == obj["session"]["end_time"]) || obj["session"]["start_time"] == "" || obj["session"]["start_time"] == undefined ||  isNaN(obj["session"]["start_time"]) || (obj["session"]["start_time"] > obj["session"]["end_time"]) || (obj["session"]["start_time"] <= timenow) )
          {
            $('#createstarttimeflash').show();
          }
          else {
            $('#createstarttimeflash').hide();
          }

          if((obj["session"]["start_time"] == obj["session"]["end_time"]) || obj["session"]["end_time"] == "" || obj["session"]["end_time"] == undefined || isNaN(obj["session"]["end_time"]) || (obj["session"]["start_time"] > obj["session"]["end_time"]) || (obj["session"]["end_time"] <= timenow)  )
          {
            $('#createendtimeflash').show();
          }
          else {
            $('#createendtimeflash').hide();
          }

          if(obj["session"]["address"] == "" || obj["session"]["address"] == undefined)
          {
            $('#createaddressflash').show();
          }
          else {
            $('#createaddressflash').hide();
          }


          if(obj["session"]["description"] == "" || obj["session"]["description"] == undefined)
          {
            $('#createdescriptionflash').show();
          }
          else {
            $('#createdescriptionflash').hide();
          }

          //alert('please fill out all fields correctly')
          $("#bodyofcoursepage").shake(3,7,800);
          return
        } else {
        $.ajax({
            url: redir_url,
            type: 'POST',
            contentType: "application/json",
            data: JSON.stringify(obj),
            dataType: 'json',
            success: function (data, textStatus, xhr) {
                location.reload()
            },
            error: function (xhr, textStatus, errorThrown) {
                 alert('Error occured while performing the Operation', errorThrown);
                console.log('Error in Operation',errorThrown);
            }
        })
      }



    })



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
                $.get('/api/course/'+courseid).then(function(data){
                coursename = data.course.title;
                course_code = data.course.code;
                coursename = course_code + ' - ' + coursename;

                }).fail(function(err) {
                    alert(err.statusCode)
                    console.log(err)
                })




                //var coursename=getUrlParameter('coursename');

                var sessionfilename="js/SISession" + courseid+".json";

                $.get('/api/leader/course/'+courseid + '/sessions').then(function(data){
                    sessions = data.sessions;
                                $('#coursetitle').append($('<h1>'+coursename+'</h1>'))
                            $(data.sessions).each(function(i,sessionn){
                        var $action_object;
                        var $session_name;


        //$session_name='<td><button onclick="popfn(\''+sessionn.id+'\')" type="button" id="sessionbutton'+sessionn.id+'" class="btn btn-sm btn-dark">'+sessionn.name+'</button>';
        $session_name='<td>'+sessionn.name;
                        if(sessionn.state=="active")
                        {
                            $action_object='<td><button id="endbutton'+sessionn.id+'" onclick="endfn(\''+sessionn.id+'\')" class="btn btn-danger btn-sm" type="button">End Session</button>';
                        }
                        if(sessionn.state=="past")
                        {
                            $action_object='<td><button id="attendancebutton'+sessionn.id+'" onclick="attendancefn(\''+sessionn.id+'\')" class="btn btn-primary btn-sm" data-toggle="modal" data-target="#AttendanceModal" type="button">Add Attendance</button>';
                        }

                        if(sessionn.state=="future")
                        {
                            $action_object='<td><button id="editbutton'+sessionn.id+'" onclick="editfn(\''+sessionn.id+'\')" class="btn btn-primary btn-sm" data-toggle="modal" data-target="#EditModal" type="button">Edit Session</button>';
                        }



                        var utcSeconds_starttime = sessionn.start_time;
                        var starttime = new Date(0);


                        starttime.setUTCSeconds(utcSeconds_starttime);
                        //starttime=starttime.toString().substring(4,21);
                        starttime=starttime.toLocaleString();

                        var utcSeconds_endtime = sessionn.end_time;
                        var endtime = new Date(0);

                        endtime.setUTCSeconds(utcSeconds_endtime);
                        //endtime=endtime.toString().substring(4,21);
                        endtime=endtime.toLocaleString();


                         $('#SISessionPageBody').append($('<tr class="entry-hover-class" align="center" onclick="popfn(\''+sessionn.id+'\')">')
                            .append($session_name)
                            .append($("<td>").append(starttime))
                            .append($("<td>").append(endtime))
                            .append($("<td>").append(sessionn.address))
                            .append($action_object)                      );
                            $('#SISessionPageBody').append($('<tr>')
                            .append($('<td colspan="100%" class= "bevisible" style="display:none;font-style:italic" id="description'+sessionn.id+'" >').append(sessionn.description))
                                                          );
                            });

                }).fail(function(err) {
                    alert(err.statusCode)
                    console.log(err)
                })






                $('#EditModal').on('hidden.bs.modal', function () {
                  $(this).find('form').trigger('reset');
                  $('#CreateModal').find('form').trigger('reset');
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

                $("#repeatSession").click(function(){


                //$('#repeatsessionid').show();
                if($("#repeatSession").is(':checked'))
                {
                  repeat_session=1;
                  $('#repeatsessionid').show();
                }
                else
                {
                  repeat_session=0;
                  $('#repeatsessionid').hide();
                }

                });






    }).fail(function(err) {
        if(err.status == 401) {
            window.location.assign('/index')
        }
    })

})
