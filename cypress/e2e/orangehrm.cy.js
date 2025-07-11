describe('Test OrangeHRM', () => {

//1. Login --------------------------------------------------------------
  it('Negative Case - Gagal login dengan password salah', () => {
    cy.fixture('credentials').then((cred) => {
      cy.visit('https://opensource-demo.orangehrmlive.com/')
      cy.get('input[name="username"]').type(cred.username)
      cy.get('input[name="password"]').type(cred.wrongPassword)
      cy.get('button[type="submit"]').click()

      cy.get('.oxd-alert-content-text')
        .should('be.visible')
        .and('contain', 'Invalid credentials')

      cy.screenshot('negatif-gagal-login')
    })
  })

  it('Login sampai tambah Admin user', () => {
    cy.fixture('credentials').then((cred) => {
      cy.visit('https://opensource-demo.orangehrmlive.com/')
      cy.get('input[name="username"]').type(cred.username)
      cy.get('input[name="password"]').type(cred.password)
      cy.get('button[type="submit"]').click()
      cy.url().should('include', '/dashboard')
      cy.screenshot('login-berhasil')

      //2. Akses Menu Admin --------------------------------------------------------------
      cy.contains('span', 'Admin').should('be.visible').click()
      cy.url().should('include', '/admin')
      cy.screenshot('akses-admin-menu')

      //3. Tambah User Admin --------------------------------------------------------------
      cy.get('button').contains('Add').click()

      cy.get('label').contains('User Role').parent().next().within(() => {
        cy.get('.oxd-select-text').click()
        cy.contains('.oxd-select-option', 'Admin').click()
      })

      cy.get('label').contains('Status').parent().next().within(() => {
        cy.get('.oxd-select-text').click()
        cy.contains('.oxd-select-option', 'Enabled').click()
      })

      cy.get('label').contains('Employee Name').parent().next().find('input')
        .type('John Doe')
      cy.wait(1000)
      cy.get('.oxd-autocomplete-option').contains('John').click()

      cy.get('label').contains('Username').parent().next().find('input')
        .type('JohnDoe69420')

      cy.get('label').contains('Password').parent().next().find('input')
        .type('iliketurtles123')

      cy.get('label').contains('Confirm Password').parent().next().find('input')
        .type('iliketurtles123')

      cy.get('button').contains('Save').click()

      // Verifikasi User
      cy.get('input[placeholder="Type for hints..."]').type('JohnDoe69420')
      cy.get('button').contains('Search').click()
      cy.wait(1000)

      cy.get('.oxd-table-body')
        .should('contain.text', 'JohnDoe69420')
        .and('contain.text', 'Admin')

      cy.screenshot('user-berhasil-ditambah')
    })
  })
})
