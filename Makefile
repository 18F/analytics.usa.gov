scss ?= sass/public_analytics.css.scss
css ?= css/public_analytics.css

all: styles

styles:
	sass $(scss):$(css)

watch:
	sass --watch $(scss):$(css)

production:
	bundle exec jekyll build

dev:
	bundle exec jekyll serve --watch --config=_config.yml,_development.yml

clean:
	rm -f $(css)
