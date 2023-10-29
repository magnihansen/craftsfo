export const environment = {
  production: true,
  language: 'da',
  logo: './assets/img/p-grillen/p-grillen_logo_48x48.png',
  bg_image_url: './assets/img/p-grillen/p-grillen-hobrovej_svenstrup.jpg',
  brandName: 'P-Grillen',
  hubSettings: {
    url: 'http://api.instantcms.dk/api'
  },
  storage: {
    local: {
      API_TOKEN: 'apitoken',
      USER: 'user'
    },
    session: {
      IS_USER_LOGGED_IN: 'isUserLoggedIn'
    }
  },
  nonce: null
};
