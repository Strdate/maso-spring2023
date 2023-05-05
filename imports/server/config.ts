import { gameCache } from "./dbCache";

interface ServerConfigDB {
    defaultGame: string
    enforceLoginAffinity: boolean
    servers: ServerConfigList[]
}

interface ServerConfig extends ServerConfigDB {
    _self: string
}

interface ServerConfigList {
    ident: string
    url: string
}

const defaultCfg: ServerConfigDB = {
    defaultGame: '',
    enforceLoginAffinity: false,
    servers: [{
        ident: "SERVER1",
        url: ""
    }]
}

const ConfigCollection = new Mongo.Collection<ServerConfigDB>('serverConfig');

function getServerConfig(): ServerConfig {
    let config: ServerConfig | undefined = gameCache.rawCache().get('cfg')
    if(!config) {
        let cfgDB: ServerConfigDB | undefined = ConfigCollection.findOne()
        //console.log('Found cfg: ', cfgDB)
        if(!cfgDB) {
            ConfigCollection.insert(defaultCfg)
            cfgDB = defaultCfg
        }
        config = {
            ...cfgDB!,
            _self: process.env.SERVER_IDENT ?? ""
        }
        cacheCfg(config)
    }
    return config
}

function cacheCfg(cfg: ServerConfigDB) {
    gameCache.rawCache().set('cfg', cfg, 15)
}

export { getServerConfig }