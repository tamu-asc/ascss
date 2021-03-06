class User < ApplicationRecord
  has_secure_password

  enum role: {admin: 0, user: 1}
  validates :username, presence: true, uniqueness: true
  validates_presence_of :password, :on => :create
  validates :email, format: { with: URI::MailTo::EMAIL_REGEXP }, presence: true, uniqueness: true


end
