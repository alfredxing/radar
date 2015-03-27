module WeatherHelper
  WEATHER_BASE_PATH = "http://dd.weatheroffice.ec.gc.ca/citypage_weather/xml/BC/"
  WEATHER_STATIONS = [
    "s0000078",
    "s0000323",
    "s0000775",
    "s0000373",
    "s0000496",
    "s0000758",
    "s0000398",
    "s0000141"
  ]

  WEATHER_ICON_PATH = "//ssl.gstatic.com/onebox/weather/128/"
  WEATHER_ICON_MAP = {
    0 => "sunny",
    1 => "partly_cloudy",
    2 => "partly_cloudy",
    3 => "partly_cloudy",
    6 => "rain_light",
    7 => "sleet",
    8 => "snow_light",
    10 => "cloudy",
    11 => "rain",
    12 => "rain",
    13 => "rain_heavy",
    14 => "snow_light",
    15 => "sleet",
    16 => "snow",
    17 => "snow",
    18 => "snow_heavy",
    19 => "thunderstorms",
    23 => "fog",
    24 => "fog",
    25 => "snow",
    26 => "snow_light",
    27 => "snow_light",
    28 => "rain_light",
    30 => "sunny",
    31 => "partly_cloudy",
    32 => "partly_cloudy",
    33 => "partly_cloudy",
    36 => "rain_light",
    37 => "sleet",
    38 => "snow_light",
    39 => "thunderstorms",
    40 => "snow",
    41 => "windy",
    42 => "windy",
    44 => "fog",
    45 => "windy",
    46 => "thunderstorms",
    47 => "thunderstorms",
    48 => "windy"
  }

  def self.import(station, file)
    doc = Nokogiri::XML(file)

    @station_code = doc.xpath("//location//name").attr("code").text
    @station_name = doc.xpath("//currentConditions//station").text

    @condition = doc.xpath("//currentConditions//condition/text()").text
    @temperature = doc.xpath("//currentConditions//temperature/text()").text.to_f
    @icon_code = doc.xpath("//currentConditions//iconCode/text()").text.to_i

    s = doc.xpath("//currentConditions//wind//speed//text()").text.to_f
    di = doc.xpath("//currentConditions//wind//direction/text()").text
    @wind = "#{s} km/h #{di}"

    @dewpoint = doc.xpath("//currentConditions//dewpoint/text()").text.to_f
    @pressure = doc.xpath("//currentConditions//pressure/text()").text.to_f
    @visibility = doc.xpath("//currentConditions//visibility/text()").text.to_f
    @humidity = doc.xpath("//currentConditions//relativeHumidity/text()").text.to_f
    @updated = DateTime.parse(doc.xpath("//dateTime[@zone='UTC']//timeStamp/text()").first.text)

    # Assumptions: latitude is always positive and longitude is always negative
    @lat = doc.xpath("//currentConditions//station").attr("lat").text.to_f
    @lon = -1 * doc.xpath("//currentConditions//station").attr("lon").text.to_f

    @forecast = doc.xpath("//forecastGroup/forecast").map { |e|
      {
        "name": e.xpath(".//period").attr("textForecastName").text,
        "forecast": e.xpath(".//textSummary/text()").first.text
      }
    }

    entry = (Weather.find_by code: station) || Weather.new

    entry.code = @station_code
    entry.name = @station_name
    entry.current = {
      "condition" => @condition,
      "temperature" => @temperature,
      "icon_code" => @icon_code,
      "wind" => @wind, # "12 km/h WSW"
      "dewpoint" => @dewpoint,
      "pressure" => @pressure,
      "visibility" => @visibility,
      "humidity" => @humidity,
      "updated" => @updated
    }
    entry.location = {
      "lat" => @lat,
      "lon" => @lon
    }
    entry.forecast = @forecast

    entry.save
    return entry
  end
end
