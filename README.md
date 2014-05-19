# hackdash
web server with HTTPS

Each users corresponds to a subdomain.
Unfortunately, due to TLS, resource manipulation has to be done through one subdomain rather than at the actual locations.
The API is a reserved subdomain, the same one as the TLS certificate.
Its cookies are not accessible from other subdomains.
2 domains are not necessary if you avoid using cookies on the top level.


## Setup
- Generate a TLS certificate and key (subdomain for the API)
- Development: `/etc/hosts` Add subdomains as needed.
```
127.0.0.1       localhost
127.0.0.1       api.localhost
127.0.0.1       x.localhost
```
- Production: DNS records: domain, wildcard subdomain
- Edit `config.json`
- Terminal:
  - `cd` to this directory
  - `nodejs ./server.js`
  - For ports below 1024, prefix with `sudo `. (You should forward higher ports to avoid.)

## To Do
- forward ports
- multiple domains
- registration
- auth
- lists
- posts
- subscribe
- ?????
- PROFIT
