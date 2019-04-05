class Api::Admin::CourseInstructorController < Api::Admin::AuthController
  include CourseInstructorHelper

  def create
    course = Course.find_by_id(params[:course])
    if course == nil
      @msg = "Error in generating object"
      @details = "course not found"
      render "objects/msg.json", status: :bad_request and return
    end
    username = params[:user][:username]

    @course_instructor = create_entry course, username
    if @course_instructor
      render 'objects/course_instructor.json'
    else
      @msg = "Error in generating object"
      @details = "check logs"
      render "objects/msg.json", status: :bad_request
    end
  end

  def create_bulk
    course = Course.find_by_id(params[:course])
    if course == nil
      @msg = "Error in generating object"
      @details = "course not found"
      render "objects/msg.json", status: :bad_request and return
    end
    @course_instructors = params[:users].map do |user|
      create_entry course, user[:usernames]
    end
    if @course_instructors
      render 'objects/course_instructor.json'
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

    @course_instructors = CourseInstructor.where(course: course)

    @course_instructors.each do |each_elem| each_elem
    mask_entry each_elem, @user
    end

    accept = request.headers["Accept"]
    if accept == "text/csv"
      csv_data = CourseInstructor.to_csv @course_instructors
      filename = course.code + "_" + Time.now.to_i.to_s + ".csv"
      send_data csv_data, :type => 'text/csv; charset=utf-8; header=present', :filename => filename
    else
      @raw = true
      render 'objects/course_instructor.json'
    end
  end
end