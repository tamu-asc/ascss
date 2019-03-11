class Api::UsersController < Api::AuthController
  def show
    render 'objects/user.json'
  end

end
