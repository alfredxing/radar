require 'test_helper'

class AdminControllerTest < ActionController::TestCase
  test "should get panel" do
    # Basic auth
    request.env['HTTP_AUTHORIZATION'] = ActionController::HttpAuthentication::Basic.encode_credentials("supersecretadminname", "supersecretadminpassword")
    get :panel
    assert_response :success
  end

end
