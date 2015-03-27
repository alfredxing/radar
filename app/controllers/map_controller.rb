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


    if @prefs["code"]=="s0000758"
        @station = "abbotsford"
    end
    if @prefs["code"]=="s0000398"
      @station = "Aggasiz"
    end
    if @prefs["code"]=="s0000323"
      @station = "Squamish"
    end
    if @prefs["code"]=="s0000775"
      @station = "Victoria"
    end
    if @prefs["code"]=="s0000373"
      @station = "White Rock"
    end
    if @prefs["code"]=="s0000496"
      @station = "Nanaimo"
    end
    if @prefs["code"]=="s0000078"
      @station = "Whistler"
    end
    if @prefs["code"]=="s0000141"
      @station = "Vancouver"
    end

end
