module CourseStudentHelper

  def show_course_student
    @course_students = CourseStudent.joins(:course)
    @course_students = @course_students.where user: @user
    @course_students = @course_students.where "courses.active = true"
    if @course_students
      render "objects/course_student"
    else
      @msg = "Error in generating object"
      @details = "courses for the user not found"
      render "objects/msg.json", status: :bad_request and return
    end

  end

  def create_entry(course, username)
    course_student = CourseStudent.find_by course: course, username: username
    if course_student
      return course_student
    end

    course_student = CourseStudent.new
    student = User.find_by_username(username)
    course_student.course = course
    course_student.username = username
    if student
      course_student.user = student
    else
      course_student.user = @user
    end

    if course_student.save
      course_student
    else
      nil
    end

  end

  def correct_cs_entries(user)
    records = CourseStudent.where username: user.username
    records.each do |record|
      record.user = user
      record.save
    end
  end

  def mask_entry(course_student, user)
    if course_student.user == user
      course_student.user = nil
    end
  end
end