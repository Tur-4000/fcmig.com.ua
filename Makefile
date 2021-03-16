install:
	composer install
	npm install

start:
	php -S localhost:8080 -t public/

watch:
	gulp

dev:
	gulp build:dev

prod:
	gulp build:prod
