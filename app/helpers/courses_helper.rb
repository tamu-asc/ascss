module CoursesHelper
  def course_params
    params.require(:course).permit(:title, :semester, :year, :credits, :code, :active)
  end


  def show_course
    @course = Course.find_by_id(params[:id])
    if @course && (@user.role == "admin" || @course.active)
      render 'objects/course.json'
    else
      @msg = "Error in viewing course"
      @details = "Course not found"
      render "objects/msg.json", status: :bad_request
    end
  end
end