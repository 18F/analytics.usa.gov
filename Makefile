ifndef DOCKER_ANALYTICS_IMAGE
	DOCKER_ANALYTICS_IMAGE = "18f/analytics.usa.gov"
endif
ifndef DOCKER_ANALYTICS_NGINX_IMAGE
	DOCKER_ANALYTICS_NGINX_IMAGE = "18f/nginx-analytics"
endif

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

docker-build-analytics:
	docker build -t $(DOCKER_ANALYTICS_IMAGE) .

docker-build-jekyll-dist:
	docker run --rm -v $${PWD}/dist:/dist $(DOCKER_ANALYTICS_IMAGE) jekyll build --destination /dist

docker-build-nginx:
	docker build -t $(DOCKER_ANALYTICS_NGINX_IMAGE) -f Dockerfile.nginx .

docker-cli:
	docker-compose up -d && \
	docker-compose exec jekyll bash

