# IT Cloud Hub

Static website for IT Cloud Hub, designed for the future domain `itcloudhub.com`.

## Run locally

The site has no build step. Serve the `dist` directory with any static web server:

```sh
python3 -m http.server 8080 --directory dist
```

Open `http://localhost:8080`.

## Deploy

Upload the **contents** of `dist` to your web server's document root (for example `public_html`). The `services`, `industries`, and `company` subdirectories contain the individual pages. Point `itcloudhub.com` to your chosen host when you are ready to connect the domain.

The `.openai/hosting.json` file configures the existing Sites project; it does not configure your domain or GitHub Pages.
