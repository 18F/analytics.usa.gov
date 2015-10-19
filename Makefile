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

deploy:
	make production && s3cmd put --recursive -P -M --add-header="Cache-Control:max-age=0" _site/* s3://18f-dap/ && s3cmd put -P --mime-type="text/css" --add-header="Cache-Control:max-age=0" _site/css/*.css s3://18f-dap/css/
	