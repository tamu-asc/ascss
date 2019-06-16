class Api::Admin::AuthController < Api::AuthController
  include JwtHelper

  before_action :authenticate_admin

  def token
    begin
    request.headers["Authorization"].scan(/Bearer (.*)$/).flatten.last
    rescue Exception => e
      nil
    end
  end

  # def auth_present?
  #   !!request.env.fetch("HTTP_AUTHORIZATION",
  #                       "").scan(/Bearer/).flatten.first
  # end
  #
  def authenticate_admin
    unless @user && @user.role.to_s == "admin"
      begin
        jwt_token = token
        puts jwt_token
        payload = decode(jwt_token)

        issued_time = payload["issued"]
        # todo: remove this comment
        if issued_time == nil# || Time.now.to_i - issued_time >= 600
          @msg = "error authenticating token "
          @details = "Token expired, please issue a new one"
          render "objects/msg.json", status: :unauthorized and return
        end
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
  end

  def get_user
    render 'objects/user.json'
  end
end
