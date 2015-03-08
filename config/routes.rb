Rails.application.routes.draw do
  # Admin panel
  get 'admin/panel'
  post 'admin/update/radar' => 'admin#update_radar'

  # Weather
  get 'weather/update'
  get 'weather' => 'weather#get'

  # Devise
  devise_for :users

  # User preferences
  patch 'user/preferences' => 'user#update_preferences'

  # Set root to map
  root 'map#index'
end
