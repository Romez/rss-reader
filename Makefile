install:
	npm ci

start:
	npx webpack-dev-server

lint:
	npx eslint .

build:
	npx webpack

test:
	npm test

deploy: build
