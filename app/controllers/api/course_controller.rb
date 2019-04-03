class Api::CourseController < Api::AuthController
  include CoursesHelper

  def show
    show_course
  end
end