class MapController < ApplicationController
  def index
    @prefs = user_signed_in? ? current_user.preferences : User::DEFAULT_PREFS
    @station = Weather.find_by code: @prefs["code"]
    curr = @station.current

    @updated = curr["updated"]
    @temperature = curr["temperature"]
    @condition = curr["condition"]
    @wind = curr["wind"]
    @dewpoint = curr["dewpoint"]
    @pressure = curr["pressure"]
    @visibility = curr["visibility"]
    @humidity = curr["humidity"]

    icon_code = curr["icon_code"]

    if @condition == ""
       @icon = "/images/blank64.png"
    else
       @icon = WeatherHelper::WEATHER_ICON_PATH + WeatherHelper::WEATHER_ICON_MAP[icon_code] + ".png"
    end
    
    @forecast = @station.forecast
  end
end
