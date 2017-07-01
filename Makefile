TESTS = test/*.js
REPORTER = spec
TIMEOUT = 20000
PATH := ./node_modules/.bin:$(PATH)
MOCHA = ./node_modules/mocha/bin/_mocha
COVERALLS = ./node_modules/coveralls/bin/coveralls.js

test:
	NODE_ENV=test mocha -R $(REPORTER) -t $(TIMEOUT) \
		$(MOCHA_OPTS) $(TESTS)

test-cov:
	@NODE_ENV=test \
		istanbul cover --report html $(MOCHA) -- -t $(TIMEOUT) -R spec $(TESTS)

test-coveralls:
	@NODE_ENV=test \
		istanbul cover --report lcovonly $(MOCHA) -- -t $(TIMEOUT) -R spec $(TESTS)
	@echo TRAVIS_JOB_ID $(TRAVIS_JOB_ID)
	@cat ./coverage/lcov.info | $(COVERALLS) && rm -rf ./coverage

.PHONY: test
