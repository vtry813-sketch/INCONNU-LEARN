const GitHubStrategy = require('passport-github2').Strategy;
const User = require('../models/User');

const githubOAuthConfig = {
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: process.env.GITHUB_CALLBACK_URL || '/auth/github/callback'
};

const githubStrategy = new GitHubStrategy(githubOAuthConfig,
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Find or create user
      let user = await User.findOne({ githubId: profile.id });
      
      if (!user) {
        user = await User.findOne({ email: profile.emails[0].value });
        
        if (user) {
          // Link GitHub account to existing user
          user.githubId = profile.id;
          user.avatar = profile.photos[0].value;
          await user.save();
        } else {
          // Create new user
          user = new User({
            name: profile.displayName || profile.username,
            email: profile.emails[0].value,
            githubId: profile.id,
            avatar: profile.photos[0].value,
            coins: 25
          });
          await user.save();
        }
      }
      
      return done(null, user);
    } catch (error) {
      return done(error, null);
    }
  }
);

module.exports = githubStrategy;
