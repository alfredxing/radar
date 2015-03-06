require 'nokogiri'
require 'open-uri'

class WeatherController < ApplicationController
  def update
    doc = Nokogiri::XML(open("http://dd.weatheroffice.ec.gc.ca/citypage_weather/xml/BC/s0000141_e.xml"))

    @station_code = doc.xpath("//currentConditions//station").attr("code").text
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
    @updated = DateTime.parse(doc.xpath("//currentConditions//dateTime[@zone='PST']//timeStamp/text()").text)

    entry = Weather.first || Weather.new

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

    entry.save

    render body: entry.inspect
  end
end
