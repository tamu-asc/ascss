Rails.application.routes.draw do
  root :to => redirect('/index.html')
  namespace :api do
    namespace :admin do
      root :to => redirect('/swagger/dist/index.html?url=/apidocs/api-docs.json')
      match "/create" => "open#create_admin", via: :post
      match "/authenticate" => "open#create_token", via: :post
      match "/test" => "auth#get_user", via: :get
      match "/course" => "course#create", via: :post
      match "/course" => "course#index", via: :get
      match "/course/:id" => "course#update", via: [:put, :patch]
      match "/course/:id" => "course#show", via: :get
      match "/course/student" => "course_student#create", via: :post
      match "/course/student_bulk" => "course_student#create_bulk", via: :post
      match "/course/student/:course" => "course_student#index", via: :get
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
