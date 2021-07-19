import { Injectable } from '@nestjs/common';
import * as google from 'googleapis';

@Injectable()
export class GoogleService {
  readonly scope: Array<string>;
  oauth2Client: google.Auth.OAuth2Client;
  people: any;

  constructor() {
    this.scope = [
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile',
    ];
    this.oauth2Client = new google.google.auth.OAuth2(
      process.env.OAUTH_GOOGLE_ID,
      process.env.OAUTH_GOOGLE_SECRET,
      process.env.OAUTH_GOOGLE_REDIRECT_URL,
    );
    this.people = google.google.people('v1');
    google.google.options({ auth: this.oauth2Client });
  }

  generateAuthUrl() {
    return this.oauth2Client.generateAuthUrl({
      scope: this.scope,
    });
  }

  async setCredentials(code: string) {
    const { tokens } = await this.oauth2Client.getToken(code);
    this.oauth2Client.setCredentials(tokens);
  }

  async getGoogleUser() {
    const meResult = await this.people.people.get({
      resourceName: 'people/me',
      personFields: 'emailAddresses,names,photos,birthdays',
    });
    return meResult.data;
  }
}
