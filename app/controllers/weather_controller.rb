require 'nokogiri'
require 'open-uri'

class WeatherController < ApplicationController
  def all
    render json: Weather.all
  end

  def get
    station = Weather.find_by code: params[:station]
    render json: station
  end

  def update
    file = open("http://dd.weatheroffice.ec.gc.ca/citypage_weather/xml/BC/s0000141_e.xml")
    entry = WeatherHelper.import(file)

    render body: entry.inspect
  end
end
