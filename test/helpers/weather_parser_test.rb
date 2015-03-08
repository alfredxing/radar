require 'test_helper'

class WeatherParserTest < ActionController::TestCase
  include WeatherHelper

  @@entry = nil

  setup do
    if @@entry.nil?
      file = open(in_base_dir("test/fixtures/weather_sample.xml"))
      @@entry = WeatherHelper.import(file)
    end
  end

  test "load file and create Weather object" do
    assert_not @@entry.nil?
  end

  test "read and store correct metadata" do
    assert_equal "yvr", @@entry.code
    assert_equal "Vancouver Int'l Airport", @@entry.name
  end

  test "read and store correct weather data" do
    expected = {
        "condition" => "Mainly Sunny",
        "temperature" => 7.8,
        "icon_code" => 01,
        "wind" => "11.0 km/h WSW",
        "dewpoint" => 6.3,
        "pressure" => 102.5,
        "visibility" => 48.3,
        "humidity" => 90,
        "updated" => DateTime.parse("20150308020300")
    }
    assert_equal expected, @@entry.current
  end
end
