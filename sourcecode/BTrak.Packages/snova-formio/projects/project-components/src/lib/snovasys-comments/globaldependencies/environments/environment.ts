export const environment = {
    production: true,
    //apiURL: "https://btrak511-development.snovasys.com/backend/",
     apiURL: "https://dev-btrak507.nxusworld.com/backend/",
    artificialDelay: 0,
    version: '{BUILD_VERSION}',
    useTestAuthenticator: false,
    cookiePath: '/',
    fileExtensions: ['jpg', 'jpeg', 'png', 'csv', 'txt', 'xls', 'xls', 'xml'],
    maxFileSize: 10485760,
    deployedEnvironment: '{Octopus.Environment.Name}',
    publishKey: "pub-c-d4eda127-1095-4ded-bd30-5b3b7162a9ff",
    subscribeKey: "sub-c-4aab85be-6ee8-11ea-895f-e20534093ea4",
    canAllowCompanyCreation: '{Btrak.AllowCompanyCreation}',
    zendeskAccountUrl: '{BTrak.Zendesk.AccountUrl}',
    isShowZendesk: '{BTrak.Zendesk.ShowZendesk}',
    trackingId: '{BTrak.Google.Analytics.TrackingId}',
    domainAddress: '{BTrak.DomainAddress}',
    isShowGoogleAnalytics: '{BTrak.Zendesk.ShowGoogleAnalytics}',
    stripeAPIKey: '{Btrak.StripeApiKey}'
  };
  