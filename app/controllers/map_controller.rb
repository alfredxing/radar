class MapController < ApplicationController
  def index
    curr = ActiveSupport::JSON.decode(Weather.first.current.to_json)
    @updated = curr["updated"]
  end
end
