class QueryBuilder {

    setObj: any = {}
    pushObj: any = {}
    incObj: any = {}

    constructor() { }

    set = (obj: any) => { this.setObj = { ...this.setObj, ...obj } }
    push = (obj: any) => { this.pushObj = { ...this.pushObj, ...obj } }
    inc = (obj: any) => { this.incObj = { ...this.incObj, ...obj } }

    build = () => {
        let combined: any
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
}

function isObjEmpty(obj: any) {
    return Object.keys(obj).length === 0;
}

export default QueryBuilder