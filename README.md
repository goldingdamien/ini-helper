# Description

Node JavaScript helper library for parsing, setting and getting ini files, strings and items.

## Concerns

Current this libary does not preserve ini comments due to a dependency.

## Usage

```javascript
const fs = require('fs');

const IniHelper = require('ini-helper');
const iniHelper = new IniHelper();

const INI = 'my-file.ini';

const val = iniHelper.getItem(fs.readFileSync(INI), 'key');
console.log(val);

```

## API

* getItem(iniStr, keyStr)
* setItem(iniStr, keyStr, value)
* setString(iniStr, settingsStr)
* parseIniString(iniStr)
* stringifyIniObject(iniObjStr)
* editIniFile(from, to, settings)
* editIniObject(iniObj, settings)
* keyStringToPath(keyStr)
* createSettings(arr)
* createSetting(path, value)