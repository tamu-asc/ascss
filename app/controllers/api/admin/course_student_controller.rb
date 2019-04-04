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
end