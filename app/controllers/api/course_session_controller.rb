class Api::CourseSessionController < Api::AuthController
  include CourseSessionHelper

  def show_all
    show_course_sessions
  end

  def show_by_instructor
    show_course_session_instructor
  end

  def show
    show_course_session
  end

  def create_session
    create
  end

  def update
    update
  end

  def delete
    delete
  end

  def end_session
    end_session
  end

end