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


             //JSON for courses registered by student

             $.get('/api/student/courses').then(
             function(data){
                 if(data.courses.length == 0) {
                   $('#CourseTable').hide();
                   $('#CourseCard').append($("<div class='text-center' id='no-stdcourse-id'> NO COURSES TO VIEW </div>"));
                   $('#no-stdcourse-id').show();
                 } else {
                     //$('#no-stdcourse-id').empty();
                     $('#no-stdcourse-id').hide();


                 $(data.courses).each(function(i,course){
                     $('#CoursesBody').append($("<tr>")
                         .append($("<td>").append(course.id))
                         .append($("<td>").append(course.code))
                         .append($("<td>").append(course.title))
                         .append($("<td>").append(course.semester))
                         .append($("<td>").append(course.year))
                         .append($("<td>").append(course.credits))
                         .append($('<td><button onclick="std(\''+ course.id + '\')" class="btn btn-primary btn-sm" type="button">View</button>')));
                         //.append($('<td><button onclick="c(\''+ course.id + '\',\'' + course.title + '\')" class="viewbutton btn btn-primary btn-sm" type="button">View</button>')));
                 });
             }}).fail(function(err){
                 alert("error fetching courses, try again later");
             })


                $.get('/api/leader/courses').then(
                function(data){
                    if(data.courses.length == 0) {

                      $('#SICourseTable').hide();
                      $('#SICourseCard').append($("<div class='text-center' id='no-course-id' > NO COURSES TO VIEW </div>"));
                      $('#no-course-id').show();
                    } else {

                        //$("#no-course-id").empty();

                        $('#no-course-id').hide();
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
