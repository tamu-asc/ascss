function editfn(sessionn_id)
{
var session_file_ind="js/SIsessionind"+sessionn_id+".json";
$.getJSON(session_file_ind,
function(sess){
for(key in sess)
{
if(sess.hasOwnProperty(key))
$('input[name='+key+']').val(sess[key]);
}
})

}


function popfn(session_id) {
    $('#description'+session_id).show();

}
function closedesc(description_id) {
    $('#description'+description_id).hide();
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
                var coursename=getUrlParameter('coursename');
                var sessionfilename="js/SISession" + courseid+".json";

                $.get('/api/leader/course/'+courseid + '/sessions').then(function(data){

                                $('#coursetitle').append($('<h1>'+coursename+'</h1>'))
                            $(data.sessions).each(function(i,sessionn){
                        var $edit_object;
                        var $end_object;
                        var $session_name;


        $session_name='<td><button onclick="popfn(\''+sessionn.id+'\')" type="button" id="sessionbutton'+sessionn.id+'" class="btn btn-sm btn-dark">'+sessionn.name+'</button>';

                        if(sessionn.state=="active")
                        {
                        $edit_object='<td><button disabled id="editbutton'+sessionn.id+'"class="btn btn-primary btn-sm" type="button">Edit</button></td>';
                        $end_object='<td><button id="endbutton'+sessionn.id+'"class="btn btn-danger btn-sm" type="button">End</button></td>';
                        }

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
                         $('#SISessionPageBody').append($('<tr>')
                            .append($session_name)
                            .append($("<td>").append(starttime))
                            .append($("<td>").append(endtime))
                            .append($("<td>").append(sessionn.address))
                            .append($edit_object)
                            .append($end_object)                      );
                            $('#SISessionPageBody').append($('<tr>')
                            .append($('<td onclick="closedesc(\''+sessionn.id+'\')" colspan="100%" style="display:none;font-style:italic" id="description'+sessionn.id+'">'+sessionn.description+'<hide>'))
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








    }).fail(function(err) {
        if(err.status == 401) {
            window.location.assign('/index')
        }
    })

})
