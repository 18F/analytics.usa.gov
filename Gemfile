source "https://rubygems.org"

ruby '3.3.6'

gem 'jekyll', '~> 4.3.3'
gem 'kramdown-parser-gfm'
gem 'sass', '~> 3.7.4'
# This is a sass dependency which has a security issue. This can be removed
# when the sass gem pulls in this version (or later) of google-protobuf
gem 'google-protobuf', '~> 4.27.5'
gem "webrick", "~> 1.8"
gem 'newrelic_rpm', '~> 9.7', '>= 9.7.1'

group :jekyll_plugins do
    gem 'jekyll-datapage-generator'
    gem 'jekyll-redirect-from'
    gem 'jekyll-sitemap'
end
