class CreateSessions < ActiveRecord::Migration[5.2]
  def change
    create_table :sessions do |t|
      t.string :name
      t.references :course_instructor, foreign_key: true
      t.datetime :start_time
      t.datetime :end_time
      t.text :address
      t.text :description

      t.timestamps
    end
  end
end
