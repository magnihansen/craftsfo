export const environment = {
  production: true,
  language: 'da',
  logo: './assets/img/craftsfo/logo_house_small_transparent.png',
  bg_image_url: './assets/img/craftsfo/crafts_hus_og_heim.jpg',
  brandName: 'Crafts.fo',
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
