TESTS = test/*.js
REPORTER = spec
TIMEOUT = 5000
MOCHA_OPTS =
NPM_INSTALL = npm install --registry=http://registry.cnpmjs.org --cache=${HOME}/.npm/.cache/cnpm --disturl=http://dist.u.qiniudn.com
install:
	@$(NPM_INSTALL)

test: install
	@NODE_ENV=test ./node_modules/mocha/bin/mocha \
		--harmony \
		--reporter $(REPORTER) \
		--timeout $(TIMEOUT) \
		$(MOCHA_OPTS) \
		$(TESTS)

test-all: test

.PHONY: install test
