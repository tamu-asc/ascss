var sessions;
var curr_session;
var curr_course;
var repeat_session=0;
var startTime = 1558297380;
var endTIme =  1558300980;

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
              "start_time": startTime,
              "end_time": endTIme,
            //   "state": "future",
              "address": $('.edit_session_address').val(),
              "description": $('.edit_session_description').val()
            }
          }

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
                console.log('Error in Operation',errorThrown);
            }
        })
    })

    $('.create_session').click(function() {
        var obj = {
            "session": {
              "name": $('.create_session_name').val(),
              "start_time": startTime,
              "end_time": endTIme,
            //   "state": "future",
              "address": $('.create_session_address').val(),
              "description": $('.create_session_description').val()
            }
          }

        if(repeat_session==1)
        {
          var repeat_count = $('.create_session_repeatcount').val();
          redir_url = '/api/leader/course/' + curr_course + '/session/' + '?repeatcount=' + repeat_count;
        }
        else {
          redir_url = '/api/leader/course/' + curr_course + '/session/';
        }

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
                console.log('Error in Operation',errorThrown);
            }
        })
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
                        var $edit_object;
                        var $end_object;
                        var $session_name;


        //$session_name='<td><button onclick="popfn(\''+sessionn.id+'\')" type="button" id="sessionbutton'+sessionn.id+'" class="btn btn-sm btn-dark">'+sessionn.name+'</button>';
        $session_name='<td>'+sessionn.name;
                        if(sessionn.state=="active")
                        {
                        $edit_object='<td><button disabled id="editbutton'+sessionn.id+'"class="btn btn-primary btn-sm" type="button">Edit</button></td>';
                        $end_object='<td><button id="endbutton'+sessionn.id+'" onclick="endfn(\''+sessionn.id+'\')" class="btn btn-danger btn-sm" type="button">End</button>';                            }

                        if(sessionn.state=="past")
                        {
                        $edit_object='<td><button id="editbutton'+sessionn.id+'"class="btn btn-primary btn-sm" disabled type="button">Edit</button></td>';
                        $end_object='<td><button disabled id="endbutton'+sessionn.id+'"class="btn btn-danger btn-sm" type="button">End</button></td>';
                        }

                        if(sessionn.state=="future")
                        {
                          $edit_object='<td><button id="editbutton'+sessionn.id+'" onclick="editfn(\''+sessionn.id+'\')" class="btn btn-primary btn-sm" data-toggle="modal" data-target="#EditModal" type="button">Edit</button>';
                          $end_object='<td>';
                        }

                        var utcSeconds_starttime = sessionn.start_time;
                        var starttime = new Date(0);
                        starttime.setUTCSeconds(utcSeconds_starttime);


                        var utcSeconds_endtime = sessionn.end_time;
                        var endtime = new Date(0);
                        endtime.setUTCSeconds(utcSeconds_endtime);

                        //$('#SISessionPageBody').append($('<tr onclick="popfn(\''+sessionn.id+'\')">')
                        //.append($("<th>").append(sessionn.name))
                         $('#SISessionPageBody').append($('<tr onclick="popfn(\''+sessionn.id+'\')">')
                            .append($session_name)
                            .append($("<td>").append(starttime))
                            .append($("<td>").append(endtime))
                            .append($("<td>").append(sessionn.address))
                            .append($edit_object)
                            .append($end_object)                      );
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
