// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  language: 'da',
  logo: './assets/img/craftsfo/logo_house_small_transparent.png',
  bg_image_url: './assets/img/craftsfo/crafts_hus_og_heim.jpg',
  brandName: 'Crafts.fo',
  apiSettings: {
    api: 'https://localhost:5123',
    cdn: 'https://localhost:5125'
  }
};


