class AddNewFieldsToSession < ActiveRecord::Migration[5.2]
  def change
    add_reference :sessions, :course, foreign_key: true
  end
end
