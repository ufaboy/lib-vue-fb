// export const authMiddleware = async (to, from, next) => {
//   if (store.state.user) {
//     next();
//   } else {
//     try {
//       const user = await apiRequest();
//       await store.dispatch("setUser", user);
//       if (to.path === "/login") {
//         next("/");
//       } else {
//         next();
//       }
//     } catch (error) {
//       if (to.path !== "/login") {
//         next("/login");
//       } else {
//         next();
//       }
//     }
//   }
//
// };

import {getAuth, onAuthStateChanged} from "firebase/auth";

const authMiddleware = async function () {
    let user = null
    const auth = getAuth();
    await onAuthStateChanged(auth, async function (result) {
        user = result
    })
    console.log({'authMiddleware user': user})
    return user
}
export default authMiddleware