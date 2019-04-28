def course_session_format(json, course_session)
  json.id course_session.id
  json.name course_session.name
  json.leader_id course_session.course_instructor.id
  json.start_time course_session.start_time.to_i
  json.end_time course_session.end_time.to_i
  json.state course_session.state
  json.address course_session.address
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