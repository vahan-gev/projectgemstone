class Scene {
  constructor(objects = []) {
    this.objects = objects;
  }

  add(object) {
    this.objects.push(object);
  }

  remove(object) {
    this.objects = this.objects.filter(obj => obj?.id !== object?.id);
  }

  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/iterator
  [Symbol.iterator]() {
    let index = -1;
    const data = this.objects;

    return {
      next: () => ({ value: data[++index], done: !(index in data) })
    };
  }

  forEach(callback) {
    for (const obj of this.objects) {
      callback(obj);
    }
  }
}

export { Scene }