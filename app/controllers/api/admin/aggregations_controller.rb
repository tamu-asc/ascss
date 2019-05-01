require 'csv'

class Api::Admin::AggregationsController < Api::Admin::AuthController

  def aggregate_attendance
    aggregate_by = params[:aggregate_by]
    filters = {}
    params[:filters].each do |k,v|
      filters[k] = v
    end
    filters[:course] = params[:course_id]
    @course = Course.find_by_id(params[:course_id])

    aggregator = SessionAttendance.joins(:session).joins(:course_student)

    filters.map do |key, value|
      if key.to_s == "leader"
        course_instructor = CourseInstructor.find_by course: @course, username: value
        if course_instructor.nil?
          @msg = "Leader not found"
          render "objects/msg.json", status: :bad_request and return
        end
        aggregator = aggregator.where("sessions.course_instructor_id is %d"%course_instructor.id)
      elsif key.to_s == "course"
        aggregator = aggregator.where("course_students.course_id is %d"%@course.id)
      end
    end

    if aggregate_by.to_s == "session"
      aggregator = aggregator.group(:session_id)
    elsif aggregate_by.to_s == "student"
      aggregator = aggregator.group(:username)
    elsif aggregate_by.to_s == "leader"
      aggregator = aggregator.group(:course_instructor_id)
    end

    aggregations = aggregator.count
    headers = []
    body = []

    if aggregate_by.to_s == "session"
      headers = ["Session Name", "count"]
      aggregations.each do |k, v|
        session = Session.find_by_id(k.to_i)
        body = body + [[session.name, v]]
      end
    elsif aggregate_by.to_s == "student"
      headers = ["username", "count"]
      aggregations.each do |k, v|
        body = body + [[k, v]]
      end
    elsif aggregate_by.to_s == "leader"
      headers = ["Instructor Email", "count"]
      aggregations.each do |k, v|
        course_instructor = CourseInstructor.find_by_id(k.to_i)
        session = Session.find_by_id(k.to_i)
        body = body + [["%s"%[course_instructor.user.email, course_instructor.user.last_name], v]]
      end
    end

    accept = request.headers["Accept"]
    if accept == "text/csv"
      csv_data = CSV.generate(headers: true ) do |csv|
        csv << headers
        body.each do |row|
          csv << row
        end
      end
      filename = "%s_%s_%i.csv"%[@course.code,aggregate_by,Time.now.to_i]
      send_data csv_data, :type => 'text/csv; charset=utf-8; header=present', :filename => filename
    else
      @msg = [headers] + body
      render "objects/msg.json", status: :ok
    end
  end

  def aggregate_session
    aggregate_by = params[:aggregate_by]
    filters = {}
    params[:filters].each do |k,v|
      filters[k] = v
    end
    filters[:course] = params[:course_id]
    @course = Course.find_by_id(params[:course_id])

    aggregator = Session.joins(:course_instructor)

    filters.map do |key, value|
      if key.to_s == "leader"
        course_instructor = CourseInstructor.find_by course: @course, username: value
        if course_instructor.nil?
          @msg = "Leader not found"
          render "objects/msg.json", status: :bad_request and return
        end
        aggregator = aggregator.where(course_instructor: course_instructor)
      elsif key.to_s == "course"
        aggregator = aggregator.where("course_instructors.course_id is %d"%@course.id)
      end
    end

    if aggregate_by.to_s == "session"
      aggregator = aggregator.group(:id)
    elsif aggregate_by.to_s == "leader"
      aggregator = aggregator.group(:course_instructor_id)
    end

    aggregations = aggregator.count
    headers = []
    body = []

    if aggregate_by.to_s == "session"
      headers = ["Session Name", "count"]
      aggregations.each do |k, v|
        session = Session.find_by_id(k.to_i)
        body = body + [[session.name, v]]
      end
    elsif aggregate_by.to_s == "leader"
      headers = ["Instructor Email", "count"]
      aggregations.each do |k, v|
        course_instructor = CourseInstructor.find_by_id(k.to_i)
        session = Session.find_by_id(k.to_i)
        body = body + [["%s"%[course_instructor.user.email, course_instructor.user.last_name], v]]
      end
    end

    accept = request.headers["Accept"]
    if accept == "text/csv"
      csv_data = CSV.generate(headers: true ) do |csv|
        csv << headers
        body.each do |row|
          csv << row
        end
      end
      filename = "%s_%s_%i.csv"%[@course.code,aggregate_by,Time.now.to_i]
      send_data csv_data, :type => 'text/csv; charset=utf-8; header=present', :filename => filename
    else
      @msg = [headers] + body
      render "objects/msg.json", status: :ok
    end
  end
end