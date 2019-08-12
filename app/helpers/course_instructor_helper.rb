module CourseInstructorHelper

  def show_course_instructor
    @course_instructors = CourseInstructor.joins(:course)
    @course_instructors = @course_instructors.where(user: @user)
    @course_instructors = @course_instructors.where("courses.active = true")
    if @course_instructors
      render "objects/course_instructor"
    else
      @msg = "Error in generating object"
      @details = "courses for the instructor not found"
      render "objects/msg", status: :bad_request and return
    end
  end

  def create_entry(course, username)
    course_instructor = CourseInstructor.find_by course: course, username: username
    if course_instructor
      return course_instructor
    end

    course_instructor = CourseInstructor.new
    instructor = User.find_by_username(username)
    course_instructor.course = course
    course_instructor.username = username
    if instructor
      course_instructor.user = instructor
    else
      course_instructor.user = @user
    end

    if course_instructor.save
      course_instructor
    else
      nil
    end

  end

  def correct_ci_entries(user)
    records = CourseInstructor.where username: user.username
    records.each do |record|
      record.user = user
      record.save
    end
  end

  def mask_entry(course_instructor, user)
    if course_instructor.user == user
      course_instructor.user = nil
    end
  end
end