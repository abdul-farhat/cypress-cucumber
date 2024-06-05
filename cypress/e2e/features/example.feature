Feature: Example feature

  Background: Clean Environment
    Given a clean database

  Scenario: User visits the homepage
    Given 'exception-records-5' were created 0 day ago
    And the user is on the homepage
    And I make a GET request to "/v1/users"
    Then the response should be:
      | id | name  |
      | 1  | John  |
      | 2  | Marry |
    When the user clicks the 'Accept all' button
    Then the user should see the "About Us" page