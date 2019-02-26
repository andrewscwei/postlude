# Postlude

Postlude is an experimental [PostCSS](http://postcss.org/) plugin. It is packaged with many handy custom properties and at-rules to accomodate efficient styling.

## Usage

```css
/* This custom property... */
.foo {
  -post-margin: 10px _ _ 20px;
}

/* ...becomes */
.foo {
  margin-top: 10px;
  margin-left: 20px;
}
```

See [`lib`](./lib) for all available features.

## Options

### `options.atRuleName`
Default: `post`

The at-rule name to use. Defaults to `post`. Example:

```css
.foo {
  @post margin(0);
}
```

### `options.customPropertyPrefix`
Default: `-post-`

The custom property prefix to use. Defaults to `-post`. Example:

```css
.foo {
  -post-margin: 0;
}
```

## Disclaimer

Postlude is an on-going pet project for experimenting with PostCSS styling techniques. At its current state, it is not production ready, has an ever-changing API, and lacks proper documentation. Its features are driven by internal requirements and is meant for internal use only.
