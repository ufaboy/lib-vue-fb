<template v-slot:default="dataProps">
  <form class="edit-genre" @submit.prevent="sendGenre">
    <header class="header">
      <h1>Genre</h1>
      <button v-if="username === 'admin'"
              type="button"
              class="btn-switch btn"
              :class="{'active': genre.ad}"
              @click="localGenre.genre.ad = !genre.ad">ad
      </button>
      <button class="close-btn" type="reset" @click="closeModal">
        <base-icon class="icon" icon-name="close">
          <icon-close/>
        </base-icon>
      </button>
    </header>
    <label class="label">
      <span class="title">name</span>
      <input type="text" class="value" v-model.trim="localGenre.name" autofocus>
    </label>
    <label class="label">
      <span class="title">description</span>
      <textarea class="value textarea" v-model.trim="localGenre.description" rows="5"></textarea>
    </label>
    <label class="label">
      <span class="title">division</span>
      <select class="select value" v-model="localGenre.division">
        <option v-for="(division, index) of divisions" :key="index" :value="division.name">{{ division.name }}</option>
      </select>
    </label>
    <footer class="footer">
      <button class="negative-btn" type="reset" @click="deleteGenre">Удалить</button>
      <button class="positive-btn">Сохранить</button>
    </footer>
  </form>
</template>

<script>
import {collection, doc, addDoc, updateDoc , getDocs} from "firebase/firestore";
import {db} from '@/firebase.js'
import IconClose from "@/components/icons/IconClose"

export default {
  name: "EditGenre",
  components: {IconClose},
  emits: ['update-genres'],
  props: {
    genre: Object,
    dataProps: Object,
  },
  data: () => ({
    localGenre: {
      id: null,
      name: null,
      description: null,
      division: null,
      ad: null,
    },
    divisions: []
  }),
  computed: {
    username() {
      return this.$store.state.user.username
    }
  },
  watch: {},
  created() {
    this.prepareGenre()
    this.loadDivisions()
  },
  mounted() {
    this.getGenres()
  },
  methods: {
    async sendGenre() {
      try {
        let result;
        const genreForm = {name: this.localGenre.name, description: this.localGenre.description, division: this.localGenre.division, ad: this.localGenre.ad}
        console.log({genreForm: genreForm, id: this.genre.id})
        if (this.genre.id) {
          const washingtonRef = doc(db, "genres", this.genre.id);
          await updateDoc(washingtonRef, {...genreForm});
        } else {
          result = await addDoc(collection(db, "genres"), {...genreForm});
        }

        this.$emit('update-genres', result)
        this.closeModal();
      } catch (e) {
        console.error("Error adding document: ", e);
      }
    },
    async getGenres() {
      console.log({db: db})
      const querySnapshot = await getDocs(collection(db, "genres"));
      querySnapshot.forEach((doc) => {
        console.log(`${doc.id} => ${doc.data()}`);
      });
    },
    // async sendGenre() {
    //   if (!this.localGenre.name) {
    //     this.$toast.error('name not specified')
    //     return;
    //   }
    //   let result, url = `/genre/create`;
    //   const formData = {
    //     name: this.localGenre.name,
    //     description: this.localGenre.description,
    //     ad: this.localGenre.ad,
    //   }
    //   if (this.localGenre.parent_id) {
    //     formData.parent_id = this.localGenre.parent_id
    //   }
    //    if (this.localGenre.id) {
    //     url = `/genre/update?id=${this.genre.id}`
    //     result = await this.$patch(url, formData)
    //   } else {
    //     result = await this.$post(url, formData)
    //   }
    //   if (result) {
    //
    //     this.$emit('update-genres')
    //     this.closeModal();
    //   }
    // },
    async deleteGenre() {
      if (!this.genre.parent_id) {
        return false;
      }
      const url = `/genre/delete?id=${this.genre.id}`
      const result = await this.$delete(url)
      if (result) {
        this.$store.dispatch('genre/loadGenre')
        this.closeModal();
      }
    },
    selectGenre(genre) {
      this.parent = genre
    },
    clearGenre() {
      this.parent = {id: null, name: null}
    },
    closeModal() {
      this.$parent.hide('editGenre', this)
    },
    prepareGenre() {
      this.localGenre = Object.assign({}, this.genre)
    },
    async loadDivisions() {
      const divisions = await getDocs(collection(db, "divisions"));
      divisions.forEach((doc) => {
        this.divisions.push(doc.data())
      });
    },
  },
}
</script>

<style lang="scss">
.edit-genre {
  padding: 1rem;
  display: flex;
  flex-flow: wrap;
  height: 100%;
  width: 100%;
  color: var(--text2);

  .header {
    margin-bottom: 1rem;
    width: 100%;
    display: flex;
    justify-content: space-between;
  }


  .footer {
    display: flex;
    width: 100%;
    justify-content: space-between;

    button:last-of-type {
      margin-right: 0;
    }
  }

}

</style>
