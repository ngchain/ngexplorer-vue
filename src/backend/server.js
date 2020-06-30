const Redis = require('ioredis')
const redis = new Redis()

const express = require('express')
const app = express()
const port = require('../config').port

const cors = require('cors')
app.use(cors())

app.get('/', async (req, res) => res.send('Hello NGIN!'))

app.get('/dashboard', async (req, res) => {
  const stats = await redis.hget('ng:explorer:latest', 'stats')
  res.send(stats)
})

app.get('/blocks', async (req, res) => {
  const blocks = []
  const latestHeight = await redis.hget('ng:explorer:latest', 'height')
  for (let h = latestHeight; h > latestHeight - 50; h--) {
    const jsonBlock = await redis.hget('ng:explorer:block:height', h)
    blocks.push(JSON.parse(jsonBlock))
  }

  res.send(blocks)
})

app.get('/block/:hashOrHeight', async (req, res) => {
  const hashOrHeight = req.params.hashOrHeight

  if (hashOrHeight == null || hashOrHeight.length === 0) {
    res.sendStatus(404)
    return
  }

  let block
  try {
    block = getBlockByHashOrHeight(hashOrHeight)
  } catch (e) {
    res.sendStatus(400)
    return
  }

  res.send(block)
})

app.get('/tx/:txHash/block', async (req, res) => {
  const txHash = req.params.txHash

  if (txHash == null || txHash.length !== 64) {
    res.sendStatus(404)
    return
  }

  const blockHash = await redis.hget('ng:explorer:tx:block', txHash)
  if (blockHash == null || blockHash.length === 0) {
    res.sendStatus(404)
    return
  }

  res.send(blockHash)
})

async function getBlockByHashOrHeight(hashOrHeight) {
  let block
  if (hashOrHeight.length === 64) {
    block = await redis.hget('ng:explorer:block:hash', hashOrHeight)
  } else {
    const blockHash = await redis.hget('ng:explorer:block:height', hashOrHeight)
    block = await redis.hget('ng:explorer:block:hash', blockHash)
  }

  const txHashes = block.txs
  block.txs = []
  txHashes.forEach(txHash => {
    const tx = getTxByHash(txHash)
    block.txs.push(tx)
  })

  return block
}

async function getTxByHash(txHash) {
  const jsonTx = await redis.hget('ng:explorer:tx:hash', txHash)
  if (jsonTx == null || jsonTx.length === 0) {
    throw Error()
  }

  return JSON.parse(jsonTx)
}

app.listen(port, () =>
  console.log(`Explorer listening at http://127.0.0.1:${port}`)
)
