def user_format(json, user)
  json.id user.id
  json.username user.username
  json.email user.email
  json.role user.role

  fname = ""
  unless user.first_name.blank?
    fname = user.first_name
  end
  lname = ""
  unless user.last_name.blank?
    lname = user.last_name
  end

  json.first_name fname
  json.last_name lname
end

if @user != nil
  json.user do
    user_format json, @user
  end
end

if @users != nil
  json.users @users do |each_user|
    user_format json, each_user
  end
end