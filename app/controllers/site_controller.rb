class SiteController < ApplicationController
  layout 'site'
  def index
    @title = "by Ryan Sandor Richards"
  end
  
  def about
    @title = " - About"
  end
  
  def api
    @title = " - API"
  end
end
