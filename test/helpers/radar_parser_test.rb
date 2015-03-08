require 'test_helper'
require 'open3'

class RadarParserTest < ActionController::TestCase
  @@data = nil

  setup do
    if @@data.nil?
      # Code shared with Rake task
      radar_data_file = in_base_dir("test/fixtures/radar_sample.nws")

      # Compile parser
      build_path = in_base_dir("bin/radar-parser")
      parser_src = File.join(build_path, "src/Parser.java")
      compiled_path = File.join(build_path, "src/Parser.class")
      class_path = [
        File.join(build_path, "lib/gson-2.3.1.jar"),
        File.join(build_path, "lib/toolsUI-4.5.jar"),
        File.join(build_path, "src")
      ].join(":")
      Open3.capture2("javac -cp #{class_path} #{parser_src}") unless File.exist? compiled_path

      # Run parser
      json, err = Open3.capture3("java -cp #{class_path} Parser #{radar_data_file}")
      @@data = JSON.parse(json)
    end
  end

  test "load and parse binary file without errors" do
    assert_not @@data.nil?
  end

  test "read the correct station metadata" do
    assert_equal "ATX", @@data["stationID"]
    assert_equal 48.195, @@data["lat"]
    assert_equal -122.496, @@data["lon"]
  end

  test "read the correct radar metadata" do
    assert_equal 360, @@data["nrays"]
    assert_equal 230, @@data["ngates"]
    assert_equal 999, @@data["gateSize"]
  end

  test "read the correct timestamp" do
    assert_equal 1.42578496E12, @@data["time"]
  end

  test "read the correct number of rays and gates" do
    assert_equal 360, @@data["rays"].length
    assert_equal 230, @@data["rays"][0]["gates"].length
  end

  test "read the correct azimuth for a ray" do
    assert_equal 164, @@data["rays"][0]["azimuth"]
  end
end
