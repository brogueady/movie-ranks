import neo4j from 'neo4j-driver'

export const driver = neo4j.driver('bolt://localhost', neo4j.auth.basic('neo4j', 'password'))

const shutDown = () => {
    driver.close()
}

process.addListener('1', () => shutDown())
process.on('SIGTERM', shutDown)
process.on('SIGINT', shutDown)
