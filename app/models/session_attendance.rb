class SessionAttendance < ApplicationRecord
  belongs_to :session
  belongs_to :course_student
end
