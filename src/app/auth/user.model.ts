export class User {

  constructor(public email: string, public id: string ,private _token: string, private _tokenExpirationDate: Date) { }

  get token() {
    if (!this._tokenExpirationDate || new Date() > this._tokenExpirationDate) {
      return null;
    }
    return this._token;
  }

  get tokenExpirationDate() {
    return this._tokenExpirationDate;
  }

  get tokenDuration() {
    if (!this._tokenExpirationDate || new Date() > this._tokenExpirationDate) {
      return 0;
    }
    return this._tokenExpirationDate.getTime() - new Date().getTime();
  }

}
