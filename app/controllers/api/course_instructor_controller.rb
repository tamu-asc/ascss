class Api::CourseInstructorController < Api::AuthController
  include CourseInstructorHelper

  def show
    show_course_instructor
  end
end