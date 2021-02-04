Livestorm plugin CLI
---

This project is a CLI that allows you to create, publish and manage your livestorm plugins

To install simply : 
```
yarn global add git+ssh://git@github.com/livestorm/livestorm-plugin-cli.git
```


Then, to get the list of available commands, run :
```
livestorm help
```

### Manage your assets

If your project needs to use assets such as images, videos, sound file you can use the `livestorm asset <file>`.

Since we're temporarily using imgbb api, you need to get an API key at api.imgbb.com and use the command like this : 

```
IMGBB_KEY=<key> livestorm asset <file>
```

The `<file>` argument corresponds to a file located in an `src/assets` folder.

For instance, to upload a file located at `yourproject/src/assets/img/test.png` run `livestorm asset img/test.png` from the root of your project

