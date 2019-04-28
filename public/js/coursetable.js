function c(courseid) {
    //var redirectpage="coursepage.html"+"?courseid="+courseid+"&coursename="+coursename;
    var redirectpage="coursepage.html"+"?courseid="+courseid;
    window.location.replace(redirectpage);
  }

function std(courseid) {
      //var redirectpage="coursepage.html"+"?courseid="+courseid+"&coursename="+coursename;
    var redirectpage="stdcoursepage.html"+"?courseid="+courseid;
    window.location.replace(redirectpage);
    }

$(document).ready(function() {

    $.get('/api/user').then(function(data) {
        if(data.user) {

          /*
             //JSON for courses registered by student
                $.getJSON('api/student/courses',
                function(data,message){
                    if(data.courses.length>=1) {
                    $(data.courses).each(function(i,course){
                        $('#CoursesBody').append($("<tr>")
                            .append($("<td>").append(course.id))
                            .append($("<td>").append(course.code))
                            .append($("<td>").append(course.title))
                            .append($("<td>").append(course.semester))
                            .append($("<td>").append(course.year))
                            .append($("<td>").append(course.credits))
                            .append($('<td><button class="btn btn-primary btn-sm" type="button">View</button>')));
                    });
                } else {
                    $('#CoursesTable').hide();
                    $('.table-customise').append($("<div class='text-center no-course-class'> NO COURSES TO VIEW </div>"))

                }
                },function(err) {
                    alert(err);
                })
*/
              $.getJSON('js/courses.json',
              function(data){
                //console.log(data);
                $(data).each(function(i,course){
                  $('#CoursesBody').append($("<tr>")
                  .append($("<th>").append(course.id))
                  .append($("<td>").append(course.code))
                  .append($("<td>").append(course.title))
                  .append($("<td>").append(course.semester))
                  .append($("<td>").append(course.year))
                  .append($("<td>").append(course.credits))
                  .append($('<td><button onclick="std(\''+ course.id + '\')" class="viewbutton btn btn-primary btn-sm" type="button">View</button>')));
                });
              })



                $.get('/api/leader/courses').then(
                function(data){
                    if(data.courses.length == 0) {
                        $('.no-course-class').text('NO COURSES TO VIEW');
                        $('.no-course-class').show()

                    } else {
                        $('.no-course-class').empty();
                        $('.no-course-class').hide();
                    $(data.courses).each(function(i,course){
                        $('#SICoursesBody').append($("<tr>")
                            .append($("<td>").append(course.id))
                            .append($("<td>").append(course.code))
                            .append($("<td>").append(course.title))
                            .append($("<td>").append(course.semester))
                            .append($("<td>").append(course.year))
                            .append($("<td>").append(course.credits))
                            .append($('<td><button onclick="c(\''+ course.id + '\')" class="viewbutton btn btn-primary btn-sm" type="button">View</button>')));
                            //.append($('<td><button onclick="c(\''+ course.id + '\',\'' + course.title + '\')" class="viewbutton btn btn-primary btn-sm" type="button">View</button>')));
                    });
                }}).fail(function(err){
                    alert("error fetching courses, try again later");
                })

                  $("#logout").click(function () {
                      $.post("/api/logout", function (data) {
                          localStorage.setItem("login", "FALSE");
                          window.location.assign('/index')
                      });
                  });

                  $("#Studentbutton").click(function(){
                  $("#Studentcoursesection").show();
                  $("#SILeadercoursesection").hide();
                  });

                  $("#SILeaderbutton").click(function(){
                  $("#SILeadercoursesection").show();
                  $("#Studentcoursesection").hide();
                  });

                    $("#studentnavitem").on("click", function() {
                    $("#sileadernavitem").removeClass("active");
                    $(this).addClass("active");
                  });

                    $("#sileadernavitem").on("click", function() {
                    $("#studentnavitem").removeClass("active");
                    $(this).addClass("active");
                  });


        } else {
            window.location.assign("/index")
        }
    })

  })
