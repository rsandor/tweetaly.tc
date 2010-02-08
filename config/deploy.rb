set :application, "tweetaly.tc"
set :repository,  "git://github.com/rsandor/tweetaly.tc.git"
set :scm, :git

role :app, "tweetaly.tc"
role :web, "tweetaly.tc"
role :db, "tweetaly.tc", :primary => true

default_run_options[:pty] = true

# If you are using Passenger mod_rails uncomment this:
# if you're still using the script/reapear helper you will need
# these http://github.com/rails/irs_process_scripts

# namespace :deploy do
#   task :start do ; end
#   task :stop do ; end
#   task :restart, :roles => :app, :except => { :no_release => true } do
#     run "#{try_sudo} touch #{File.join(current_path,'tmp','restart.txt')}"
#   end
# end
