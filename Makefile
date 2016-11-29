
production:
	bundle exec jekyll build

staging:
	bundle exec jekyll build --config=_config.yml,_staging.yml

dev:
	bundle exec jekyll serve --watch --config=_config.yml,_development.yml

deploy_production:
	make production && cf push analytics

deploy_staging:
	make staging && cf push analytics-staging
