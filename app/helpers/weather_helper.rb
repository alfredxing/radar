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

    entry.save
    return entry
  end
  end
