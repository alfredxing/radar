class Weather < ActiveRecord::Base
  serialize :current
  serialize :location
  serialize :forecast
end
