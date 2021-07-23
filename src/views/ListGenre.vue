<template>
  <div class="list-genre">
    <header class="header" v-if="isMobile">
      <select class="select" v-model="activeDivision">
        <option class="option" :value="division.name" v-for="(division, index) of divisions" :key="index">
          {{ division.name }}
        </option>
      </select>
    </header>
    <section class="genre"
             v-for="genre of genres"
             :key="'genre'+ genre.id"
             @click="openGenre(genre)">{{ genre.name }}
    </section>
    <!--    <observer @intersect="loadGenres('push')"/>-->
    <!--    <div class="loader" v-if="infinityLoading"></div>-->
  </div>
</template>

<script>
import { getDocs , collection, query, where } from "firebase/firestore";
import {db} from "@/firebase";

export default {
  name: "ListGenre",
  components: {},
  props: {},
  data: () => ({
    activeDivision: {
      childes: []
    },
    divisions: [],
    genres: []
  }),
  computed: {
    genresParent() {
      return this.$store.state.genre.items
    },
    isMobile() {
      return this.$store.state.main.isMobile
    },
  },

  watch: {
    activeDivision: function (newValue) {
      this.loadGenres(newValue)
    }
  },
  created() {
    document.title = 'Genres';
    this.loadDivisions()
    if (this.$route.params.name) {
      this.loadGenres(this.$route.params.name)
    }
  },
  mounted() {

  },
  methods: {
    openGenre(genre) {
      this.$router.push({
        name: 'list-book',
        params: {
          name: genre.name,
          division: this.activeDivision
        }
      })
    },
    async loadGenres(division) {
      const genresRef = collection(db, "genres");
      const q = query(genresRef, where("division", "==", division));

      try {
        const querySnapshot = await getDocs(q);
        this.genres.splice(0, this.genres.length)
        querySnapshot.forEach((genre) => {
          this.genres.push({id: genre.id, ...genre.data()})
        });
        this.activeDivision = division
      } catch (e) {
        console.log({loadGenres: e})
      }
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

<style scoped lang="scss">
.list-genre {
  display: flex;
  flex-flow: row wrap;
  padding: 1rem;

  .genre {
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-around;
    text-transform: capitalize;
    cursor: pointer;
    width: 300px;
    overflow: hidden;
    margin-bottom: 1rem;
    margin-right: 1rem;
    padding: 1rem;
    color: var(--text1);
    background: var(--surface2);
    border-radius: 5px;

    .title {
      margin-right: 0.5rem;
    }
  }
}

@media only screen and (max-width: 892px) {
  .list-genre {
    padding: 0.5rem;
    columns: 400px;

    .header {
      width: 100%;
      max-width: 100%;
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.5rem;
      max-height: 42px;

      .search-input {
        flex: 1;
        margin-right: 0.5rem;
        color: (var(--color));
        background-color: var(--background-2);
      }

      .select {
        flex: 1;
        padding: 0.5rem;

        .option {
          padding: 0.5rem;
        }
      }
    }

    .genre {
      margin-bottom: 0.5rem;
      margin-right: 0;
      padding: 0.5rem;
      width: 100%;
    }
  }
}

@media only screen and (max-width: 892px) and (orientation: landscape) {
  .list-genre {
  }
}

@media only screen and (max-width: 892px) and (orientation: portrait) {
  .list-genre {
    .header {
      .search-input {
        max-width: 220px;
      }

      .select {
        //max-width: 165px;
      }
    }

    .genre {
      justify-content: space-between;
    }
  }
}
</style>