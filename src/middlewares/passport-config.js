/**
 * Functional Module for user authentication
 * @author Chinedu Ekene Okpala <allstackdev@gmail.com>
 */
module.exports.name = 'passport-config'
module.exports.dependencies = ['passport', 'passport-local', 'passport-jwt', 'UserModel', 'envs']
module.exports.factory = (passport, passportLocal, passportJWT, UserModel, envs) => {
  const LocalStrategy = passportLocal.Strategy
  const JWTStrategy = passportJWT.Strategy
  const ExtractJWT = passportJWT.ExtractJwt

  const { secret } = envs(process.env.NODE_ENV)

  passport.serializeUser((user, done) => {
    done(null, user.email)
  })

  passport.deserializeUser(async (email, done) => {
    try {
      const user = await UserModel.findOne(email)
      if (!user) {
        return done(new Error({ message: 'User not found!' }))
      }
      done(null, user)
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
        let user
        try {
          user = await UserModel.findOne({ email: username })
          if (!user) {
            return done(null, false, { message: 'Incorrect email or password' })
          }
        } catch (e) {
          return done({ message: e }, null)
        }

        const match = await user.comparePassword(password)
        if (!match) return done(null, false, { message: 'Incorrect email or password' })
        if (!user.isVerified) {
          return done(null, false, { message: 'Your account has not been verified.' })
        }
        return done(null, user)
      }
    )
  )

  passport.use(
    new JWTStrategy(
      { jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(), secretOrKey: secret },
      async (jwtPayload, done) => {
        if (jwtPayload.access === 'auth') {
          try {
            const user = await UserModel.findById(jwtPayload._id)
            return done(null, user)
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
