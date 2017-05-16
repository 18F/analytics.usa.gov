ifndef APP_IMAGE
	APP_IMAGE = 18f/analytics.usa.gov
endif
ifndef APP_TAG
	APP_TAG = latest
endif
ifndef PROD_TAG
	PROD_TAG = production
endif

production:
	bundle exec jekyll build

staging:
	bundle exec jekyll build --config=_config.yml,_staging.yml

dev:
	bundle exec jekyll serve --watch --config=_config.yml,_development.yml

dev-docker:
	bundle exec jekyll serve --host 0.0.0.0 --watch --config=_config.yml,_development.yml

deploy_production:
	make production && cf push analytics

deploy_staging:
	make staging && cf push analytics-staging

docker-start:
	docker-compose up -d

docker-build-app:
	docker build -t $(APP_IMAGE):${APP_TAG} .

docker-build-production:
	docker build -t $(APP_IMAGE):${PROD_TAG} -f Dockerfile.production .

docker-cli: docker-start
	docker-compose exec jekyll bash

