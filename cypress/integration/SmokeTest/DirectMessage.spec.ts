/// <reference path="../../support/index.d.ts" />
/// <reference types="Cypress" />

import { Chance } from 'chance';
const chance = Chance();

describe('Company Direct Message', () => {
  beforeEach(() => {
    cy.visit(Cypress.env('company_url'));
  });

  it('Direct message to multiple company users', () => {
    cy.server();
    cy.route('GET', '**/v1/drafts').as('login');
    cy.route('GET', '**/v1/rooms**').as('room');
    cy.route('POST', '**/v1/rooms/**').as('roomHide');
    cy.loginCompany(Cypress.env('company_admin'), Cypress.env('company_admin_password'));
    cy.wait('@login', { timeout: 15000 })
      .its('status')
      .should('equal', 200);
    cy.wait('@room', { timeout: 15000 })
      .its('status')
      .should('equal', 200);
    cy.get("span[class*='DirectMessageMenu_addIcon']")
      .eq(0)
      .click();
    cy.get("div[role='tab']")
      .contains('Company Users')
      .click();
    var roomName = '';
    cy.get(".ant-tabs-tabpane-active div[class^='Candidate_avatar'] ~ div")
      .within(() => {
        cy.get('h5')
          .eq(0)
          .then((ele) => {
            roomName = ele.text() + ', ';
            ele.click();
          });
        cy.get('h5')
          .eq(1)
          .then((ele) => {
            roomName += ele.text() + ', ';
            ele.click();
          });
        cy.get('h5')
          .eq(2)
          .then((ele) => {
            roomName += ele.text() + ', ';
            ele.click();
          });
        cy.get('h5')
          .eq(3)
          .then((ele) => {
            roomName += ele.text() + ', ';
            ele.click();
          });
        cy.get('h5')
          .eq(4)
          .then((ele) => {
            roomName += ele.text();
            ele.click();
          });
      })
      .then(() => {
        cy.log(roomName);
        cy.get("div[class^='AddDirectMessage'] button.ant-btn").click();
        cy.wait('@roomHide', { timeout: 15000 })
          .its('status')
          .should('equal', 200);
        cy.get("a[class^='ChannelMenu-module_menuItem'].active").should('be.visible');
        cy.get("a[class^='ChannelMenu-module_menuItem'].active>span[class^='ChannelMenu-module_name']").should(
          'contain.text',
          roomName,
        );
        cy.get("a[class^='ChannelMenu-module_menuItem'].active").trigger('mouseover');
        cy.get('div.ant-tooltip')
          .not('.ant-tooltip-hidden')
          .find('.ant-tooltip-inner')
          .should('contain.text', roomName)
          .should('not.contain.text', Cypress.env('company_admin_name'));
      });
  });

  it('Direct message to multiple company users and single candidate', () => {
    cy.server();
    cy.route('GET', '**/v1/drafts').as('login');
    cy.route('GET', '**/v1/rooms?**').as('room');
    cy.route('GET', '**/v1/rooms/**').as('roomCreated');
    cy.route('POST', '**/v1/rooms/**').as('roomHide');
    cy.loginCompany(Cypress.env('company_admin'), Cypress.env('company_admin_password'));
    cy.wait('@login', { timeout: 15000 })
      .its('status')
      .should('equal', 200);
    cy.wait('@room', { timeout: 15000 })
      .its('status')
      .should('equal', 200);
    cy.get("span[class*='DirectMessageMenu_addIcon']")
      .eq(0)
      .click();
    cy.get("div[role='tab']")
      .contains('Company Users')
      .click();
    var roomName = '';
    cy.get(".ant-tabs-tabpane-active div[class^='Candidate_avatar'] ~ div").within(() => {
      cy.get('h5')
        .eq(0)
        .then((ele) => {
          roomName = ele.text() + ', ';
          ele.click();
        });
      cy.get('h5')
        .eq(1)
        .then((ele) => {
          roomName += ele.text() + ', ';
          ele.click();
        });
      cy.get('h5')
        .eq(2)
        .then((ele) => {
          roomName += ele.text() + ', ';
          ele.click();
        });
      cy.get('h5')
        .eq(3)
        .then((ele) => {
          roomName += ele.text() + ', ';
          ele.click();
        });
      cy.get('h5')
        .eq(4)
        .then((ele) => {
          roomName += ele.text() + ', ';
          ele.click();
        });
    });
    cy.get("div[role='tab']")
      .contains('Candidates')
      .click();
    cy.get(".ant-tabs-tabpane-active div[class^='Candidate_avatar'] ~ div")
      .within(() => {
        cy.get('h5')
          .eq(0)
          .then((ele) => {
            ele.click();
          });
        cy.get('h5')
          .eq(1)
          .then((ele) => {
            roomName += ele.text();
            ele.click();
          });
      })
      .then(() => {
        cy.get('.ant-select-selection .ant-select-selection__choice').should('have.length', 6);
        cy.get("div[class^='AddDirectMessage'] button.ant-btn").click();
        cy.wait('@roomCreated', { timeout: 15000 })
          .its('status')
          .should('equal', 200);
        cy.wait('@roomHide', { timeout: 15000 })
          .its('status')
          .should('equal', 200);
        cy.get("a[class^='ChannelMenu-module_menuItem'].active>span[class^='ChannelMenu-module_name']").should(
          'contain.text',
          roomName,
        );
      });
  });

  it('Verify the candidates are able to edit their messages', () => {
    cy.server();
    cy.route('GET', '**/v1/drafts').as('login');
    cy.route('GET', '**/v1/users/profiles**').as('profile');
    cy.route('GET', '**/v1/rooms?**').as('room');
    cy.route('GET', '**/v1/rooms/**').as('botRoom');
    cy.route('POST', '**/v1/rooms/**').as('roomPost');
    cy.route('GET', '**/v1/companies/**').as('company');
    cy.route('GET', '**/v1/users/candidate-profiles**').as('candidate');
    cy.route('POST', '**/v1/messages/**').as('message');
    cy.loginCompany(Cypress.env('company_admin'), Cypress.env('company_admin_password'));
    cy.wait('@login', { timeout: 60000 })
      .its('status')
      .should('equal', 200);
    cy.wait('@profile', { timeout: 60000 })
      .its('status')
      .should('equal', 200);
    cy.wait('@room', { timeout: 60000 })
      .its('status')
      .should('equal', 200);
    cy.get("span[class*='DirectMessageMenu_addIcon']")
      .eq(0)
      .click();
    cy.get("div[role='tab']")
      .contains('Candidates')
      .click();
    cy.wait('@candidate', { timeout: 60000 })
      .its('status')
      .should('equal', 200);
    cy.wait('@candidate', { timeout: 60000 })
      .its('status')
      .should('equal', 200);
    cy.get(".ant-tabs-tabpane-active div[class^='Candidate_avatar'] ~ div>h5")
      .contains(Cypress.env('candidate_user_name'))
      .click();
    cy.get("div[class^='AddDirectMessage'] button.ant-btn").click();
    cy.wait('@roomPost', { timeout: 60000 })
      .its('status')
      .should('equal', 200);
    cy.wait('@botRoom', { timeout: 60000 })
      .its('status')
      .should('equal', 200);
    const randomMessage = chance.guid();
    cy.get(`textarea[class^='MessageInput-module_message']`).type(randomMessage);
    cy.get(`textarea[class^='MessageInput-module_message']`).type('{enter}');
    cy.wait('@message', { timeout: 60000 })
      .its('status')
      .should('equal', 200);
    cy.contains(randomMessage).click();
    cy.get('li.ant-list-item div.ant-dropdown-trigger').click();
    cy.get('.ant-menu-vertical li.ant-menu-item>span')
      .contains('Edit Message')
      .click();
    cy.get(`li[class*='ant-list-item MessageEditableItem'] .ant-avatar`).should('be.visible');
    cy.get(`li[class*='ant-list-item MessageEditableItem'] span[class^='ant-typography']>strong`).should('be.visible');
    cy.get(`li[class*='ant-list-item MessageEditableItem'] span[class*='MessageEditableItem-module_timestamp']`).should(
      'be.visible',
    );
    cy.get(`li[class*='ant-list-item MessageEditableItem'] button`)
      .its('length')
      .should('be.equal', 2);
    cy.get(`li[class*='ant-list-item MessageEditableItem'] button`).should('contain.text', 'Cancel');
    cy.get(`li[class*='ant-list-item MessageEditableItem'] button`).should('contain.text', 'Save Changes');
    cy.get(`li.ant-list-item textarea[class^='MessageInput-module_message`).should('contain.text', randomMessage);
    cy.get(`li.ant-list-item textarea[class^='MessageInput-module_message`).clear();
    const newRandomMessage = chance.guid();
    cy.get(`li.ant-list-item textarea[class^='MessageInput-module_message`).type(newRandomMessage);
    cy.get(`li[class*='ant-list-item MessageEditableItem'] button`)
      .contains('Cancel')
      .click({ force: true });
    cy.contains(randomMessage).should('be.visible');
    cy.contains(newRandomMessage).should('not.be.visible');

    cy.contains(randomMessage).click();
    cy.get('li.ant-list-item div.ant-dropdown-trigger').click();
    cy.get('.ant-menu-vertical li.ant-menu-item>span')
      .contains('Edit Message')
      .click();
    cy.get(`li.ant-list-item textarea[class^='MessageInput-module_message`).clear();
    cy.get(`li.ant-list-item textarea[class^='MessageInput-module_message`).type(newRandomMessage);
    cy.get(`li[class*='ant-list-item MessageEditableItem'] button`)
      .contains('Save Changes')
      .click({ force: true });
    cy.contains(randomMessage).should('not.be.visible');
    cy.contains(newRandomMessage + '(Edited)').should('be.visible');
  });

  it('Verify the candidates are able to delete their messages', () => {
    cy.server();
    cy.route('GET', '**/v1/drafts').as('login');
    cy.route('GET', '**/v1/users/profiles**').as('profile');
    cy.route('GET', '**/v1/rooms?**').as('room');
    cy.route('GET', '**/v1/rooms/**').as('botRoom');
    cy.route('POST', '**/v1/rooms/**').as('roomPost');
    cy.route('GET', '**/v1/companies/**').as('company');
    cy.route('GET', '**/v1/users/candidate-profiles**').as('candidate');
    cy.route('POST', '**/v1/messages/**').as('message');
    cy.loginCompany(Cypress.env('company_admin'), Cypress.env('company_admin_password'));
    cy.wait('@login', { timeout: 60000 })
      .its('status')
      .should('equal', 200);
    cy.wait('@profile', { timeout: 60000 })
      .its('status')
      .should('equal', 200);
    cy.wait('@room', { timeout: 60000 })
      .its('status')
      .should('equal', 200);
    cy.get("span[class*='DirectMessageMenu_addIcon']")
      .eq(0)
      .click();
    cy.get("div[role='tab']")
      .contains('Candidates')
      .click();
    cy.wait('@candidate', { timeout: 60000 })
      .its('status')
      .should('equal', 200);
    cy.wait('@candidate', { timeout: 60000 })
      .its('status')
      .should('equal', 200);
    cy.get(".ant-tabs-tabpane-active div[class^='Candidate_avatar'] ~ div>h5")
      .contains(Cypress.env('candidate_user_name'))
      .click();
    cy.get("div[class^='AddDirectMessage'] button.ant-btn").click();
    cy.wait('@roomPost', { timeout: 60000 })
      .its('status')
      .should('equal', 200);
    cy.wait('@botRoom', { timeout: 60000 })
      .its('status')
      .should('equal', 200);
    const randomMessage = chance.guid();
    cy.get(`textarea[class^='MessageInput-module_message']`).type(randomMessage);
    cy.get(`textarea[class^='MessageInput-module_message']`).type('{enter}');
    cy.wait('@message', { timeout: 60000 })
      .its('status')
      .should('equal', 200);
    cy.contains(randomMessage).click();
    cy.get('li.ant-list-item div.ant-dropdown-trigger').click();
    cy.get('.ant-menu-vertical li.ant-menu-item>span')
      .contains('Delete Message')
      .click();
    cy.get('.ant-btn-link').click();
    cy.get('.ant-btn-link').should('not.be.visible');
    cy.contains(randomMessage).should('be.visible');
    cy.contains(randomMessage).click();
    cy.get('li.ant-list-item div.ant-dropdown-trigger').click();
    cy.get('.ant-menu-vertical li.ant-menu-item>span')
      .contains('Delete Message')
      .click();
    cy.get('.ant-btn-danger').click();
    cy.contains(randomMessage).should('not.be.visible');
  });
});
