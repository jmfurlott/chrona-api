import { getRepository } from "typeorm";
import * as jwt from "jsonwebtoken";
import * as bcrypt from "bcryptjs";
import * as passport from "passport";
import { Strategy as JWTStrategy, ExtractJwt as ExtractJWT } from "passport-jwt";
import { Strategy as LocalStrategy } from "passport-local";

import { User } from "./entity/User";

export const initPassport = () => {
  const userRepository = getRepository(User);

  passport.serializeUser(async (user, done) => {
    done(null, user); // NOTE currently doing nothing with the user
  });

  passport.deserializeUser((user, done) => {
    done(null, user); // NOTE currently doing nothing with the user
  });

  passport.use(
    "signup",
    new LocalStrategy(
      { usernameField: "email", passwordField: "password" },
      async (email: string, password: string, done: Function) => {
        try {
          const salt = bcrypt.genSaltSync(10);
          const user = await userRepository.save({
            email,
            encrypted_password: bcrypt.hashSync(password, salt),
          });
          return done(null, user, "Success Registered");
        } catch (err) {
          return done(err);
        }
      },
    ),
  );

  passport.use(
    "login",
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
      },
      async (email: string, password: string, done: Function) => {
        try {
          // Find the user associated with the email provided by the user
          const user = await userRepository.findOne({ email, archived: false });
          if (!user) {
            // If the user isn't found in the database, return a message
            return done(null, false, { message: "User not found" });
          }

          // Validate password and make sure it matches with the corresponding
          // hash stored in the database If the passwords match, it returns a
          // value of true.
          const isValid = bcrypt.compareSync(password, user.encrypted_password);
          if (!isValid) {
            return done(null, false, { message: 'Wrong Password' });
          }

          // Send the user information to the next middleware
          return done(null, user, { message: "Logged in Successfully" });
        } catch (error) {
          return done(error);
        }
      },
    ),
  );
};

export const authRoutes = app => {
};
