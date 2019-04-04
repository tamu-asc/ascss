Rails.application.routes.draw do
  root :to => redirect('/index.html')
  namespace :api do
    namespace :admin do
      match "/create" => "open#create_admin", via: :post
      match "/authenticate" => "open#create_token", via: :post
      match "/test" => "auth#get_user", via: :get
      match "/course" => "course#create", via: :post
      match "/course/:id" => "course#update", via: [:put, :patch]
      match "/course/:id" => "course#show", via: :get
      match "/enroll/student" => "course_student#create", via: :post
      match "/enroll/student_bulk" => "course_student#create_bulk", via: :post
    end

    root 'application#index'
    match "/" => "application#index", via: :post
    match "/signup" => "open#create_user", via: :post
    match "/login" => "open#create_session", via: :post
    match "/logout" => "sessions#destroy", via: [:post, :get]
    match "/user" => "users#show", via: :get
    match "/user" => "users#update", via: [:put, :patch]
    match "/course/:id" => "course#show", via: :get
  end
# For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
