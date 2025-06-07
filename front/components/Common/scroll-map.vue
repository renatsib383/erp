<script setup>
import throttle from "lodash.throttle";
import { nextTick } from "vue";
</script>

<script>
export default {
  data() {
    return {
      scrollElement: null, //Прокручиваемый контейнер колонок для получения scrollWidth, передается в параметрах
      // containerScroll: 0, // Установить равным значению скролла контейнера колонок, чтобы привести в соответствие скролл мини-карты
      maxScrollX: 0,
      mapHandlerMaxLeft: 0,
      mapScrollLeft: null, // Смещение начала указателя мини-карты, относительно начала мини карты
      isContainerScrolled: false // Изменен скролл контейнера из кода
    };
  },
  props: {
    stepsAmount: Number,
    scroll: Object,
  },
  watch: {
    // containerScroll(value) {
    //   console.log('[scroll-map] containerScroll',value);
    //   this.scrollElement.scrollLeft = value;
    //   var left = this.mapScrollLeft
    //     ? this.mapScrollLeft // Если двигали мини-карту и поэтому изменили containerScroll, то так и оставляем
    //     : (value * this.$refs.scrollMapInner.clientWidth) /
    //       this.scrollElement.scrollWidth;
    //   this.scrollMapHandlerLeft(left);
    //   this.mapScrollLeft = null; // Обнуляем после передвижения миникарты
    // },
    // При переключении с таблицы на канбан, ждем, когда подгрузится параметр scroll
    scroll(value) {
      if (typeof value != "undefined") {
        this.scrollElement = value;
        this.scrollElement.addEventListener('scroll',event => {
          // // Баг при перезагрузке канбана при открытой сделке и большим количеством колонок в канбане
          if (!this.isContainerScrolled) {
            let scrollLeft =
            (parseInt(this.$refs.scrollMapHandler.style.translate) * this.scrollElement.scrollWidth) /
            this.$refs.scrollMapInner.clientWidth; // делаем скролл контейнера столбцов по отступу мини-карты
            this.setContainerScroll(scrollLeft);
          } else {
            this.isContainerScrolled = false;
          }
        })
        this.initScroll();
      }
    },
    //
    stepsAmount: function(newVal, oldVal) {
      this.initScroll();
    }
  },
  methods: {
    async initScroll() {
      if (!this.scrollElement) {
        return;
      }
      await nextTick();
      // console.log(`this.$refs.scrollMapInner.clientWidth: ${this.$refs.scrollMapInner.clientWidth},
      // this.scrollElement.scrollWidth: ${this.scrollElement.scrollWidth}, this.scrollElement.clientWidth: ${this.scrollElement.clientWidth}`);

      // this.containerScroll = this.scrollElement.scrollLeft; // пересчитываем карту
      this.calcMiniMap(this.scrollElement.scrollLeft);// пересчитываем карту
      let handlerWidth = Math.round(
        (this.scrollElement.clientWidth / this.scrollElement.scrollWidth) *
          this.$refs.scrollMapInner.clientWidth,
      );
      this.$refs.scrollMapHandler.style.width = handlerWidth + "px";
      this.mapHandlerMaxLeft =
        this.$refs.scrollMapInner.clientWidth - handlerWidth;
      if (
        parseInt(this.$refs.scrollMapHandler.style.translate) >
        this.mapHandlerMaxLeft
      ) {
        //console.log('this.$refs.scrollMapHandler.style.translate: ' + this.$refs.scrollMapHandler.style.translate);
        this.$refs.scrollMapHandler.style.translate =
          this.mapHandlerMaxLeft + "px";
          // this.scrollElement.scrollLeft = 0;
          this.setContainerScroll(0);
      }
      this.maxScrollX =
        this.scrollElement.scrollWidth - this.scrollElement.clientWidth;
      // console.log(`this.$refs.scrollMapHandler.style.width: ` + this.$refs.scrollMapHandler.style.width);
      // console.log('this.$props.scroll',this.$props.scroll);
      // console.log('this.scrollElement',this.scrollElement);
      // console.log('--------------------------------');
    },
    setContainerScroll(value) {
      this.isContainerScrolled = true;
      this.scrollElement.scrollLeft = value;
    },
    calcMiniMap(value) {
      var left = (value * this.$refs.scrollMapInner.clientWidth) /
            this.scrollElement.scrollWidth;
      this.scrollMapHandlerLeft(left);
    },
    onWheel(event) {
      if (event.target.closest(".deals-wrapper")) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();

      // var scrollX = this.containerScroll + event.deltaY;
      var scrollX = this.scrollElement.scrollLeft + event.deltaY;
      if (scrollX < 0) {
        scrollX = 0;
      } else if (scrollX > this.maxScrollX) {
        scrollX = this.maxScrollX;
      }

      // this.containerScroll = scrollX; // пересчитываем мини-карту
      // this.scrollElement.scrollLeft = scrollX;
      this.setContainerScroll(scrollX);
      this.calcMiniMap(scrollX);// пересчитываем мини-карту
    },
    onScroll(event) {
      if (event.target.closest(".deals-wrapper")) {
        return;
      }
      // this.containerScroll = event.target.scrollLeft;
    },
    scrollMapHandlerLeft(left) {
      if (left < 0) {
        left = 0;
      } else
        if (left > this.mapHandlerMaxLeft) {
        left = this.mapHandlerMaxLeft;
      }
      this.$refs.scrollMapHandler.style.translate = `${left}px`;
    },
    mouseDown(event) {
      // console.log('mouseDown');
      // console.log('event.clientX = ' + event.clientX +
      //     ' , event.target.getBoundingClientRect().left = ' + event.target.getBoundingClientRect().left);
      // console.log('shiftX = ' + (event.clientX - event.target.getBoundingClientRect().left));
      // console.log('event.layerX =' + event.layerX);
      if (event.button != 0) return;
      // Положение мыши относительно левого края указателя мини-карты
      var shiftX = event.clientX - event.target.getBoundingClientRect().left;

      const mapMouseMove = (event) => {
        // console.log(`mapMouseMove: event.pageX + ${event.pageX}, shiftX: ${shiftX}`);
        // console.log(event.pageX - this.$refs.scrollMap.getBoundingClientRect().left);
        this.mapScrollLeft =
          event.pageX -
          this.$refs.scrollMap.getBoundingClientRect().left -
          shiftX;
        this.scrollMapHandlerLeft(this.mapScrollLeft);
        // this.containerScroll =
        // this.scrollElement.scrollLeft =
        let scrollLeft =
          (this.mapScrollLeft * this.scrollElement.scrollWidth) /
          this.$refs.scrollMapInner.clientWidth; // делаем скролл контейнера столбцов
        this.setContainerScroll(scrollLeft);
        // console.log('mapMouseMove end');
      };

      const mapMouseMoveThrottle = throttle(
        (event) => mapMouseMove(event),
        100,
      );

      document.documentElement.addEventListener(
        "pointermove",
        mapMouseMoveThrottle,
        false,
      );

      const mapMouseUp = () => {
        document.documentElement.removeEventListener(
          "pointermove",
          mapMouseMoveThrottle,
          false,
        );
      };

      document.documentElement.addEventListener("pointerup", mapMouseUp, {
        once: true,
      });
    },

    resize() {
      this.initScroll();
      this.$emit("scroll-resize");
    },
    onToucheMove(e) {
      // this.containerScroll = this.scrollElement.scrollLeft; // пересчитываем карту
      this.isContainerScrolled = true;
      this.calcMiniMap(this.scrollElement.scrollLeft); // пересчитываем карту
    },
  },
  async mounted() {
    await nextTick();
    this.scrollElement = this.$props.scroll; //Прокручиваемый элемент со всеми элементамии для получения scrollWidth
    this.initScroll();

    document.documentElement.addEventListener("touchmove", (e) => this.onToucheMove(e), true);
    // document.documentElement.addEventListener(
    //   "touchend",
    //   () => {
    //     console.log("touchend");
    //   },
    //   true,
    // );
    document.documentElement.addEventListener(
      "scroll",
      (e) => this.onScroll(e),
      true,
    );
  },
};
</script>

