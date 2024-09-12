docker run `
  -it `
  -p 9080:80 `
  --rm `
  --env-file ./.env `
  --platform linux/amd64 `
  platform-scim-api:test
