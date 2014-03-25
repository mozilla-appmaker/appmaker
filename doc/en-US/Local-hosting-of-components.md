Local Hosting of Components:
============================

Example:

Given the project directory `mozilla-appmaker`, clone the components you would like to work on alongside the `appmaker` project.

```
mozilla-appmaker/
├── appmaker
├── component-alternating-gate
├── component-button
├── component-fireworks
...
```

Set the environment `COMPONENTS_DIR` variable in your `.env` file

`COMPONENTS_DIR=../`

Ensure `CURATED_COMPONENTS` is not in your `.env` file.

This means that we'll search our local dir for subdirs that have a `component.html`
file in them, call out to Github (because CURATED_COMPONENTS is null) and find the list
of the 'component-' repositories in the mozilla-appmaker organization.
