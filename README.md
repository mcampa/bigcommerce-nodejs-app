# Bigcommerce Nodejs App

This is a basic Bigcommerce app

### Installation

Clone and install dependencies:
```
git clone https://github.com/mcampa/bigcommerce-nodejs-app.git
cd bigcommerce-nodejs-app
npm install
```

Create `config.json` file, with your bigcommerce credentials:
```json
{
  "server": {
    "host": "localhost",
    "port": 3333
  },
  "yar": {
    "cookieOptions": {
      "password": "a long password"
    }
  },
  "bigcommerce": {
    "clientId": "m7yqgsk39i6agn4pfscmglt2s9lmlrc",
    "clientSecret": "5vbrqco0vx2xf5eig402zhremio66kq",
    "callbackUrl": "https://e4a32fdc.ngrok.io/app/auth",
    "bcAuthUrl": "https://login.bigcommerce.com/oauth2/token",
    "bcApiUrl": "https://api.bigcommerce.com/"
  }
}
```

Run the app:
```
node server/index.js
```
