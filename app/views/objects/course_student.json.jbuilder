def course_student_format(json, course_student)
  json.id course_student.id
  json.course_id course_student.course.id
  json.username course_student.username

  user_id = nil
  unless course_student.user.blank?
    user_id = course_student.user.id
  end

  json.user_id user_id
end

if @course_student != nil
  json.course do
    course_student_format json, @course_student
  end
end

if @course_students != nil
  json.courses @course_students do |each_course|
    course_student_format json, each_course
  end
end