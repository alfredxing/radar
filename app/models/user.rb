class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable

  validates :email, :presence => true, :uniqueness => true

  serialize :preferences
  after_initialize :set_preferences_defaults
  private
    def set_preferences_defaults
      self.preferences ||= {
        "wind" => false,
        "dewpoint" => false,
        "pressure" => false,
        "visibility" => false,
        "humidity" => false
      }
    end
end
