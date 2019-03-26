class CreateCourses < ActiveRecord::Migration[5.2]
  def change
    create_table :courses do |t|
      t.string :title
      t.integer :semester
      t.integer :year
      t.integer :credits
      t.string :code

      t.timestamps
    end
  end
end
