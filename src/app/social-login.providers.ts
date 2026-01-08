import { importProvidersFrom } from '@angular/core';
import { SocialLoginModule, SocialAuthServiceConfig } from '@abacritt/angularx-social-login';
import { GoogleLoginProvider } from '@abacritt/angularx-social-login';

export const socialLoginProviders = [
  importProvidersFrom(SocialLoginModule),
  {
    provide: 'SocialAuthServiceConfig',
    useValue: {
      autoLogin: false,
      providers: [
        {
          id: GoogleLoginProvider.PROVIDER_ID,
          provider: new GoogleLoginProvider('GOOGLE_CLIENT_ID') // Replace with your client ID
        }
      ]
    } as SocialAuthServiceConfig,
  }
];
