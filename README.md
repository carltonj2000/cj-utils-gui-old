# CJ Utilities

Desktop utilities code with Electron and React.

Use `yarn build` and `yarn dist` to generate the dmg in the dist folder.

# History

The original code in this repository is based on
[Takeaways on Building a React Based App with Electron](https://hackernoon.com/publishing-a-react-based-app-with-electron-and-nodejs-f5ec44169366)
article.

I did not install the following npm packages but did copy the
build script that might reference these packages:

| Package               | Notes                                              |
| --------------------- | -------------------------------------------------- |
| electron-publisher-s3 | Don't plan on using S3                             |
| react-dev-utils       | Apparently already installed with create-react-app |

# Notes

Create Mac Icon via:

```
sips -s format icns icon.png --out icon.icns
```
