function a() {
    //JSON containing per course details (session details) for SI Leader
    $.getJSON('js/SIsessions.json',
    function(data){
        $(data).each(function(i,sessionn){
        var $edit_object;
        //Append Disabled edit button for past sessions, Otherwise Append Enabled edit button for present and future sessions
        if(sessionn.state=="present")
        {
            $edit_object='<td><button id="buttons" class="btn btn-primary btn-sm" type="button">Edit</button>';
        }
            
        if(sessionn.state=="past")
        {
            $edit_object='<td><button id="buttons" class="btn btn-primary btn-sm" disabled type="button">Edit</button>';
        }
            
        if(sessionn.state=="future")
        {
            $edit_object='<td><button id="buttons" class="btn btn-primary btn-sm" type="button">Edit</button>';
        }
            
        $('#SISessionBody').append($("<tr>")
            .append($("<th>").append(sessionn.id))
            .append($("<td>").append(sessionn.name))
            .append($("<td>").append(sessionn.address))
            .append($edit_object)
            .append("<td>")       );                       
        });
        })
        $("#SICourseTable").hide();
        $("#SIsessionTable").show();
        $("#Backbutton").show();
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
                .append($("<th>").append(course.id))
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
                .append($("<th>").append(course.id))
                .append($("<td>").append(course.code))
                .append($("<td>").append(course.title))
                .append($("<td>").append(course.semester))
                .append($("<td>").append(course.year))
                .append($("<td>").append(course.credits))
                .append($('<td><button onclick="a()" class="viewbutton btn btn-primary btn-sm" type="button">View</button>')));
        });
    },function(err) {
        alert(err);
    })        

    $("#Studentbutton").click(function(){
    $("#Studentcoursesection").show();
    $("#SILeadercoursesection").hide();
    });
        
    $("#Backbutton").click(function(){
    $("#SIsessionTable tbody").empty();
    $("#SICourseTable").show();
    $("#SIsessionTable").hide();
    $("#Backbutton").hide();
    });
        
    $("#SILeaderbutton").click(function(){
    $("#SILeadercoursesection").show();
    $("#Studentcoursesection").hide();
    });     

    $("#logout").click(function () {
        $.post("/api/logout", function (data) {
            localStorage.setItem("login", "FALSE");
            window.location.assign('/index')
        });
    });
    }   
    
})


