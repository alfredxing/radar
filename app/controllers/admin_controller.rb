class AdminController < ApplicationController
http_basic_authenticate_with name: "supersecretadminname", password: "supersecretadminpassword"
  

def panel
  end
end
