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
      "password": "<a strong password for encoding cookies>"
    }
  },
  "app": {
    "bcClientId": "<bc app client id>",
    "bcClientSecret": "<bc app client secret>",
    "bcAuthUrl": "https://login.bigcommerce.com/oauth2/token",
    "bcApiUrl": "https://api.bigcommerce.com/",
    "appUrl": "https://myappurl.example.com",
    "authUri": "/app/auth",
    "loadUri": "/app/load",
    "uninstallUri": "/app/uninstall",
    "webhookUri": "/app/webhook"
  }
}

```

Run the app:
```
node server/index.js
```
