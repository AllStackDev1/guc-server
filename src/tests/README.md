# TEST

## Test Module

This module contains all the tests (integration and unit) for the application. Test for models, controllers and repositories are found in their respective directories. A Test Driven Development (TDD) approach is followed where tests are written before the corresponding functionalities being tested are implemented. The **init.js** file includes all necessary packages that are required for the various tests. It initiates connection to the test database for tests that require access to the database

## Running Tests with Coverage

All the test can be run by executing `yarn run test`. This will run all the test and report coverage. There should be at least **70%** test coverage for this API and all other APIs
