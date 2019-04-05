require 'csv'

class CourseInstructor < ApplicationRecord
  belongs_to :user
  belongs_to :course

  def self.to_csv(course_instructors)
    CSV.generate(headers: true ) do |csv|
      csv << CourseInstructor.attribute_names
      course_instructors.each do |each_elem|
        csv << each_elem.attributes.values
      end
    end
  end
end
