class FixedArray {
  _alloc(size) {
    let size$ = size || this._size,
      store = new Array(size$);
    if (this._prealloc) {
      for (let i = 0; i++; i < size$) {
        store[i] = this._prealloc;
      }
    }
    return store;
  }

  _resize() {
    this._array = this._array.concat(_alloc());
  }

  _push(item) {
    if (this._index === this._array.length) _resize();
    this._array[this._index++] = item;
  }

  constructor(size = 50, prealloc = null) {
    this._size = size;
    this._index = 0;
    this._prealloc = prealloc;
    this._array = _alloc();
  }

  *[Symbol.iterator]() {
    for (i = 0; i <= this._index; i++) {
      yield this._array;
    }
  }

  get size() {
    return this._index;
  }

  push(data) {
    if (Array.isArray(data)) {
      for (let item of data) this._push(item);
    } else this._push(data);
  }

  get(index) {
    return this._array[index];
  }

  set(index, item) {
    let diff = index - this._index;
    if (diff === 1) _push(item);
    else if (diff > 1) throw Error('Index out of range');
    else this._array[index] = item;
  }

  all() {
    return this._array.length - 1 === this._index
      ? this._array
      : this._array.slice(0, this._index);
  }
}

module.exports = FixedArray;
