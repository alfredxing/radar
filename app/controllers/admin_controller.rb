require 'open-uri'

class AdminController < ApplicationController
  http_basic_authenticate_with name: "supersecretadminname", password: "supersecretadminpassword"

  def panel
  end

  def update_radar
    # Download raw radar files
    radar_data_file = in_base_dir("public/data/radar.nws")
    radar_download_path = "ftp://tgftp.nws.noaa.gov/SL.us008001/DF.of/DC.radar/DS.p19r0/SI.katx/sn.last"
    `curl #{radar_download_path} --create-dirs -o #{radar_data_file}`

    # Compile parser
    build_path = in_base_dir("bin/radar-parser")
    parser_src = File.join(build_path, "src/Parser.java")
    class_path = [
      File.join(build_path, "lib/gson-2.3.1.jar"),
      File.join(build_path, "lib/toolsUI-4.5.jar"),
      File.join(build_path, "src")
    ].join(":")
    `javac -cp #{class_path} #{parser_src}`

    # Run parser
    radar_json = `java -cp #{class_path} Parser #{radar_data_file}`
    radar_json_file = in_base_dir("/public/data/radar.json")
    File.write(radar_json_file, radar_json)

    render json: true
  end

  def update_weather
    file = open("http://dd.weatheroffice.ec.gc.ca/citypage_weather/xml/BC/s0000141_e.xml")
    entry = WeatherHelper.import(file)

    render json: true
  end

  private
    def in_base_dir(relative_path)
      return File.join(File.expand_path("../../", File.dirname(__FILE__)), relative_path)
    end
end
