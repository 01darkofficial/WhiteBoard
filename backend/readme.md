On Windows, you might need cross-env (a tiny package) because NODE_ENV=... syntax doesn’t work natively:

npm install cross-env

Then update:

"start": "cross-env NODE_ENV=production node dist/index.js",
"dev": "cross-env NODE_ENV=development nodemon --exec ts-node src/index.ts"
