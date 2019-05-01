module CourseSessionHelper
  SECONDS_IN_WEEK = 60*60*24*7

  def course_session_params(offset_week=0)
    out_params = params.require(:session).permit(:name, :start_time, :end_time, :address, :description)
    refTime = Time.at(out_params[:start_time])
    out_params[:start_time] = Time.at(out_params[:start_time] + (offset_week*SECONDS_IN_WEEK))
    out_params[:end_time] = Time.at(out_params[:end_time] + (offset_week*SECONDS_IN_WEEK))
    if out_params[:start_time].dst? && !refTime.dst?
      out_params[:start_time] = out_params[:start_time] - 3600
      out_params[:end_time] = out_params[:end_time] - 3600
    elsif !out_params[:start_time].dst? && refTime.dst?
      out_params[:start_time] = out_params[:start_time] + 3600
      out_params[:end_time] = out_params[:end_time] + 3600
    end
    out_params
  end

  def show_course_sessions
    @course_sessions = Session.where(course_id: params[:course_id]).order(:start_time)
    if @course_sessions
      render "objects/instructor_course_session.json"
    else
      @msg = "Error in generating object"
      @details = "sessions for the course are not found"
      render "objects/msg.json", status: :bad_request and return
    end

  end

  def show_course_session_instructor
    course_instructor = CourseInstructor.find_by(course_id: params[:course_id], user: @user)
    if course_instructor.nil?
      @msg = "Error in finding instructor details"
      @details = "no records found for the user as instructor for the specified course. check course_id and user_id"
      render("objects/msg.json", status: :bad_request) && return
    end
    @course_sessions = Session.where(course_id: params[:course_id], course_instructor: course_instructor).order(:start_time)
    if @course_sessions
      render "objects/instructor_course_session.json"
    else
      @msg = "Error in generating object"
      @details = "no sessions for the instructor under this course are found"
      render "objects/msg.json", status: :bad_request and return
    end

  end

  def show_course_session_student
    @course_student = CourseStudent.find_by(course_id: params[:course_id], user:@user)
    if @course_student.nil?
      @msg = "Error in fetching student details"
      @details = "no records found for the user as student for the specified course. check course_id and user_id"
      render("objects/msg.json", status: :bad_request) && return
    end
    @course_sessions = Session.where(course_id: params[:course_id]).order(:start_time)
    @session_attendance_map = {}
    if @course_sessions
      @course_sessions.each {|session|
        if @session_attendance_map.key? session.id
          continue

        end
        # course_instructor = CourseInstructor.find_by(id: session.course_instructor_id)
        # session.leader = course_instructor
        attendance = SessionAttendance.find_by(session: session, course_student: @course_student)
        @session_attendance_map[session.id] = attendance
      }
      render 'objects/student_course_session'
    else
      @msg = "Error in fetching sessions for the course"
      @details = "sessions for the course are not found please verify the course_id entered"
      render("objects/msg.json", status: :bad_request) && return
    end
  end

  def mark_attendance_utils (course_session, course_student, silent=true )
    if course_student == nil
      if silent
        nil
      else
        raise 'Course student invalid'
      end
      return
    end

    session_attendance = SessionAttendance.find_by(session: course_session, course_student: course_student)
    if !session_attendance.nil?
      if silent
        session_attendance
      else
        raise 'Already present'
      end
      return
    end

    session_attendance = SessionAttendance.new
    session_attendance.session = course_session
    session_attendance.in_time = Time.now
    session_attendance.course_student = course_student

    if session_attendance.save!
      session_attendance
    elsif silent
      nil
    else
      raise 'Unable to save attendance'
    end
  end

  def mark_attendance_instructor
    @course_session = Session.find_by(course_id: params[:course_id], id: params[:session_id])
    @course_instructor = CourseInstructor.find_by(course_id: params[:course_id], user:@user)

    if @course_session.course_instructor.id != @course_instructor.id
      @msg = "Attempt to mark attendance for session not owned"
      render 'objects/msg', status: :forbidden and return
    end

    usernames = params[:usernames]
    if usernames.nil?
      usernames = [params[:username]]
    end

    attendance = usernames.map do |username|
      course_student = CourseStudent.find_by(course_id: params[:course_id], username: username)
      mark_attendance_utils @course_session, course_student
    end

    @msg = "Attendance marked for valid students"
    render 'objects/msg', status: :ok and return
  end

  def mark_attendance_student
    @course_session = Session.find_by(course_id: params[:course_id], id: params[:session_id])
    if @course_session.nil
      @msg = "No session matching the discription found for the course"
      render('objects/msg', status: :bad_request) && return
    end
    @course_student = CourseStudent.find_by(course_id: params[:course_id], user:@user)
    begin
      @session_attendance = mark_attendance_utils(@course_session, @course_student, false)
      render 'objects/student_course_session'
    rescue Exception => e
      @msg = "Attendance mark exception"
      @details = e.message
      render 'objects/msg', status: :bad_request and return
    end
  end

  def show_course_session
    @course_session = Session.find(params[:session_id])
    if !@course_session.nil?
      render 'objects/instructor_course_session.json'
    else
      @msg = "Error in fetching the specified session. verify the session_id entered."
      @details = @course_session.errors
      render "objects/msg.json", status: :bad_request
    end

  end

  def create_session
    unless Session.new(course_session_params).state == 'future'
      @msg = "Cannot create past sesions check time entry"
      @details = @course_session.errors
      render "objects/msg.json", status: :bad_request and return
    end

    repeat_count = params[:repeatcount].to_i
    if repeat_count == 0
      repeat_count = 1
    end

    batch = Time.now.to_i.to_s

    course_instructor = CourseInstructor.find_by(course_id: params[:course_id], user: @user)
    course = Course.find_by(id: params[:course_id])

    course_sessions = (0..repeat_count-1).to_a.map { |iter|
      course_session = Session.new(course_session_params(iter))
      course_session.course_instructor = course_instructor
      course_session.course = course
      course_session.batch = batch
      if course_session.save
        course_session
      else
        nil
      end

      course_session
    }

    if repeat_count == 1
      @course_session = course_sessions.at(0)
    else
      @course_sessions = course_sessions
    end

    render 'objects/instructor_course_session.json'
  end

  def update_session
    course_session_new = Session.new(course_session_params)
    @course_session = Session.find(params[:session_id])
    if @course_session.state == "future" && course_session_new.state == "future"
      begin
      @course_session.update_attributes!(course_session_params)
      render 'objects/instructor_course_session.json'
      rescue StandardError => e
        @msg = "Error updating sessions"
        @details = e.message
        render "objects/msg.json", status: :bad_request
      end
      # @course_session.start_time = course_session_new.start_time
      # @course_session.end_time = course_session_new.end_time
    else
      @msg = "Check the times you have entered"
      render "objects/msg.json", status: :bad_request and return
    end
    # if @course_session.save
    #   @msg = "session succesfult saved to db."
    #   render 'objects/instructor_course_session.json'
    # else
    #   @msg = "Error in updating course"
    #   @details = @course_session.errors
    #   render "objects/msg.json", status: :bad_request
    # end
  end

  def delete_session
    found_session = Session.find(params[:session_id])
    if found_session == nil
      @msg = "Error in deleting session"
      render "objects/msg.json", status: :bad_request
    else
      found_session.destroy
      @msg = "Acknowledged"
      render "objects/msg.json"
    end
  end

  def end_session
    @course_session = Session.find(params[:session_id])# need to check
    if @course_session == nil || @course_session.state != "active"
      @msg = "Error in ending session, not present"
      render "objects/msg.json", status: :bad_request and return
    end
    @course_session.end_time = Time.now
    if @course_session.save
      render 'objects/instructor_course_session.json'
    else
      @msg = "Error in generating course"
      @details = @course_session.errors
      render "objects/msg.json", status: :bad_request
    end
  end
end
