const passportJwt = require("passport-jwt");
const { Strategy, ExtractJwt } = passportJwt;
module.exports = (passport) => {
  const opts = {
    jwtFromRequest: ExtractJwt.fromHeader("w-access-token"),
    secretOrKey: String(process.env.JWT_SECRET),
  };
  const JwtStrategy = Strategy;
  const verifyCallback = async (jwt_payload, done) => {
    done(null, jwt_payload);
  };
  const jwtStrategy = new JwtStrategy(opts, verifyCallback);
  passport.use(jwtStrategy);
};
