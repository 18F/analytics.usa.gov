production:
	bundle exec jekyll build

staging:
	bundle exec jekyll build --config=_config.yml,_staging.yml

dev:
	bundle exec jekyll serve --watch --config=_config.yml,_development.yml

dev-docker:
	bundle exec jekyll serve --host 0.0.0.0 --watch --config=_config.yml,_development.yml

deploy_production:
	make production && cf v3-zdt-push analytics

deploy_staging:
	make staging && cf v3-zdt-push analytics-staging

