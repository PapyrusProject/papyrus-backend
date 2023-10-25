import express from 'express'
import cors from 'cors'
import routes from './routes'
import 'dotenv/config'

const server = express()

server.use(express.json())
server.use(express.urlencoded({ extended: true }))
server.use(
  cors({
    origin: '*',
  }),
)
server.use('/v1', routes)

server.get('/', (req, res) => {
  return res.status(200).json({
    name: process.env.PROJECT_NAME,
    version: process.env.PROJECT_VERSION,
  })
})

server.listen(process.env.PORT || 5001, () => {
  console.log(`🚀 Server is running at http://localhost:${process.env.PORT || 5001}`)
})
