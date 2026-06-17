const cache = new Map();

const getCacheKey = (key) => {
  const cached = cache.get(key);
  if (cached && cached.expiry > Date.now()) {
    return cached.value;
  }
  cache.delete(key);
  return null;
};

const setCacheKey = (key, value, ttl = 5 * 60 * 1000) => {
  cache.set(key, {
    value,
    expiry: Date.now() + ttl
  });
};

const clearCache = (pattern) => {
  if (pattern) {
    for (const key of cache.keys()) {
      if (key.includes(pattern)) cache.delete(key);
    }
  } else {
    cache.clear();
  }
};

module.exports = { getCacheKey, setCacheKey, clearCache };
