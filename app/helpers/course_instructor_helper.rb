module CourseInstructorHelper

  def show_course_instructor
    @course_instructors = CourseInstructor.where user: @user
    if @course_instructors
      render "objects/course_instructor"
    else
      @msg = "Error in generating object"
      @details = "courses for the instructor not found"
      render "objects/msg", status: :bad_request and return
    end
  end
end