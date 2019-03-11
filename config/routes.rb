Rails.application.routes.draw do
  root :to => redirect('/index.html')
  namespace :api do
    root 'application#index'
    match "/" => "application#index", via: :post
    match "/signup" => "open#create_user", via: :post
    match "/login" => "open#create_session", via: :post
    match "/logout" => "sessions#destroy", via: [:post, :get]
    match "/user" => "users#show", via: :get
  end
# For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
