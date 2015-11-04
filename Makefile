scss ?= sass/public_analytics.css.scss
css ?= css/public_analytics.css

DEPLOY_BUCKET=18f-dap

all: styles

production:
	bundle exec jekyll build

dev:
	bundle exec jekyll serve --watch --config=_config.yml,_development.yml

clean:
	rm -f $(css)

deploy:
	make production && s3cmd put --recursive -P -M --add-header="Cache-Control:max-age=0" _site/* s3://$(DEPLOY_BUCKET)/ && s3cmd put -P --mime-type="text/css" --add-header="Cache-Control:max-age=0" _site/css/*.css s3://$(DEPLOY_BUCKET)/css/

