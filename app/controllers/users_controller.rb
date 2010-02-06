class UsersController < ApplicationController
  layout 'users'
  def index
    @screen_name = params[:id]
  end
end
