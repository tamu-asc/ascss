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

  def create
    create_session
  end

  def update
    update_session
  end

  def delete
    delete_session
  end

  def end
    end_session
  end

end