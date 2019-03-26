class SessionAttendance < ApplicationRecord
  belongs_to :session
  belongs_to :student_course
end
