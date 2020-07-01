const axios = require('axios').default
const Redis = require('ioredis')
const redis = new Redis() // uses defaults unless given configuration object

async function init() {
  const res = await axios.post(
    'http://127.0.0.1:52521',
    JSON.stringify({ id: 0, method: 'getLatestBlock' })
  )

  const block = await res.data.result
  await saveBlock(block, true)

  console.log('start syncing')
  await sync(block)
}

async function updateStats() {
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

  // const now = (Date.now() / 1000) | 0
  console.log('stats updated')

  // await redis.set('ng:explorer:stats:' + now, JSON.stringify(stats))
  // await redis.expire('ng:explorer:stats:' + now, 60 * 60 * 24) // expire in one day

  await redis.hset('ng:explorer:latest', 'stats', JSON.stringify(stats))
}

async function sync(entranceBlock) {
  if (entranceBlock.prevBlockHash === '') {
    return
  }

  const result = await redis.hget(
    'ng:explorer:block:hash',
    entranceBlock.prevBlockHash
  )
  console.log('inputed ' + entranceBlock.prevBlockHash)
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
      console.error(err)
    }

    const block = await res.data.result
    await saveBlock(block, false)
    await sync(block)
  }
}

async function blockLoop() {
  const res = await axios.post(
    'http://127.0.0.1:52521',
    JSON.stringify({ id: 0, method: 'getLatestBlock' })
  )
  // handle success
  const block = await res.data.result
  await saveBlock(block, true)

  console.log('updated latest block' + block.hash)

  const result = await redis.hget('ng:explorer:block:hash', block.prevBlockHash)
  if (result == null || result.length === 0) {
    sync(block)
  }
}

async function saveBlock(block, latest = false) {
  const ppl = redis.pipeline()

  if (latest) {
    ppl.hset('ng:explorer:latest', 'height', block.height)
    ppl.hset('ng:explorer:latest', 'hash', block.hash)
  }

  const txs = block.txs
  block.txs = []
  txs.forEach(tx => {
    ppl.hset('ng:explorer:tx:hash', tx.hash, JSON.stringify(tx))
    ppl.zadd('ng:explorer:account:tx', tx.convener, tx.hash)
    ppl.hset('ng:explorer:tx:block', tx.hash, block.hash)
    block.txs.push(tx.hash)
  })

  ppl.hset('ng:explorer:block:height', block.height, block.hash)
  ppl.hset('ng:explorer:block:hash', block.hash, JSON.stringify(block))

  ppl.exec(_err => {})
}

main()
async function main() {
  await init()
  await updateStats()
  setInterval(updateStats, 1000)
  setInterval(blockLoop, 1000)
}
