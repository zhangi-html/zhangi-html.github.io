# zhangi-html.github.io

Static HTML hosted on GitHub Pages at [zhangi-html.github.io](https://zhangi-html.github.io/).

## Adding a page

1. Put your `.html` file in the repo root.
2. Add an entry to the `pages` array in `index.html`.
3. Commit and push to `main`.

Pages are served as static files (see `.nojekyll`); Jekyll is not used.

## Rebuild Pages

Pushes to `main` should republish automatically. To trigger a rebuild manually:

```bash
gh api -X POST repos/zhangi-html/zhangi-html.github.io/pages/builds
```

Check the latest build status:

```bash
gh api repos/zhangi-html/zhangi-html.github.io/pages/builds --jq '.[0] | {status, created_at, updated_at}'
```
