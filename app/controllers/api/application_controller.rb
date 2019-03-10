class Api::ApplicationController < ActionController::API
  def index
    @object = {name: params[:name]}
    render 'objects/application.json'
  end
end
