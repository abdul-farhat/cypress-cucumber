class TestPage {
    getHeaderName() {
      return cy.get('#header-name').then(($header) => {
        if ($header.length === 0) {
          throw new Error('Header name element not found');
        }
        return $header.text();
      });
    }

    getFeelingOptions() {
        return cy.get('div[role="presentation"] span');
      }
    
    getSpecificFeelingOption(feelingText) {
        return this.getFeelingOptions().contains(feelingText);
      }

    getFeelingLuckyElement() {
        //span input containing text "I'm Feeling" but child element is span
        return cy.get('input').contains("I'm Feeling");
        }
}

  
  module.exports = new TestPage();
  