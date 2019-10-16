var fs = require('fs');
var ini = require('ini');

class IniHelper{

    constructor(){
        //Not static because global settings may be desired later.
    }

    /**
     * Gets single line item.
     * @public
     * @param {String} iniStr 
     * @param {String} keyStr 
     * @return {String} value
     */
    getItem(iniStr, keyStr){
        const iniObj = ini.parse(iniStr);
        const path = this.keyStringToPath(keyStr);
        const value = this._getItemFromPath(iniObj, path);
        return value;
    }

    /**
     * Sets single line item.
     * @public
     * @param {String} iniStr 
     * @param {String} keyStr 
     * @param {String} value 
     * @return {String} new ini string
     */
    setItem(iniStr, keyStr, value){
        const iniObj = ini.parse(iniStr);
        const path = this.keyStringToPath(keyStr);
        this._setItemFromPath(iniObj, path, value);
        return ini.stringify(iniObj);
    }

    /**
     * Set multi-line settings string to multi-line ini string.
     * @public
     * @param {String} iniStr 
     * @param {String} settingsStr String representation of this.createSettings return object.
     * @return {String} new ini string
     */
    setString(iniStr, settingsStr){
        const iniObj = ini.parse(iniStr);
        const settings = JSON.stringify(settingsStr);
        this.editIniObject(iniObj, settings);
        return JSON.stringify(iniObj);
    }

    /**
     * Parse ini string to JSON string.
     * @public
     * @param {String} iniStr 
     * @return {String} JSON representation of iniObj
     */
    parseIniString(iniStr){
        const iniObj = ini.parse(iniStr);
        return JSON.stringify(iniObj);
    }

    /**
     * Stringify parsed ini object string.
     * @public
     * @param {String} iniObjStr string representation of iniObj
     * @return {String} ini string
     */
    stringifyIniObject(iniObjStr){
        const iniObj = JSON.parse(iniObjStr);
        return ini.stringify(iniObj, {});
    }
    
    /**
     * Edits ini file.
     * @public
     * @param {String} from File to load from.
     * @param {String} to File location to save to(Creates if not exists. Overwrites if exists.).
     * @param {Array} settings Settings array
     */
    editIniFile(from, to, settings){
        var iniObj = ini.parse(fs.readFileSync(from, 'utf-8'));
        this.editIniObject(iniObj, settings);
        fs.writeFileSync(to, ini.stringify(iniObj, {}))
    }
    
    /**
     * Edits parsed ini object.
     * @public
     * @param {Object} iniObj 
     * @param {Array} settings 
     */
    editIniObject(iniObj, settings){
        this._log('previous ini object', iniObj);
    
        settings.forEach((setting)=>{
            let path = setting.path;
            let value = setting.value;

            this._setItemFromPath(iniObj, path, value);
        });
        this._log('edited ini object', iniObj);
    }

    /**
     * Turns key string into path array
     * @public
     * @param {String} keyStr key1.key2.keyn...
     * @return {Array} pathArr
     */
    keyStringToPath(keyStr){
        return keyStr.split('.');
    }
    
    /**
     * Creates internally used setting from simple array.
     * @public
     * @param {Array} arr [[pathArr1, val1], [pathArrn, valn], ...]
     * @return {Array}
     */
    createSettings(arr){
        return arr.map((item)=>{
            return this.createSetting(item[0], item[1]);
        });
    }
    
    /**
     * Creates single setting used to edit one line in ini file.
     * @public
     * @param {Array} path path array: [key1, keyn, ...]
     * @param {String} value value to set.
     * @return {Object}
     */
    createSetting(path, value){
        return {
            path: path, 
            value: value
        };
    }

    /**
     * @param {object} iniObj
     * @param {string}
     * @return {string}
     */
    _getItemFromPath(iniObj, path){
        const info = this._getItemRefAndKeyFromPath(iniObj, path);
        return info.ref[info.key];
    }

    /**
     * @param {object} iniObj
     * @param {string} path
     * @return {object|undefined}
     */
    _getItemRefAndKeyFromPath(iniObj, path){

        //FIXES
        const fixSection = (section)=>{
            //No empty key
            if(section[''] !== undefined){
                delete section[''];
            }
        };

        if(path.length === 0){
            return;
        }

        if(path.length === 1){
            iniObj[ path[0] ] = value;
            return;
        }

        //Only allow 1 level of header([...]). Expect all headers to already exist.
        let ref;
        let key;
        if(iniObj[ path[0] ]){
            fixSection(iniObj[ path[0] ]);
            key = path.slice(1).join('.');
            ref = iniObj[ path[0] ];
        }else{
            key = path.slice('.');
            ref = iniObj;
        }

        return {
            ref: ref,
            key: key
        };
    }
    
    /**
     * @param {object} iniObj
     * @param {string} path
     * @param {*} value
     */
    _setItemFromPath(iniObj, path, value){
        const info = _getItemRefAndKeyFromPath(iniObj, path);
        info.ref[info.key] = value;
    }

    _log(...args){
        console.log('\n\n---------------\n');
        console.log(...args);
        console.log('\n\n');
    }
}
module.exports = IniHelper;