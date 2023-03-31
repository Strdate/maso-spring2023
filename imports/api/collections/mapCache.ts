interface MapCache {
    _id: string
    gameId: string
    [key: `bucket${string}`]: string[]
}

const MapCacheCollection = new Mongo.Collection<MapCache>('mapCache');

export { MapCache, MapCacheCollection }