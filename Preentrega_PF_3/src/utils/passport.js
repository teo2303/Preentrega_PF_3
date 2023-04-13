import passport from 'passport'

export const strategyPassport = strategy => {
  return async (req, res, next) => {
    passport.authenticate(strategy, async (err, user, info) => {
      if (err) res.status(err.status ? err.status : 401).json(err)
      if (!user) {
        if (info !== undefined) return !info.status ? res.status(401).json(info) : res.status(info.status).json(info)
      }
      req.user = user
      next()
    })(req, res, next)
  }
}
