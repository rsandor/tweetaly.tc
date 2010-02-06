ActionController::Routing::Routes.draw do |map|
  # Main website
  map.connect '', :controller => 'site', :format => 'html'
  map.connect ':action', :controller => 'site', :format => 'html'
  
  # Users
  map.connect 'users/:id', :controller => 'users', :action => 'index'
  
  # General routes
  map.connect ':controller/:action/:id'
  map.connect ':controller/:action/:id.:format'
end
