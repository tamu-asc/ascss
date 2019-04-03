def course_format(json, course)
  json.id course.id
  json.title course.title
  json.semester course.semester
  json.year course.year
  json.credits course.credits
  json.code course.code
end

if @course != nil
  json.course do
    course_format json, @course
  end
end

if @courses != nil
  json.courses @courses do |each_course|
    course_format json, each_course
  end
end