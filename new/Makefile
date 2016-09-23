all: dev
dev:
	@DEBUG=koa*,leaf*,vipabc* UV_THREADPOOL_SIZE=100 NODE_ENV=development ./node_modules/.bin/gulp server
test:
	@DEBUG=leaf*,koa*,vipabc* NODE_ENV=test ./node_modules/.bin/mocha test
demo:
	@DEBUG=leaf* NODE_ENV=test ./node_modules/.bin/mocha test/DemoTest.js
doc:
	@./node_modules/.bin/gulp api-doc
.PHONY: test
