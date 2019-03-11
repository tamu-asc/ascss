class Api::SessionsController < Api::AuthController
  def destroy
    session[:user_id] = nil
    if params.has_key?(:redirect)
      redirect_to root_url
    else
      @msg = "Logged Out!"
      render "objects/msg.json", status: :ok
    end

  end
end
