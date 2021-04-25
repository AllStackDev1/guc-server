/**
 * Functional Module for admin authentication
 * @author Chinedu Ekene Okpala <allstackdev@gmail.com>
 */
module.exports.name = 'passport-config'
module.exports.dependencies = ['passport', 'passport-local', 'passport-jwt', 'AdminModel', 'envs']
module.exports.factory = (passport, passportLocal, passportJWT, AdminModel, envs) => {
  const LocalStrategy = passportLocal.Strategy
  const JWTStrategy = passportJWT.Strategy
  const ExtractJWT = passportJWT.ExtractJwt

  const { secret } = envs(process.env.NODE_ENV)

  passport.serializeUser((admin, done) => {
    done(null, admin.email)
  })

  passport.deserializeUser(async (email, done) => {
    try {
      const admin = await AdminModel.findOne(email)
      if (!admin) {
        return done(new Error({ message: 'Admin not found!' }))
      }
      done(null, admin)
    } catch (e) {
      done(e)
    }
  })

  passport.use(
    new LocalStrategy(
      {
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
      },
      async (req, username, password, done) => {
        let admin
        try {
          admin = await AdminModel.findOne({ email: username })
          if (!admin) {
            return done(null, false, { message: 'Incorrect email or password' })
          }
        } catch (error) {
          return done({ message: error }, null)
        }

        const match = await admin.comparePassword(password)
        if (!match) return done(null, false, { message: 'Incorrect email or password' })
        return done(null, admin)
      }
    )
  )

  passport.use(
    new JWTStrategy(
      { jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(), secretOrKey: secret },
      async (jwtPayload, done) => {
        if (jwtPayload.access === 'auth') {
          try {
            const admin = await AdminModel.findById(jwtPayload._id)
            return done(null, admin)
          } catch (error) {
            done({ message: error })
          }
        } else {
          return done({ message: 'Token access invalid' })
        }
      }
    )
  )

  return passport
}
