//$.getJSON('js/courses.json',
//function(data){
    //console.log(data);
    //var items=[]
    //$(data).each(function(i,course){
    //items.push('<a href="#" class="list-group-item list-group-item-action list-group-item-dark"></a>');        
    //items.push('<li class="list-group-item list-group-item-secondary">'+course.code+'   -   '+course.title+'</li>');
    //        
    //});
    //$('#dynamiclistbody').append(items.join(''));
    //})

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
            .append($('<td><a class="btn btn-primary btn-sm" href="#" role="button">View</a>')));
    });
})         