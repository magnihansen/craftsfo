export const environment = {
  production: true,
  language: 'da',
  logo: './assets/img/kageogform/blue-cupcakes_78x48.png',
  bg_image_url: './assets/img/kageogform/colorful_cupcakes.jpg',
  brandName: 'Kage og form',
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
