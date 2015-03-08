class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable

  validates :email, :presence => true, :uniqueness => true

  serialize :preferences
  after_initialize :set_preferences_defaults

  DEFAULT_PREFS = {
    "wind" => true,
    "dewpoint" => false,
    "pressure" => true,
    "visibility" => false,
    "humidity" => true
  }

  private
    def set_preferences_defaults
      self.preferences ||= DEFAULT_PREFS
    end
end
