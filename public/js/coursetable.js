function c(courseid,coursename) {
    var redirectpage="coursepage.html"+"?courseid="+courseid+"&coursename="+coursename;
    window.location.replace(redirectpage);
  }

$(document).ready(function() {
    if(localStorage.getItem("login") != "TRUE") {
        window.location.assign("/index")
    }
    else {
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
        $('.table-customise').append($("<div class='text-center'> NO COURSES TO VIEW </div>"))

    }
    },function(err) {
        alert(err);
    })

    //JSON for courses assigned to SI Leader
    $.getJSON('js/SIcourses.json',
    function(data){
        $(data).each(function(i,course){
            $('#SICoursesBody').append($("<tr>")
                .append($("<td>").append(course.id))
                .append($("<td>").append(course.code))
                .append($("<td>").append(course.title))
                .append($("<td>").append(course.semester))
                .append($("<td>").append(course.year))
                .append($("<td>").append(course.credits))
                .append($('<td><button onclick="c(\''+ course.id + '\',\'' + course.title + '\')" class="viewbutton btn btn-primary btn-sm" type="button">View</button>')));
        });
    },function(err) {
        alert(err);
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

      }

  })
