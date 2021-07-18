<template>
  <div class="login-box">
    <div class="btn-tab">
      <button type="button" class="slide-btn" :class="{'active': !signMode}" @click="changeType(logIn)">LogIn</button>
      <button type="button" class="slide-btn" :class="{'active': signMode}" @click="changeType('signIn')">SignIn
      </button>
    </div>

    <form class="login-form" @submit.prevent="sendForm">
      <div class="user-box">
        <input id="login-email" type="email" class="input" required v-model.trim="email" autocomplete="off">
        <label class="label" for="login-email">Email</label>
      </div>
      <div class="user-box">
        <input id="login-pass" type="password" class="input" required v-model.trim="password" autocomplete="off">
        <label class="label" for="login-pass">Password</label>
      </div>
      <button class="login-btn">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        Submit
      </button>
    </form>
  </div>
</template>

<script>
// import {ref} from 'vue'
import firebaseApp from "@/firebase";
import {
  getAuth,
  // setPersistence,
  // browserSessionPersistence,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from "firebase/auth";

export default {
  name: "login",
  components: {},
  props: {},
  setup() {
    // const email = ref('')
    // const password = ref('')
    //
    // const sendForm() => {
    //   const auth = getAuth(firebaseApp);
    //   createUserWithEmailAndPassword(auth, email, password)
    //       .then((userCredential) => {
    //         // Signed in
    //         const user = userCredential.user;
    //         // ...
    //       })
    //       .catch((error) => {
    //         const errorCode = error.code;
    //         const errorMessage = error.message;
    //         // ..
    //       });
    // }
    // return {
    //   email, password, sendForm
    // }
  },
  data: () => ({
    email: '',
    password: '',
    signMode: false,
  }),
  methods: {
    async changeType(type) {
      this.signMode = type === 'signIn';
    },
    async sendForm() {
      const auth = getAuth(firebaseApp);
      if (this.signMode) {
        return createUserWithEmailAndPassword(auth, this.email, this.password)
            .then((userCredential) => {
              const user = userCredential.user;
              console.log({user: user})
              this.$router.push('/')
            })
            .catch((error) => {
              const errorCode = error.code;
              const errorMessage = error.message;
              console.log({
                createUserWithEmailAndPassword: error,
                errorCode: errorCode,
                errorMessage: errorMessage
              })
            });
      } else {
        return signInWithEmailAndPassword(auth, this.email, this.password)
            .then(() => {
              this.$router.push('/')
            })
            .catch((error) => {
              const errorCode = error.code;
              const errorMessage = error.message;
              console.log({signInWithEmailAndPassword: error, errorCode: errorCode, errorMessage: errorMessage})
            })
      }
        // setPersistence(auth, browserSessionPersistence)
        //     .then(() => {
        //       if (this.signMode) {
        //         return createUserWithEmailAndPassword(auth, this.email, this.password)
        //             .then((userCredential) => {
        //               const user = userCredential.user;
        //               console.log({user: user})
        //               this.$router.push('/')
        //             })
        //             .catch((error) => {
        //               const errorCode = error.code;
        //               const errorMessage = error.message;
        //               console.log({
        //                 createUserWithEmailAndPassword: error,
        //                 errorCode: errorCode,
        //                 errorMessage: errorMessage
        //               })
        //             });
        //       } else {
        //         return signInWithEmailAndPassword(auth, this.email, this.password)
        //             .then(() => {
        //               this.$router.push('/')
        //             })
        //             .catch((error) => {
        //               const errorCode = error.code;
        //               const errorMessage = error.message;
        //               console.log({signInWithEmailAndPassword: error, errorCode: errorCode, errorMessage: errorMessage})
        //             })
        //       }
        //     })
        //     .catch((error) => {
        //       const errorCode = error.code;
        //       const errorMessage = error.message;
        //       console.log({setPersistence: error, errorCode: errorCode, errorMessage: errorMessage})
        //     });
    },

    // async login() {
    //   const formData = {username: this.username, password: this.password};
    //   const response = await fetch(`${process.env.VUE_APP_API_URL}/auth/login`, {
    //     method: 'POST',
    //     body: JSON.stringify(formData),
    //     headers: {
    //       'Content-Type': 'application/json;charset=utf-8',
    //     }
    //   })
    //   if (response.ok) {
    //     const result = await response.json();
    //     if (result.token) {
    //       sessionStorage.setItem('lib-token', result.token)
    //       sessionStorage.setItem('lib-username', result.username)
    //       await this.$store.dispatch('user/setUser', result)
    //       await this.$router.push('/')
    //     } else this.$toast.error('Empty Token')
    //
    //   } else {
    //     const result = await response.json();
    //     this.$toast.error(result.message)
    //   }
    // },

  },
  computed: {},
  watch: {},
  created() {
    document.title = 'Login';
  },
  mounted() {
    this.setAuthPersistentMode
  },
  updated() {
  },
}
</script>

<style scoped lang="scss">
.login-box {
  position: absolute;
  z-index: 10;
  top: 50%;
  left: 50%;
  width: 22rem;
  padding: 2rem;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, .5);
  box-sizing: border-box;
  box-shadow: 0 15px 25px rgba(0, 0, 0, .6);
  border-radius: 10px;

  .header-title {
    margin: 0 0 30px;
    padding: 0;
    color: #fff;
    text-align: center;
  }

  .login-form {
    text-align: center;
  }

  .user-box {
    position: relative;

    .input {
      width: 100%;
      padding: 10px 0;
      font-size: 16px;
      color: #fff;
      margin-bottom: 30px;
      border: none;
      border-bottom: 1px solid #fff;
      outline: none;
      background: transparent;
    }

    .label {
      position: absolute;
      top: 0;
      left: 0;
      padding: 10px 0;
      font-size: 16px;
      color: #fff;
      pointer-events: none;
      transition: .5s;
    }

    .input:focus ~ .label, .input:valid ~ .label {
      top: -20px;
      left: 0;
      color: #03e9f4;
      font-size: 12px;
    }
  }

  .user-box:last-of-type {
    margin-bottom: 2rem;
  }

  .btn-tab {
    display: flex;
    flex-flow: row nowrap;
    justify-content: center;
    align-items: center;
    margin-bottom: 1rem;
  }

  .login-btn, .slide-btn {
    position: relative;
    display: inline-block;
    padding: 10px 20px;
    color: #03e9f4;
    background: transparent;
    font-size: 16px;
    text-decoration: none;
    text-transform: uppercase;
    overflow: hidden;
    transition: .5s;
    letter-spacing: 4px;
    cursor: pointer;
  }

  .login-btn:hover {
    background: #03e9f4;
    color: #fff;
    border-radius: 5px;
    box-shadow: 0 0 5px #03e9f4,
    0 0 25px #03e9f4,
    0 0 50px #03e9f4,
    0 0 100px #03e9f4;
  }

  .login-btn span {
    position: absolute;
    display: block;
  }

  .login-btn span:nth-child(1) {
    top: 0;
    left: -100%;
    width: 100%;
    height: 2px;
    background: linear-gradient(90deg, transparent, #03e9f4);
    animation: btn-anim1 1s linear infinite;
  }

  .login-btn span:nth-child(2) {
    top: -100%;
    right: 0;
    width: 2px;
    height: 100%;
    background: linear-gradient(180deg, transparent, #03e9f4);
    animation: btn-anim2 1s linear infinite;
    animation-delay: .25s
  }

  .login-btn span:nth-child(3) {
    bottom: 0;
    right: -100%;
    width: 100%;
    height: 2px;
    background: linear-gradient(270deg, transparent, #03e9f4);
    animation: btn-anim3 1s linear infinite;
    animation-delay: .5s
  }

  .login-btn span:nth-child(4) {
    bottom: -100%;
    left: 0;
    width: 2px;
    height: 100%;
    background: linear-gradient(360deg, transparent, #03e9f4);
    animation: btn-anim4 1s linear infinite;
    animation-delay: .75s
  }
}

@keyframes btn-anim1 {
  0% {
    left: -100%;
  }
  50%, 100% {
    left: 100%;
  }
}

@keyframes btn-anim2 {
  0% {
    top: -100%;
  }
  50%, 100% {
    top: 100%;
  }
}

@keyframes btn-anim3 {
  0% {
    right: -100%;
  }
  50%, 100% {
    right: 100%;
  }
}

@keyframes btn-anim4 {
  0% {
    bottom: -100%;
  }
  50%, 100% {
    bottom: 100%;
  }
}

.slide-btn {

}

.slide-btn.active {
  background: #10A0A7FF;
  color: #fff;
  //border-radius: 5px;
  //box-shadow: 0 0 5px #03e9f4,
  //0 0 25px #03e9f4,
  //0 0 50px #03e9f4,
  //0 0 100px #03e9f4;
}

@media only screen and (max-width: 892px) {
  .login-box {
  }
}

@media only screen and (min-width: 360px) and (max-width: 892px) and (orientation: landscape) {
  .login-box {
  }
}

@media only screen and (min-width: 360px) and (max-width: 892px) and (orientation: portrait) {
  .login-box {
    width: 80%;

  }
}
</style>