<template>
  <div class="resize relative h-full" v-resize="resize">
    <div
      class="scroll-map-wrapper relative h-full z-[1]"
      @wheel="onWheel"
      @scroll="onScroll"
    >
      <slot></slot>
    </div>
    <div
      ref="scrollMap"
      class="scroll-map relative opacity-50 hover:opacity-100 transition-opacity duration-200"
    >
      <div ref="scrollMapInner" class="scroll-map__items-wrapper">
        <div
          ref="scrollMapHandler"
          class="scroll-map__screen-position"
          style="backface-visibility: hidden"
          @pointerdown="mouseDown"
          @dragstart.prevent.stop
        ></div>
        <div class="scroll-map__item" v-for="n in stepsAmount" :key="n"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@media (max-width: 480px) {
  .scroll-map {
    display: none;
  }
}

.scroll-map-wrapper::-webkit-scrollbar {
  display: none;
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scroll-map {
  position: absolute;
  right: 66px;
  bottom: 9px;
  padding: 3px;
  border: 1px solid #00000026;
  border-radius: 3px;
  z-index: 10;
}

.scroll-map__items-wrapper {
  position: relative;
  display: flex;
}

.scroll-map__screen-position {
  position: absolute;
  height: 100%;
  border-radius: 2px;
  z-index: 1;
  background-color: #00000026;
  cursor: grabbing;
  touch-action: none;
}

.dark .scroll-map__screen-position {
  background-color: #00000046;
}

.scroll-map__item {
  width: 16px;
  height: 30px;
  margin-right: 2px;
  background-color: #c4c4c4;
  opacity: 20;
  border: 1px solid #c4c4c4;
  border-radius: 2px;
}
</style>
