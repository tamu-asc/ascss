def user_format(json, user)
  json.id user.id
  json.username user.username
  json.email user.email
  json.role user.role

  fname = ""
  unless user.first_name.blank?
    fname = user.first_name
  end
  lname = ""
  unless user.last_name.blank?
    lname = user.last_name
  end

  json.first_name fname
  json.last_name lname
end

def attendance_format(json, session_attendance)
  json.in_time session_attendance.in_time.to_i
end

def course_session_format(json, course_session)
  json.id course_session.id
  json.name course_session.name
  json.leader_id course_session.course_instructor.id
  json.start_time course_session.start_time.to_i
  json.end_time course_session.end_time.to_i
  json.state course_session.state
  json.address course_session.address
  json.leader do
    user_format json, course_session.course_instructor.user
  end
  json.attendance do
    if @session_attendance != nil
      attendance_format json, @session_attendance
    elsif !@session_attendance_map.nil? and !@session_attendance_map[course_session.id].nil?
      attendance_format json, @session_attendance_map[course_session.id]
    else
      nil
    end
  end
  json.description course_session.description
end

if @course_session != nil
  json.session do
    course_session_format json, @course_session
  end
end


if @course_sessions != nil
  json.sessions @course_sessions do |each_course_session|
    course_session_format json, each_course_session
  end

end