DEPLOY_BUCKET=18f-dap

production:
	bundle exec jekyll build

dev:
	bundle exec jekyll serve --watch --config=_config.yml,_development.yml

deploy:
	make production && \
	s3cmd put --recursive -P -M \
	--add-header="Cache-Control:max-age=0" _site/* \
	s3://$(DEPLOY_BUCKET)/ && \
	s3cmd put -P --mime-type="text/css" \
	--add-header="Cache-Control:max-age=0" _site/css/*.css \
	s3://$(DEPLOY_BUCKET)/css/ && \
	s3cmd put -P --mime-type="text/css" \
	--add-header="Cache-Control:max-age=0" _site/css/vendor/*.css \
	s3://$(DEPLOY_BUCKET)/css/vendor/

