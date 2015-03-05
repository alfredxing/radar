require 'test_helper'

class AdminControllerTest < ActionController::TestCase
  test "should get panel" do
    get :panel
    assert_response :success
  end

end
