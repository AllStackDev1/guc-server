/**
 * @author Chinedu Ekene Okpala <allstackdev@gmail.com>
 * @description
 * This Factory handles database environment selection and
 * also creates a connection string for connecting to a
 * particular database based on the environment
 */

module.exports.name = 'Database'
module.exports.dependencies = ['envs']
module.exports.factory = getEnvs => {
  /**
   * Determines the configuration settings to use based
   * on the database environment
   */
  const configureDB = () => {
    // configuration object

    const { dbUrl, dbName } = getEnvs

    return dbUrl + '/' + dbName + '?retryWrites=true&w=majority'
  }

  return { configureDB }
}
