require 'csv'

class CourseStudent < ApplicationRecord
  belongs_to :user
  belongs_to :course


  def self.to_csv(course_students)
    CSV.generate(headers: true ) do |csv|
      csv << CourseStudent.attribute_names
      course_students.each do |each_elem|
        csv << each_elem.attributes.values
      end
    end
  end

end
