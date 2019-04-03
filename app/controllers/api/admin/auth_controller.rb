class Api::Admin::AuthController < Api::ApplicationController
  include JwtHelper

  before_action :authenticate_admin

  def token
    request.headers["Authorization"].scan(/Bearer (.*)$/).flatten.last
  end

  # def auth_present?
  #   !!request.env.fetch("HTTP_AUTHORIZATION",
  #                       "").scan(/Bearer/).flatten.first
  # end
  #
  def authenticate_admin
    # unless auth_present?
    #
    # end
    begin
      jwt_token = token
      puts jwt_token
      payload = decode(jwt_token)
      user_id = payload["user"]
      @user = User.find(user_id)
      unless @user && @user.role.to_s == "admin"
        if params.has_key?(:redirect)
          redirect_to root_url
        else
          raise 'user not found or role not admin'
        end
      end
    rescue Exception => e
      @msg = "error authenticating token "
      @details = e.message
      render "objects/msg.json", status: :unauthorized
    end
  end

  def get_user
    render 'objects/user.json'
  end
end
