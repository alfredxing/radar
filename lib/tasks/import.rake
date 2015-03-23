require 'net/http'
require 'open-uri'

BASE_DIR = File.expand_path("../../", File.dirname(__FILE__))
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
RADAR_DOWNLOAD_PATH = "ftp://tgftp.nws.noaa.gov/SL.us008001/DF.of/DC.radar/DS.p19r0/SI.katx/sn.last"

def in_base_dir(relative_path)
  return File.join(BASE_DIR, relative_path)
end

namespace :data do
  task :import => :environment do
    radar_data_file = in_base_dir("public/data/radar.nws")
    `curl #{RADAR_DOWNLOAD_PATH} --create-dirs -o #{radar_data_file}`

    # Compile parser
    build_path = in_base_dir("bin/radar-parser")
    parser_src = File.join(build_path, "src/Parser.java")
    compiled_path = File.join(build_path, "src/Parser.class")
    class_path = [
      File.join(build_path, "lib/gson-2.3.1.jar"),
      File.join(build_path, "lib/toolsUI-4.5.jar"),
      File.join(build_path, "src")
    ].join(":")
    `javac -cp #{class_path} #{parser_src}` unless File.exist? compiled_path

    # Run parser
    radar_json = `java -cp #{class_path} Parser #{radar_data_file}`
    radar_json_file = in_base_dir("/public/data/radar.json")
    File.write(radar_json_file, radar_json)

    # Download weather XML
    WEATHER_STATIONS.each { |station|
      file = open("#{WEATHER_BASE_PATH}#{station}_e.xml")
      puts WeatherHelper.import(station, file).inspect
    }
  end
end
