# Setup
- Installing dependecies
```bash
npm install
```
- To connect to the `sso-server` you need to create `clients` first on `sso-server`
then paste the `CLIENT_ID`, and `REDIRECT_URI` to `.env.local` (just create it by yourself if this file is not exists)

# Run the app
```bash
npm run dev
```

# Route
```bash
/ # display your login status
/login # login pages
```

# Todo
- create middleware
