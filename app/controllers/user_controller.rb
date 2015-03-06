class UserController < ApplicationController
  def update_preferences
    @user = current_user

    new_options = params.select { |key, val| @user.preferences.keys.include? key }
    @user.preferences = @user.preferences.merge(new_options)
    @user.save

    render body: @user.preferences.inspect
  end
end
