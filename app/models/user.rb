class User < ApplicationRecord
  has_secure_password

  enum role: [:admin, :user]
  validates :username, presence: true, uniqueness: true
  validates_presence_of :password, :on => :create
  validates :email, format: { with: URI::MailTo::EMAIL_REGEXP }


end
