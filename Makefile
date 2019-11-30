install:
	npm ci

dev:
	npx webpack-dev-server

lint:
	npx eslint .

build:
	npx webpack

deploy: build
