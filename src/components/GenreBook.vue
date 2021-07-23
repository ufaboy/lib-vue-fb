<template>
  <form class="genre-book" @submit.prevent="sendGenre">
    <header class="modal-header">
      <h1>Genre</h1>
      <span>{{ genres.length }}</span>
      <button class="close-btn" type="reset" @click="closeModal">
        <base-icon class="icon" icon-name="close">
          <icon-close/>
        </base-icon>
      </button>
    </header>
    <fieldset class="genre-titles">
      <legend>selected: {{ selectedGenre.length }}</legend>
      <span v-if="selectedGenre.length === 0">Не выбраны жанры</span>
      <span class="fieldset-genre" :style="{color: colorizeGenre(index)}" v-for="(genre, index) of selectedGenre"
            :key="genre.id">{{ genre.name }}</span>
    </fieldset>
    <fieldset class="genres" v-if="main.isDesktop">
      <legend>all genres</legend>
      <div class="parent" :class="{'checked-childes': calcCheckedChildes(division)}"
           v-for="(division, index) of divisionsWithChildes" :key="division + index">
        <div class="parent-title">{{ division.name }}</div>
        <label class="checkbox-container" v-for="genre of division.childGenres" :key="genre.id">{{ genre.name }}
          <input type="checkbox" :value="genre" v-model="selectedGenre">
          <span class="checkmark"></span>
        </label>
      </div>
    </fieldset>
    <select class="select-genre" multiple v-model="selectedGenre" size="1" v-if="main.isMobile">
      <optgroup v-for="division of divisionsWithChildes" :key="division + index" :label="division.name">
        <option v-for="(genre, index) of division.childGenres" :key="genre.name + index">{{ genre.name }}</option>
      </optgroup>
    </select>
    <footer class="footer">
      <button class="negative-btn" type="button" @click="reset">сброс</button>
      <button class="positive-btn">Сохранить</button>
    </footer>
  </form>
</template>

<script>
import { mapState } from 'vuex';
import IconClose from "@/components/icons/IconClose"
import {collection, getDocs} from "firebase/firestore";
import {db} from '@/firebase.js'

export default {
  name: "GenreBook",
  components: {IconClose},
  emits: ['set-genres'],
  props: {
    genresProps: Array,
  },
  data: () => ({
    searchField: '',
    selectedGenre: [],
    genres: [],
    divisions: [],
    divisionsWithChildes: [],
  }),
  computed: {
    ...mapState({
      main: state => state.main,
    }),
  },
  watch: {},
  created() {
    this.calcDivisionsWithChildes()
  },
  mounted() {

  },
  methods: {
    sendGenre() {
      this.$emit('set-genres', this.selectedGenre.map(genre => genre.name))
      this.closeModal()
    },
    calcCheckedChildes(e) {
      return e.childGenres.find(item => this.selectedGenre.map(genre => genre.name).includes(item.name))
    },
    async calcDivisionsWithChildes() {
      const genresSnapshot = await getDocs(collection(db, "genres"));
      genresSnapshot.forEach((doc) => {
        const genre = {...doc.data()}
        const divisionIndex = this.divisionsWithChildes.findIndex(item => item.name === genre.division)
        if (divisionIndex > -1) {
          this.divisionsWithChildes[divisionIndex].childGenres.push(genre)
        } else {
          this.divisionsWithChildes.push({name: genre.division, childGenres: [genre]})
        }
        this.addGenreToSelectedFromProps(genre)
      });
    },
    addGenreToSelectedFromProps(genre) {
      if (this.genresProps && Array.isArray(this.genresProps) && this.genresProps.includes(genre.name)) {
        this.selectedGenre.push(genre)
      }
    },
    colorizeGenre(i) {
      const color = ['RED', 'ORANGE', 'YELLOW', 'GREEN', 'BLUE', 'DeepSkyBlue', 'PURPLE',]
      return color[i]
    },
    reset() {
      this.selectedGenre = this.genresProps.map(a => ({...a}))
    },
    closeModal() {
      this.$parent.hide('genreBook', this)
    }
  },
}
</script>

<style lang="scss">
.genre-book {
  display: flex;
  flex-flow: row wrap;
  padding: 1rem;
  height: 100%;
  width: 100%;
  color: var(--color-2);

  .modal-header {
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    margin-bottom: 1rem;
    width: 100%;
  }

  .search-field {
    width: 100%;
    margin-bottom: 0.5rem;
  }

  .genre-titles {
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin-bottom: 0.5rem;
    padding: 0.5rem;
  }

  .fieldset-genre {
    margin-right: 5px;
  }

  .genres {
    display: flex;
    flex-flow: row nowrap;
    width: 100%;
    padding: 0.5rem;
  }

  .parent {
    cursor: pointer;
    margin: 0 0.5rem 0.5rem 0;
    width: 25%;

    .parent-title {
      text-transform: capitalize;
      margin-bottom: 0.5rem;
    }
  }

  .parent.checked-childes {
    .parent-title {
      color: var(--brand);
    }

  }

  .checkbox-container {
    margin-bottom: 0.5rem;
    text-overflow: ellipsis;
    width: 100%;
    overflow: hidden;
    white-space: nowrap;
  }

  .select-genre {
    width: 100%;
    margin-bottom: 1rem;
  }

  .footer {
    display: flex;
    justify-content: space-around;
    margin-top: 1rem;
    width: 100%;
  }

  button {
    display: flex;
    align-items: center;
  }
}

@media only screen and (min-width: 412px) and (max-width: 892px) and (orientation: landscape) {
  .genre-book {
  }
}

@media only screen and (min-width: 412px) and (max-width: 892px) and (orientation: portrait) {
  .genre-book {
  }
}
</style>
