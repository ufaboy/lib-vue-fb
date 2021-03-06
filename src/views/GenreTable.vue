<template>
  <div class="genre-table">
    <header class="header">
      <button class="btn" @click="createGenre">create</button>
    </header>
    <table class="table">
      <thead class="thead">
      <th class="th" :class="columnsClasses[column]" v-for="(column, index) of columns" :key="index">
        <div class="table-cell">
          <div class="td-title">{{ column }}</div>
          <div class="td-action" @click="sortBy(column, ascending ? 0 : 1)">
            <base-icon class="icon" icon-name="sort">
              <icon-sort-asc v-if="ascending"/>
              <icon-sort-desc v-else/>
            </base-icon>
          </div>
        </div>
      </th>
      </thead>
      <transition-group name="flip-list" tag="tbody">
        <tr class="row" :class="{picante: genre.ad, parent: genre.parent === null}" v-for="genre of genres" :key="genre.id"
            @click="openRow(genre)">
          <td class="td" :class="columnsClasses.title">{{ genre.name }}</td>
          <td class="td" :class="columnsClasses.description">{{ genre.description }}</td>
          <td class="td" :class="columnsClasses.division">{{ genre.division ? genre.division : '' }}</td>
        </tr>
      </transition-group>
    </table>
    <modal ref="editGenre">
      <edit-genre :genre="activeGenre" @update-genres="loadGenres"/>
    </modal>
  </div>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import { collection, query, getDocs } from "firebase/firestore";
import {db} from '@/firebase.js'
import EditGenre from '@/components/EditGenre.vue'
import IconSortAsc from '@/components/icons/IconSortAsc.vue'
import IconSortDesc from '@/components/icons/IconSortDesc.vue'

export default {
  name: "GenreTable",
  components: {EditGenre, IconSortAsc, IconSortDesc},
  props: {},
  data: () => ({
    activeGenre: {
      id: null,
      name: null,
      description: null,
    },
    modalOpen: false,
    genres: [],
    ascending: 1,
    orderBy: null,
    columns: ['name', 'description', 'division'],
    columnsClasses: {
      name: 'cell-name',
      description: 'cell-description',
      division: 'cell-division'
    },
  }),
  methods: {
    async loadGenres() {
      const querySnapshot = await getDocs(collection(db, "genres"));
      let genres = [];
      querySnapshot.forEach((doc) => {
        genres.push({id: doc.id, ...doc.data()})
      });
      this.genres = genres
      console.log({querySnapshot: querySnapshot, genres: genres})
    },
    openRow(row) {
      this.activeGenre = row
      this.$modal.show('editGenre', this, row)
    },
    createGenre() {
      this.activeGenre = {
        name: null,
        description: null,
        division: null,
        ad: null
      };
      this.$modal.show('editGenre', this)
    },
    sortBy(orderBy, asc) {
      console.log({'orderBy': orderBy, 'asc': asc})
      this.genres.sort(function (a, b) {
        if (a[orderBy] > b[orderBy]) {
          return asc ? 1 : -1;
        }
        if (a[orderBy] < b[orderBy]) {
          return asc ? -1 : 1;
        }
        // a должно быть равным b
        return 0;
      })
      this.ascending = this.ascending ? 0 : 1
    },
  },
  computed: {

  },
  watch: {},
  created() {
    document.title = 'Table Genres';
    if (this.genres.length === 0) {
      this.loadGenres()
    }
  },
  mounted() {
  },
  updated() {
  },
}
</script>

<style scoped lang="scss">
.genre-table {
  width: 100%;
  height: calc(100% - 3.5rem);
  padding: 1rem 1.5rem;

  .header {
    margin-bottom: 0.5rem;
    display: flex;
    flex-flow: row nowrap;

    .btn {
      display: flex;
      //flex: 1;
      align-items: center;
      justify-content: center;
      text-transform: capitalize;
    }

    .btn:last-of-type {
      margin-right: 0;
    }
  }

  .flip-list-move {
    transition: transform 1s;
  }

}

@media only screen and (max-width: 892px) {
  .genre-table {
    padding: 0.5rem;

    .dialog {
      margin: auto;
    }
  }
}

@media only screen and (min-width: 360px) and (max-width: 892px) and (orientation: landscape) {
  .genre-table {
    .table {
      .cell-id {
        display: none;
      }
    }
  }
}

@media only screen and (min-width: 360px) and (max-width: 892px) and (orientation: portrait) {
  .genre-table {
    .dialog {
      width: 100%;
      margin: auto;
    }

    .table {
      .cell-description, .cell-id {
        display: none;
      }
    }
  }
}
</style>