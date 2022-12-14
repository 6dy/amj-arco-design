<template>
  <div
    v-if="isExt"
    :style="styleExternalIcon"
    class="svg-external-icon svg-icon"
    v-bind="$attrs"
  />
  <svg v-else :class="svgClass" aria-hidden="true" v-bind="$attrs">
    <use :xlink:href="iconName" />
  </svg>
</template>

<script lang="ts">
  import { computed, defineComponent } from 'vue';
  import { isExternal } from '@/utils/validate';

  export default defineComponent({
    props: {
      iconClass: {
        type: String,
        required: true,
      },
      className: {
        type: String,
        default: '',
      },
    },
    setup(props) {
      const { iconClass } = { ...props };
      const { className } = { ...props };

      const isExt = computed(() => isExternal(iconClass));
      const iconName = computed(() => `#icon-${iconClass}`);
      const svgClass = computed(() => {
        if (className) {
          return `svg-icon ${className}`;
        }
        return 'svg-icon';
      });
      const styleExternalIcon = computed(() => ({
        'mask': `url(${iconClass}) no-repeat 50% 50%`,
        '-webkit-mask': `url(${iconClass}) no-repeat 50% 50%`,
      }));
      return { isExt, iconName, svgClass, styleExternalIcon };
    },
  });
</script>

<style scoped>
  .svg-icon {
    width: 1em;
    height: 1em;
    vertical-align: -0.15em;
    fill: currentColor;
    overflow: hidden;
  }

  .svg-external-icon {
    background-color: currentColor;
    mask-size: cover !important;
    display: inline-block;
  }
</style>
