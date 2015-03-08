require 'nokogiri'
require 'open-uri'

class WeatherController < ApplicationController
  def get
    render json: Weather.first
  end

  def update
    file = open("http://dd.weatheroffice.ec.gc.ca/citypage_weather/xml/BC/s0000141_e.xml")
    entry = Weather.import(file)

    render body: entry.inspect
  end
end
