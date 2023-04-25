class QueryBuilder<T> {

    setObj: (Partial<T> & Mongo.Dictionary<any>) = {}
    pushObj: (Mongo.PushModifier<T> & Mongo.Dictionary<any>) = {}
    incObj: (Mongo.PartialMapTo<T, number> & Mongo.Dictionary<number>) = {}

    constructor() { }

    set = (obj: (Partial<T> /*& Mongo.Dictionary<any>*/)) => { this.setObj = { ...this.setObj, ...obj } }
    push = (obj: (Mongo.PushModifier<T> & Mongo.Dictionary<any>)) => { this.pushObj = { ...this.pushObj, ...obj } }
    inc = (obj: (Mongo.PartialMapTo<T, number> & Mongo.Dictionary<number>)) => { this.incObj = { ...this.incObj, ...obj } }

    build = () => {
        let combined: Mongo.Modifier<T> = {}
        if(!isObjEmpty(this.setObj)) {
            combined = { ...combined, $set: this.setObj }
        }
        if(!isObjEmpty(this.pushObj)) {
            combined = { ...combined, $push: this.pushObj }
        }
        if(!isObjEmpty(this.incObj)) {
            combined = { ...combined, $inc: this.incObj }
        }

        return combined
    }

    updateCache = (obj: any) => {
        if(!isObjEmpty(this.setObj)) {
            Object.keys(this.setObj).forEach(key => {
                if(key.includes('.')) {
                    return
                }
                obj[key] = this.setObj[key]
            })
        }
        /*if(!isObjEmpty(this.pushObj)) {
            Object.keys(this.pushObj).forEach(key => {
                if(key.includes('.')) {
                    return
                }
                console.log(`key ${key}`)
                obj[key].push(this.pushObj[key])
            })
        }
        if(!isObjEmpty(this.incObj)) {
            Object.keys(this.incObj).forEach(key => {
                if(key.includes('.')) {
                    return
                }
                obj[key] += this.incObj[key]
            })
        }*/
    }
}

function isObjEmpty(obj: any) {
    return Object.keys(obj).length === 0;
}

export default QueryBuilder