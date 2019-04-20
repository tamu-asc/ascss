class Api::ApplicationController < ActionController::API
  def index
    @object = {name: params[:name]}
    render 'objects/application.json'
  end

  def not_found
    head :not_found
  end
end
