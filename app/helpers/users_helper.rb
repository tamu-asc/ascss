module UsersHelper
  def user_params
    params.require(:user).permit(:username, :role, :email, :first_name, :last_name, :password, :password_confirmation)
  end

  def user_params_update
    params.require(:user).permit(:role, :first_name, :last_name, :password, :password_confirmation)
  end
end