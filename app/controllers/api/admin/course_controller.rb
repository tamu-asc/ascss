class Api::Admin::CourseController < Api::Admin::AuthController
  include CoursesHelper

  def index
    inactive = params[:inactive].to_i
    if inactive == 1 # only active courses
      @courses = Course.where active: false
    elsif inactive == 2
      @courses = Course.where active: true
    else
      @courses = Course.all
    end
    render 'objects/course.json'
  end

  def create
    @course = Course.new(course_params)
    if @course.save
      render 'objects/course.json'
    else
      @msg = "Error in generating course"
      @details = @course.errors
      render "objects/msg.json", status: :bad_request
    end
  end

  def update
    @course = Course.find(params[:id])
    if @course == nil
      @msg = "Error editing course"
      @details = "Course not found"
      render "objects/msg.json", status: :bad_request and return
    end

    begin
      @course.update_attributes!(course_params)
      render 'objects/course.json'
    rescue StandardError => e
      @msg = "Error editing course"
      @details = e.message
      render "objects/msg.json", status: :bad_request
    end

  end

  def show
    show_course
  end

end