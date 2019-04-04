class Api::CourseStudentController < Api::AuthController
  include CourseStudentHelper

  def show
    show_course_student
  end
end