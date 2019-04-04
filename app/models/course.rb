class Course < ApplicationRecord
  enum semester: {spring: 0, summer: 1, fall: 2}
end
