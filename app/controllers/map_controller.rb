class MapController < ApplicationController
  def index
    @prefs = user_signed_in? ? current_user.preferences : User::DEFAULT_PREFS
    @w = Weather.find_by code: @prefs["code"]
    curr = @w.current

    @updated = curr["updated"]
    @temperature = curr["temperature"]
    @condition = curr["condition"]
    @wind = curr["wind"]
    @dewpoint = curr["dewpoint"]
    @pressure = curr["pressure"]
    @visibility = curr["visibility"]
    @humidity = curr["humidity"]
    @station = @w.name
  end
  end
