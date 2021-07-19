interface NameObj {
  displayName: string;
  familyName: string;
  givenName: string;
  displayNameLastFirst: string;
  unstructuredName: string;
}

interface EmailObj {
  value: string;
}

interface PhotoObj {
  url: string;
}

export default class GoogleProfileDto {
  names: Array<NameObj>;
  emailAddresses: Array<EmailObj>;
  photos: Array<PhotoObj>;
}
