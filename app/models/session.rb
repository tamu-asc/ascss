class Session < ApplicationRecord
  belongs_to :course_instructor
  belongs_to :course
end
