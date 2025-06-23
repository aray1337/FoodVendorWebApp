// Web storage utility that mimics react-native-storage API using localStorage
class WebStorage {
  constructor(config = {}) {
    this.size = config.size || 1000;
    this.defaultExpires = config.defaultExpires || null;
    this.enableCache = config.enableCache !== false;
    this.cache = {};
  }

  save({ key, data, expires = null }) {
    return new Promise((resolve, reject) => {
      try {
        const item = {
          data,
          expires: expires || this.defaultExpires,
          timestamp: Date.now()
        };

        localStorage.setItem(key, JSON.stringify(item));
        
        if (this.enableCache) {
          this.cache[key] = item;
        }
        
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }

  load({ key }) {
    return new Promise((resolve, reject) => {
      try {
        // Check cache first
        if (this.enableCache && this.cache[key]) {
          const item = this.cache[key];
          if (!this.isExpired(item)) {
            resolve(item.data);
            return;
          } else {
            delete this.cache[key];
          }
        }

        // Load from localStorage
        const stored = localStorage.getItem(key);
        if (!stored) {
          reject(new Error(`Data for key "${key}" not found`));
          return;
        }

        const item = JSON.parse(stored);
        
        if (this.isExpired(item)) {
          localStorage.removeItem(key);
          reject(new Error(`Data for key "${key}" has expired`));
          return;
        }

        if (this.enableCache) {
          this.cache[key] = item;
        }

        resolve(item.data);
      } catch (error) {
        reject(error);
      }
    });
  }

  remove({ key }) {
    return new Promise((resolve, reject) => {
      try {
        localStorage.removeItem(key);
        if (this.enableCache) {
          delete this.cache[key];
        }
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }

  isExpired(item) {
    if (!item.expires) return false;
    return Date.now() - item.timestamp > item.expires;
  }
}

const storage = new WebStorage({
  size: 1000,
  defaultExpires: null,
  enableCache: true,
});

export default storage;
