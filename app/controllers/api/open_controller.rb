# this controller is open, doesn't require the request to be authenticated

class Api::OpenController < Api::ApplicationController
  include UsersHelper

  # this method will be used for logging in
  def create_session
    req_params = params[:user]
    unless req_params
      @msg = "Login details not found"
      render "objects/msg.json", status: :unauthorized and return
    end
    @user = User.find_by_email(req_params[:email])
    if @user && @user.authenticate(req_params[:password])
      session[:user_id] = @user.id
      render 'objects/user.json'
    else
      @msg = "Email or password is invalid"
      render "objects/msg.json", status: :unauthorized
    end
  end

  # this method is used for signing up
  def create_user
    @user = User.new(user_params)
    @user.role = :user
    if @user.save
      render 'objects/user.json'
    else
      @msg = "Error in generating user"
      @details = @user.errors
      render "objects/msg.json", status: :bad_request
    end
  end


end