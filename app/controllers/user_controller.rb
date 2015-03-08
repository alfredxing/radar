class UserController < ApplicationController
  def update_preferences
    raise "Not logged in!" unless user_signed_in?

    @user = current_user

    new_options = params.select { |key, val| @user.preferences.keys.include? key }
    @user.preferences = @user.preferences.merge(new_options)
    @user.save

    render body: @user.preferences.inspect
  end

  def preferences
    prefs = User::DEFAULT_PREFS

    if user_signed_in?
      @user = current_user
      prefs = @user.preferences
    end

    render json: prefs
  end
end
