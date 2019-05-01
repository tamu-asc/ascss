Rails.application.routes.draw do
  root :to => redirect('/index.html')
  namespace :api do
    namespace :admin do
      root :to => redirect('/swagger/dist/index.html?url=/apidocs/api-docs.json')
      match "/create" => "open#create_admin", via: :post
      match "/authenticate" => "open#create_token", via: :post
      match "/test" => "auth#get_user", via: :get
      match "/course" => "course#create", via: :post
      match "/courses" => "course#index", via: :get
      match "/course/:id" => "course#update", via: [:put, :patch]
      match "/course/:id" => "course#show", via: :get
      match "/course/:course/student" => "course_student#create", via: :post
      match "/course/:course/student_bulk" => "course_student#create_bulk", via: :post
      match "/course/:course/students" => "course_student#index", via: :get
      match "/course/:course/leader" => "course_instructor#create", via: :post
      match "/course/:course/leader_bulk" => "course_instructor#create_bulk", via: :post
      match "/course/:course/leaders" => "course_instructor#index", via: :get
      match "/course/:course_id/attendance_stats" => "aggregations#aggregate_attendance", via: :post
      match "/course/:course_id/session_stats" => "aggregations#aggregate_session", via: :post
    end

    root 'application#index'
    match "/" => "application#index", via: :post
    match "/signup" => "open#create_user", via: :post
    match "/login" => "open#create_session", via: :post
    match "/logout" => "sessions#destroy", via: [:post, :get]
    match "/user" => "users#show", via: :get
    match "/user" => "users#update", via: [:put, :patch]
    match "/course/:id" => "course#show", via: :get
    match "/leader/course/:course_id/sessions" => "course_session#show_by_instructor", via: :get
    match "/leader/course/:course_id/session" => "course_session#create", via: :post
    match "/leader/course/:course_id/session/:session_id" => "course_session#update", via: [:put, :patch]
    match "/leader/course/:course_id/session/:session_id" => "course_session#show", via: :get
    match "/leader/course/:course_id/session/:session_id" => "course_session#delete", via: :delete
    match "/leader/course/:course_id/session/:session_id/end_session" => "course_session#end", via: :post
    match "/leader/course/:course_id/session/:session_id/mark_attendance" => "course_session#mark_proxy_attendance", via: :post
    match "/student/courses" => "course_student#show", via: :get
    match "/student/course/:course_id/sessions" => "course_session#show_by_course", via: :get
    match "/student/course/:course_id/session/:session_id/mark_attendance" => "course_session#mark_attendance", via: :post
    match "/leader/courses" => "course_instructor#show", via: :get
  end

  match "*path" => "api/application#not_found", via: :get
# For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
