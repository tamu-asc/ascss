class Api::Admin::OpenController < Api::ApplicationController
  include UsersHelper
  include JwtHelper

  def create_token
    @user = User.find_by_email(params[:email])
    if @user && @user.authenticate(params[:password]) && @user.role.to_s == "admin"
      @token = issue_token({user: @user.id, issued: Time.now.to_i})
      render json: {token: @token}
    else
      @msg = "Email or password is invalid"
      render "objects/msg.json", status: :unauthorized
    end
  end

  def create_admin
    @user = User.find_by_role(:admin)
    if @user
      @msg = "Error admin user already exists"
      @details = @user.email
      render "objects/msg.json", status: :bad_request and return
    end

    @user = User.new(user_params)
    @user.role = :admin
    if @user.save
      render 'objects/user.json'
    else
      @msg = "Error in generating user"
      @details = @user.errors
      render "objects/msg.json", status: :bad_request
    end
  end

end
