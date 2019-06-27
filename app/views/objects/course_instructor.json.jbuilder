def course_instructor_format(json, course_instructor)
  json.id course_instructor.id
  json.course_id course_instructor.course.id
  json.code course_instructor.course.code
  json.username course_instructor.username

  unless course_instructor.user.blank? || (@user.role == "admin" && course_instructor.user.id == @user.id)
    json.user_id course_instructor.user.id
    json.first_name course_instructor.user.first_name
    json.last_name course_instructor.user.last_name
    json.email course_instructor.user.email
  end

  if @raw == nil
    json.title course_instructor.course.title
    json.semester course_instructor.course.semester
    json.year course_instructor.course.year
    json.credits course_instructor.course.credits
  end
end

if @course_instructor != nil
  json.course do
    course_instructor_format json, @course_instructor
  end
end

if @course_instructors != nil
  json.courses @course_instructors do |each_course|
    course_instructor_format json, each_course
  end
end