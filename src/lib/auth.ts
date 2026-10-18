// // import { betterAuth } from "better-auth";
// // import { MongoClient } from "mongodb";
// // import { mongodbAdapter } from "@better-auth/mongo-adapter";

// // const client = new MongoClient(process.env.MONGODB_URL as string);
// // const db = client.db("deshi-bazardor");

// // export const auth = betterAuth({
// //     emailAndPassword: {
// //         enabled: true
// //     },
// //   database: mongodbAdapter(db, {
// //     client
// //   }),
// // });





// import { betterAuth } from "better-auth";
// import { MongoClient } from "mongodb";
// import { mongodbAdapter } from "better-auth/adapters/mongodb";

// // ✅ পরিবেশ ভেরিয়েবল পরীক্ষা
// if (!process.env.MONGODB_URL) {
//   throw new Error("❌ MONGODB_URL নেই .env ফাইলে!");
// }
// if (!process.env.BETTER_AUTH_SECRET) {
//   throw new Error("❌ BETTER_AUTH_SECRET নেই .env ফাইলে!");
// }
// if (!process.env.BETTER_AUTH_URL) {
//   throw new Error("❌ BETTER_AUTH_URL নেই .env ফাইলে!");
// }

// const client = new MongoClient(process.env.MONGODB_URL);
// const db = client.db("deshi-bazardor");

// export const auth = betterAuth({
//   secret: process.env.BETTER_AUTH_SECRET,
//   baseURL: process.env.BETTER_AUTH_URL,

//   emailAndPassword: {
//     enabled: true,
//     autoSignIn: true,
//   },

//   database: mongodbAdapter(db),
// });





// import { betterAuth } from "better-auth";
// import { MongoClient } from "mongodb";
// import { mongodbAdapter } from "better-auth/adapters/mongodb"; // ✅ সঠিক পথ
// import { google, github } from "better-auth/social-providers"; // ✅ পৃথকভাবে ইমপোর্ট

// // পরিবেশ ভেরিয়েবল চেক
// if (!process.env.MONGODB_URI) {
//   throw new Error("❌ MONGODB_URI নেই .env ফাইলে!");
// }
// if (!process.env.BETTER_AUTH_SECRET) {
//   throw new Error("❌ BETTER_AUTH_SECRET নেই .env ফাইলে!");
// }
// if (!process.env.BETTER_AUTH_URL) {
//   throw new Error("❌ BETTER_AUTH_URL নেই .env ফাইলে!");
// }

// const client = new MongoClient(process.env.MONGODB_URI);
// const db = client.db("bd-bazar");

// export const auth = betterAuth({
//   secret: process.env.BETTER_AUTH_SECRET,
//   baseURL: process.env.BETTER_AUTH_URL,

//   emailAndPassword: {
//     enabled: true,
//     autoSignIn: true, // ✅ সাইন আপের পর সরাসরি লগইন
//   },

//   user: {
//     additionalFields: {
//       image: {
//         type: "string",
//         required: false,
//       },
//     },
//   },

//   // ✅ সামাজিক লগইন — সঠিক ফরম্যাট
//   socialProviders: [
//     google({
//       clientId: process.env.GOOGLE_CLIENT_ID!,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
//       scope: ["openid", "email", "profile"],
//       mapProfileToUser: (profile) => ({
//         name: profile.name,
//         email: profile.email,
//         image: profile.picture,
//       }),
//     }),
//     github({
//       clientId: process.env.GITHUB_CLIENT_ID!,
//       clientSecret: process.env.GITHUB_CLIENT_SECRET!,
//       scope: ["user:email", "read:user"],
//       mapProfileToUser: (profile) => ({
//         name: profile.name || profile.login,
//         email: profile.email || "",
//         image: profile.avatar_url,
//       }),
//     }),
//   ],

//   database: mongodbAdapter(db),
// });


import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

if (!process.env.MONGODB_URL) {
  throw new Error("❌ MONGODB_URL নেই .env ফাইলে!");
}
if (!process.env.BETTER_AUTH_SECRET) {
  throw new Error("❌ BETTER_AUTH_SECRET নেই .env ফাইলে!");
}
if (!process.env.BETTER_AUTH_URL) {
  throw new Error("❌ BETTER_AUTH_URL নেই .env ফাইলে!");
}

const client = new MongoClient(process.env.MONGODB_URL);
const db = client.db("deshi-bazardor");

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL,

  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
  },

  user: {
    additionalFields: {
      image: {
        type: "string",
        required: false,
      },
    },
  },

  // ✅ সঠিক ফরম্যাট — সরাসরি প্রোভাইডার অপশন দিন
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      scope: ["openid", "email", "profile"],
      mapProfileToUser: (profile) => ({
        name: profile.name,
        email: profile.email,
        image: profile.picture,
      }),
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      scope: ["user:email", "read:user"],
      mapProfileToUser: (profile) => ({
        name: profile.name || profile.login,
        email: profile.email || "",
        image: profile.avatar_url,
      }),
    },
  },

  database: mongodbAdapter(db),
});