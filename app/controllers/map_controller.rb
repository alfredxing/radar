class MapController < ApplicationController
  def index
    curr = Weather.first.current
    @updated = curr["updated"]
    @temperature = curr["temperature"]
    @condition = curr["condition"]
    @wind = curr["wind"]
    @dewpoint = curr["dewpoint"]
    @pressure = curr["pressure"]
    @visibility = curr["visibility"]
    @humidity = curr["humidity"]

    @prefs = user_signed_in? ? current_user.preferences : User::DEFAULT_PREFS
  end
end
