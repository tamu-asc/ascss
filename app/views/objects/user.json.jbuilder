json.id @user.id
json.username @user.username
json.email @user.email
json.role @user.role

fname = ""
unless @user.first_name.blank?
  fname = @user.first_name
end
lname = ""
unless @user.last_name.blank?
  lname = @user.last_name
end

json.first_name fname
json.last_name lname
