<template>
<main class="home">
  <nav class="nav">
    <router-link class="content-link"
               :to="{ name: 'list-genre', params: { name: genre.name }}"
               v-for="genre of divisions"
               :key="genre.id">{{ genre.name }}
    </router-link>
  </nav>
</main>
</template>

<script>
import { collection, getDocs } from "firebase/firestore";
import {db} from "../firebase";

export default {
  name: 'Home',
  components: {},
  props: {
  },
  data: () => ({
    divisions: []
  }),
  methods: {
    async loadDivisions() {
      const divisions = await getDocs(collection(db, "divisions"));
      divisions.forEach((doc) => {
        this.divisions.push(doc.data())
      });
    },
  },
  computed: {
    isDesktop() {
      return this.$store.state.main.isDesktop
    }
  },
  watch: {},
  created() {
    document.title = 'Home';
    this.loadDivisions()
  },
  mounted() {

  },
  updated() {
  },
}
</script>

<style scoped lang="scss">
.home {
  //height: calc(100% - 4.5rem);
  display: flex;
  padding: 1rem 1.5rem;
  .nav {
    flex: 1;
    display: flex;

    .content-link {
      display: flex;
      flex: 1;
      text-decoration: none;
      margin-right: 1rem;
      padding: 1rem 0.5rem;
      border: 1px solid;
      color: var(--text2);
      //background: var(--surface2);
      background: transparent;
      text-transform: capitalize;
      outline: none;
      cursor: pointer;
      border-radius: 0.5rem;
      font-size: 2rem;
      align-items: center;
      justify-content: space-around;
    }

    .content-link:hover {
      color: #FFFFFF;
      background: hsla(0, 0%, 0%, 0.5);
    }

    .content-link:last-of-type {
      margin-bottom: 0;
      margin-right: 0;
    }
  }
}
@media only screen and (max-width: 892px) {
  .home {
    padding: 0.5rem;

    .nav {
      flex: 1;
      flex-flow: column nowrap;

      .content-link {
        flex: 1;
        margin-bottom: 1rem;
        margin-right: 0;

        .content-img {
          display: none;
        }

        .content-name {
          display: flex;
        }
      }
    }
  }
}
</style>