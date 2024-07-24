production:
	npm run build:prod && bundle exec jekyll build

local:
	bundle exec jekyll serve --watch --config=_config.yml,_development.yml
