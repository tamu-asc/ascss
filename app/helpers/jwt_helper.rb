require 'jwt'

module JwtHelper
  def self.jwt_auth_token
    Rails.application.credentials.jwt_secret_key
  end

  def self.jwt_auth_algo
    "HS256"
  end

  def issue_token(payload)

    JWT.encode(
        payload,
        JwtHelper.jwt_auth_token,
        JwtHelper.jwt_auth_algo)
  end

  def decode(token)
    JWT.decode(token,
               JwtHelper.jwt_auth_token,
               true,
               { algorithm: JwtHelper.jwt_auth_algo }).first
  end
end