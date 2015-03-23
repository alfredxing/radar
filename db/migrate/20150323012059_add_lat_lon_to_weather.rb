class AddLatLonToWeather < ActiveRecord::Migration
  def change
    change_table :weathers do |t|
      t.string :location
    end
  end
end
