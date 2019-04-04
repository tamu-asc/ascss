class Api::Admin::CourseStudentController < Api::Admin::AuthController
  include CourseStudentHelper

  def create
    course = Course.find_by_id(params[:course][:course_id])
    if course == nil
      @msg = "Error in generating object"
      @details = "course not found"
      render "objects/msg.json", status: :bad_request and return
    end
    username = params[:course][:username]

    @course_student = create_entry course, username
    if @course_student
      render 'objects/course_student.json'
    else
      @msg = "Error in generating object"
      @details = "check logs"
      render "objects/msg.json", status: :bad_request
    end
  end

  def create_bulk
    course = Course.find_by_id(params[:course][:course_id])
    if course == nil
      @msg = "Error in generating object"
      @details = "course not found"
      render "objects/msg.json", status: :bad_request and return
    end
    @course_students = params[:course][:usernames].map do |username|
      create_entry course, username
    end
    if @course_students
      render 'objects/course_student.json'
    else
      @msg = "Error in generating object"
      @details = "check logs"
      render "objects/msg.json", status: :bad_request
    end
  end

  def index
    course = Course.find_by_id(params[:course])
    if course == nil
      @msg = "Error in generating object"
      @details = "course not found"
      render "objects/msg.json", status: :bad_request and return
    end

    @course_students = CourseStudent.where(course: course)

    @course_students.each do |each_elem| each_elem
      mask_entry each_elem, @user
    end

    accept = request.headers["Accept"]
    if accept == "text/csv"
      csv_data = CourseStudent.to_csv @course_students
      filename = course.code + "_" + Time.now.to_i.to_s + ".csv"
      send_data csv_data, :type => 'text/csv; charset=utf-8; header=present', :filename => filename
    else
      render 'objects/course_student.json'
    end
  end
end