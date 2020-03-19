export {}

declare global {
  interface Array<T> {
    any(predicate?: (obj: T) => boolean): boolean,
    sum(selector: (obj: T) => number): number
    average(selector: (obj: T) => number): number
  }
}

Array.prototype.any = function <T>(predicate?: (obj:T) => boolean) {
    return ! predicate ? this.length > 0 : this.filter(predicate).length > 0
}

Array.prototype.sum = function <T>(selector: (obj: T) => number) {
    let total = 0
    for (const item of this)
        total += selector(item)
    return total
}

Array.prototype.average = function <T>(selector: (obj: T) => number) {
    return this.sum(selector) / this.length
}
