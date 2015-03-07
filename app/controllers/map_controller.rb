class MapController < ApplicationController
  def index
    curr = ActiveSupport::JSON.decode(Weather.first.current.to_json)
    @updated = curr["updated"]
    @temperature = curr["temperature"]
    @condition = curr["condition"]
    @wind = curr["wind"]
    @dewpoint = curr["dewpoint"]
    @pressure = curr["pressure"]
    @visibility = curr["visibility"] 
    @humidity = curr["humidity"] 
  end
end
