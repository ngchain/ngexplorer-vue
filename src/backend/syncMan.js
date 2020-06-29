const axios = require('axios').default
const Redis = require('ioredis')
const redis = new Redis() // uses defaults unless given configuration object

main(init, loop)

async function main (init, blockLoop) {
  await init()
  await updateStats()
  setInterval(await updateStats, 1000)
  setInterval(await blockLoop, 1000)
}

async function init () {
  const res = await axios.post(
    'http://127.0.0.1:52521',
    JSON.stringify({ id: 0, method: 'getLatestBlock' })
  )
  // handle success
  console.log(res)

  const block = await res.data.result
  await saveBlock(block, true)

  console.log('start syncing')
  await sync(block)
}

async function updateStats () {
  const stats = {}
  {
    const res = await axios.post(
      'http://127.0.0.1:52521',
      JSON.stringify({ id: 0, method: 'getPeers' })
    )
    stats.peers = res.data.result
  }

  {
    const res = await axios.post(
      'http://127.0.0.1:52521',
      JSON.stringify({ id: 0, method: 'getNetwork' })
    )
    stats.network = res.data.result
  }

  {
    let res = await axios.post(
      'http://127.0.0.1:52521',
      JSON.stringify({ id: 0, method: 'getLatestBlock' })
    )
    const block = res.data.result
    res = await axios.post(
      'http://127.0.0.1:52521',
      JSON.stringify({
        id: 0,
        method: 'getBlockByHeight',
        params: { height: block.height - 1 }
      })
    )
    const prevBlock = res.data.result
    stats.height = block.height
    stats.difficulty = parseInt(block.difficulty)
    stats.hashrate =
      prevBlock.difficulty / (block.timestamp - prevBlock.timestamp)
  }

  console.log('new stats', stats)
  await redis.hset(
    'ng:explorer:stats',
    (Date.now() / 1000) | 0,
    JSON.stringify(stats)
  )
  await redis.hset('ng:explorer:latest', 'stats', JSON.stringify(stats))
}

async function sync (entranceBlock) {
  if (entranceBlock.prevBlockHash === '') {
    return
  }

  const result = await redis.hget(
    'ng:explorer:block:hash',
    entranceBlock.prevBlockHash
  )
  console.log(entranceBlock.prevBlockHash)
  if (result == null || result.length === 0) {
    let res
    try {
      res = await axios.post(
        'http://127.0.0.1:52521',
        JSON.stringify({
          id: 0,
          method: 'getBlockByHash',
          params: { hash: entranceBlock.prevBlockHash }
        })
      )
    } catch (err) {
      console.log(
        err,
        JSON.stringify({
          id: 0,
          method: 'getBlockByHash',
          params: { hash: entranceBlock.prevBlockHash }
        })
      )
    }

    const block = await res.data.result
    await saveBlock(block, false)
    await sync(block)
  }
}

async function loop () {
  const res = await axios.post(
    'http://127.0.0.1:52521',
    JSON.stringify({ id: 0, method: 'getLatestBlock' })
  )
  // handle success
  const block = await res.data.result
  await saveBlock(block, true)

  console.log('updated latest block', block.hash)

  const result = await redis.hget('ng:explorer:block:hash', block.prevBlockHash)
  if (result == null || result.length === 0) {
    sync(block)
  }
}

async function saveBlock (jsonBlock, latest = false) {
  const ppl = redis.pipeline()

  if (latest) {
    ppl.hset('ng:explorer:latest', 'height', jsonBlock.height)
    ppl.hset('ng:explorer:latest', 'hash', jsonBlock.hash)
  }

  jsonBlock.txs.forEach(tx => {
    ppl.hset('ng:explorer:tx:hash', tx.hash, JSON.stringify(tx))
    ppl.hset('ng:explorer:account:' + tx.convener, tx.hash, JSON.stringify(tx))
    ppl.hset('ng:explorer:tx:block', tx.hash, jsonBlock.hash)
  })

  ppl.hset(
    'ng:explorer:block:height',
    jsonBlock.height,
    JSON.stringify(jsonBlock)
  )
  ppl.hset('ng:explorer:block:hash', jsonBlock.hash, JSON.stringify(jsonBlock))

  ppl.exec((_err) => {})
}
