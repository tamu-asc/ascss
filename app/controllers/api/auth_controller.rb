class Api::AuthController < Api::ApplicationController
  before_action :authenticate_session

  private

  def authenticate_session
    session[:user_id]
    @user = User.find_by_id(session[:user_id])
    unless @user
      if params.has_key?(:redirect)
        redirect_to root_url
      else
        @msg = "error authenticating"
        @details = session[:user_id]
        render "objects/msg.json", status: :unauthorized
      end
    end
  end


end