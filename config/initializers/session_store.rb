# Be sure to restart your server when you modify this file.

# Your secret key for verifying cookie session data integrity.
# If you change this key, all old sessions will become invalid!
# Make sure the secret is at least 30 characters and all random, 
# no regular words or you'll be exposed to dictionary attacks.
ActionController::Base.session = {
  :key         => '_tweetaly.tc_session',
  :secret      => '6ce95461c07224a07c72da3db66fa65fdee42a578de0c3223d31411f388dd5118758705e4953b56e9f4961e2147da841d74ba816550fa8437cc74437f11bdf26'
}

# Use the database for sessions instead of the cookie-based default,
# which shouldn't be used to store highly confidential information
# (create the session table with "rake db:sessions:create")
# ActionController::Base.session_store = :active_record_store
