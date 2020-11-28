exports.formatHashrates = hs => {
  if (hs < 1000) {
    return hs.toFixed(2) + 'h/s'
  } else if (hs < 1000 * 1000) {
    return (hs / 1000).toFixed(2) + 'kh/s'
  } else if (hs < 1000 * 1000 * 1000) {
    return (hs / (1000 * 1000)).toFixed(2) + 'mh/s'
  } else if  (hs < 1000 * 1000 * 1000 * 1000) {
    return (hs / (1000 * 1000 * 1000)).toFixed(2) + 'gh/s'
  }

  return hs.toLocaleString('en-US', {maximumFractionDigits:2}) + 'gh/s'
}

exports.formatDifficulty = diff => {
  return diff.toLocaleString()
}

exports.formatHeight = height => {
  return height.toLocaleString()
}

exports.timestampReadable = ts => {
  const now = (Date.now() / 1000) | 0
  if (ts === now) {
    return 'now'
  }

  if (ts > now) {
    const delta = ts - now
    if (delta < 60) {
      return 'after ' + delta + ' seconds'
    }

    if (delta < 60 * 60) {
      return 'after ' + ((delta / 60) | 0) + ' minutes'
    }

    return 'after ' + ((delta / (60 * 60)) | 0) + ' hours'
  }

  if (ts < now) {
    const delta = now - ts
    if (delta < 60) {
      return delta + ' seconds ago'
    }

    if (delta < 60 * 60) {
      return ((delta / 60) | 0) + ' minutes ago'
    }

    return ((delta / (60 * 60)) | 0) + ' hours ago'
  }
}
