describe("Note app", function () {
  beforeEach(function () {
    cy.request("POST", `${Cypress.env("BACKEND")}/testing/reset`);
    const user = {
      name: "Zedrick Torres",
      username: "pongbao",
      password: "michin-saekki",
    };
    cy.request("POST", `${Cypress.env("BACKEND")}/users/`, user);
    cy.visit("");
  });

  it("front page can be opened", function () {
    cy.contains("Notes");
    cy.contains(
      "Note app, Department of Computer Science, University of Helsinki 2023"
    );
  });

  it("login form can be opened", function () {
    cy.contains("login").click();
  });

  it("user can login", function () {
    cy.contains("login").click();
    cy.get("#username").type("pongbao");
    cy.get("#password").type("michin-saekki");
    cy.get("#login-button").click();

    cy.contains("Zedrick Torres logged in");
  });

  describe("when logged in", function () {
    beforeEach(function () {
      cy.login({ username: "pongbao", password: "michin-saekki" });
    });

    it("a new note can be created", function () {
      cy.contains("new note").click();
      cy.get("input").type("a note created by cypress");
      cy.contains("save").click();

      cy.contains("a note created by cypress");
    });

    describe("and several notes exist", function () {
      beforeEach(function () {
        cy.createNote({ content: "first note", important: false });
        cy.createNote({ content: "second note", important: false });
        cy.createNote({ content: "third note", important: false });
      });

      it.only("one of those can be made important and unimportant", function () {
        // cy.contains("second note").contains("make important").click();
        cy.contains("second note").parent().find("button").click();

        // cy.contains("second note").contains("make not important");
        cy.contains("second note")
          .parent()
          .find("button")
          .should("contain", "make important");

        // cy.contains("second note").parent().find("button").as("theButton");
        // cy.get("@theButton").click();

        // cy.get("@theButton").should("contain", "make important");
      });
    });
  });

  it("login fails with wrong password", function () {
    cy.contains("login").click();
    cy.get("#username").type("pongbao");
    cy.get("#password").type("wrong");
    cy.get("#login-button").click();

    cy.get(".error").contains("Wrong credentials");
    cy.get(".error")
      .should("contain", "Wrong credentials")
      .and("have.css", "color", "rgb(255, 0, 0)")
      .and("have.css", "border-style", "solid");

    cy.get("html").should("not.contain", "Zedrick Torres logged in");
  });
});
