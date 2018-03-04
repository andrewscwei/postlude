# Postlude

Postlude is an experimental [PostCSS](http://postcss.org/) plugin. It is packaged with many handy utility mixins and functions to accomodate efficient styling. These mixins can be expressed as at-rules or custom properties.

## Usage

```css
/* Using the custom property format */
.foo {
  -post-margin: 10px _ _ 20px;
}

/* Using the at-rule format */
.foo {
  @post margin(10px, _, _, 20px);
}

/* ...both yields */
.foo {
  margin-top: 10px;
  margin-left: 20px;
}
```

## Options

### `options.use`
Default: `property`

This option indicates which API to use: custom property or at-rule. Set it to `property` for custom properties or `at-rule` for at-rules.

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

# Disclaimer

Postlude is an on-going pet project for experimenting with PostCSS styling techniques. At its current state, it is not production ready, has an ever-changing API, and lacks proper documentation. Its features are driven by internal requirements and is meant for internal use only.

## License

This software is released under the [MIT License](http://opensource.org/licenses/MIT).