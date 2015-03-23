class Weather < ActiveRecord::Base
  serialize :current
  serialize :location
end
