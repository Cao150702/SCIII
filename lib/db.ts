import mysql from 'mysql2/promise'

export type DbConfig = {
  host: string
  user: string
  password: string
  database: string
  port: number
  connectionLimit: number
  ssl?: mysql.SslOptions
}

let pool: mysql.Pool | null = null

export function getDbConfig(): DbConfig | null {
  const host = process.env.MYSQL_HOST
  const user = process.env.MYSQL_USER
  const password = process.env.MYSQL_PASSWORD
  const database = process.env.MYSQL_DATABASE

  if (!host || !user || !password || !database) {
    return null
  }

  const port = Number(process.env.MYSQL_PORT || 3306)
  const connectionLimit = Number(process.env.MYSQL_CONNECTION_LIMIT || 10)

  let ssl: mysql.SslOptions | undefined
  if (process.env.MYSQL_SSL === 'true') {
    ssl = {
      rejectUnauthorized: process.env.MYSQL_SSL_REJECT_UNAUTHORIZED !== 'false'
    }
  }

  return { host, user, password, database, port, connectionLimit, ssl }
}

export function getPool(): mysql.Pool {
  if (pool) return pool

  const config = getDbConfig()
  if (!config) {
    throw new Error('Missing MySQL config. Set MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE.')
  }

  pool = mysql.createPool({
    host: config.host,
    user: config.user,
    password: config.password,
    database: config.database,
    port: config.port,
    connectionLimit: config.connectionLimit,
    ssl: config.ssl,
    waitForConnections: true,
    enableKeepAlive: true
  })

  return pool
}

export async function query<T = any>(sql: string, params?: any[]): Promise<T[]> {
  const pool = getPool()
  const [rows] = await pool.query(sql, params)
  return rows as T[]
}
