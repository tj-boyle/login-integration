// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
    production: false,
    oktaUrl: 'https://dev-570546.okta.com/',
    oktaClientId: '0oa12ljvekBSBhfHI4x7',
    oktaRedirectUri: 'http://localhost:4200/login/callback',
    googleClientId: '395482602866-98pislb40f2bunm6mkdp2tgho8e566t5.apps.googleusercontent.com'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
