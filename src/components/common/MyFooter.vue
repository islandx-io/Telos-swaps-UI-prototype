<template>
  <b-container fluid>
    <b-row align-v="center" class="footer">
      <b-col cols="4">
        <a :href="website" target="_blank" class="orange">Telos Swaps </a
        ><span class="text">© 2020</span>
      </b-col>
      <b-col cols="8" class="d-flex justify-content-end align-middle">
        <ul class="list-inline ">
          <li class="list-inline-item">
            <router-link class="orange" :to="{ name: 'Privacy' }">
              Privacy Policy
            </router-link>
          </li>
          <li class="list-inline-item">
            <span class="text">Version: {{ appVersion }} </span>
          </li>
          <li class="list-inline-item">
            <span class="text">

              <a href="https://t.me/tswaps" target="_blank"
                ><font-awesome-icon
                  :style="{ color: 'white' }"
                  :icon="['fab', 'telegram']"
                  fixed-width
              /></a>

              <a href="https://twitter.com/tswaps_com" target="_blank"
                ><font-awesome-icon
                  :style="{ color: 'white' }"
                  :icon="['fab', 'twitter']"
                  fixed-width
              /></a>

              <a href="https://github.com/Telos-Swaps" target="_blank"
                ><font-awesome-icon
                  :style="{ color: 'white' }"
                  :icon="['fab', 'github']"
                  fixed-width
              /></a>

              <a href="https://medium.com/@tswaps" target="_blank"
              ><font-awesome-icon
                  :style="{ color: 'white' }"
                  :icon="['fab', 'medium']"
                  fixed-width
              /></a>

            </span>
          </li>
        </ul>
      </b-col>
    </b-row>
  </b-container>
</template>

<script lang="ts">
import { Prop, Component, Vue } from "vue-property-decorator";
@Component({})
export default class MyFooter extends Vue {
  get website() {
    return "https://tswaps.com";
  }
  get appVersion() {
    return JSON.parse(
      unescape(escape(JSON.stringify(require("../../../package.json"))))
    ).version;
  }
}
</script>

<style lang="scss">
.footer {
  background-color: #1f2d36;
  padding: 15px 15px;
  justify-content: space-between;
}
.list-inline {
  margin: 0;
}
.list-inline-item {
  border-right: 1px solid white;
  padding-right: 6px;
}
.list-inline-item:last-child {
  border-right: none;
}
.text {
  color: white;
}
.orange {
  color: #d18235;
}
</style>