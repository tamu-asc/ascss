class Api::UsersController < Api::AuthController
  include UsersHelper

  def show
    render 'objects/user.json'
  end

  def update
    begin
      @user.update_attributes!(user_params)
      render 'objects/user.json'
    rescue StandardError => e
      @msg = "Email or password is invalid"
      render "objects/msg.json", status: :bad_request
    end
  end

end
