export default function readFormData(el: Element) {
    const data = new FormData(el as HTMLFormElement)
    const res = {} as any
    data.forEach((value, key) => res[key] = value)
    return res
}