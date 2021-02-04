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

To upload your assets for now we're using imgbb API.
To use the `livestorm asset <file>` command, please get an API key at api.imgbb.com and use the command like this : 

```
IMGBB_KEY=<key> livestorm asset <file>
```

The `<file>` argument corresponds to a file located in an `src/assets` folder.

For instance to upload a file located at `yourproject/src/assets/img/test.png` run `livestorm asset img/test/png` from the root of your project

