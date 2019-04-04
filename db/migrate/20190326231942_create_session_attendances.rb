class CreateSessionAttendances < ActiveRecord::Migration[5.2]
  def change
    create_table :session_attendances do |t|
      t.references :session, foreign_key: true
      t.references :course_student, foreign_key: true
      t.datetime :in_time

      t.timestamps
    end
  end
end
