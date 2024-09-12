docker run `
  -it `
  -p 9080:443 `
  -v ${PWD}/certs:/app/certs `
  -v ${PWD}/externalSecrets:/app/externalSecrets `
  --rm `
  --env-file ./.env `
  --platform linux/amd64 `
  platform-scim-api:test
