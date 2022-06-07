<template>
  <div class="profile-comp no-wrap items-center">
    <div
      :class="[ 'avatar', { 'q-mr-sm': name.length && showName }, avatar_class ]"
      :style="[ 'z-ndex:0', noBorder ? 'border:none;' : 'border-width:2px;' ]">
      <fleet-avatar
        :key="`image-${image_data.cropped}`"
        style="z-index:2;"
        class="bg-primary"
        :img="image"
        :title="name"
        :border="false"
        :size="`${imageSize}px`"
        :style="imageStyles"
        :bg="bg"
        :shadow="false"
      />
      <span v-if="!noGender && [ 'm', 'o' ].includes(gender)" class="gender-definer gender-definer--male fa fa-arrow-up" :style="{ fontSize: genderSize }"></span>
      <span v-if="!noGender && [ 'f', 'o' ].includes(gender)" class="gender-definer gender-definer--female fa fa-plus" :style="{ fontSize: genderSize }"></span>
      <v-progress-circular
        style="position: absolute;"
        :value="progress"
        :size="progressSize ? (typeof progressSize === 'string' ? progressSize : `${progressSize}px`) : `${(imageSize > 100 ? (imageSize + 10) : (imageSize + 5))}px`"
        :thickness="progressThickness"
        :color="genderColor"
        center-color="transparent"
        :track-color="genderColorLight"
        class="q-ma-md"
        :reverse="false"
        v-if="!noGender"
      />
      <f-q-btn
        round
        unelevated
        v-if="editable"
        class="edit-btn"
        :style="{ width: `${imageSize}px`, height: `${imageSize}px` }"
        @click="changeImage"
      >
        <!-- color="transparent" -->
        <div class="column items-center">
          <span class="fa text-white" :class="image ? 'fa-pen' : 'fa-plus'"></span>
          <div v-if="!noLabel">{{image ? $t('EDIT') : $t('ADD')}}</div>
        </div>
      </f-q-btn>
    </div>
    <span v-if="name.length && showName">{{name}}</span>
    <!-- <template>
      <confirmation-dialog
        :showDialog="showConfirmation"
        v-bind="confirmOptions"
        @onClose="showConfirmation=false"
      />
    </template> -->
  </div>
</template>

<script>
import RELATION from '@/constants/relations'
import { gender as GenderHelper, genderString as GenderString, name as NameHelper } from '@/helpers/user'
// import ConfirmationDialog from '@/lib-components/components/Dialogs/Confirmation.vue'

export default {
  name: 'profile-display',
  components: {
    // ConfirmationDialog,
  },
  props: {
    editable: { type: Boolean, default: () => false },
    noGender: { type: Boolean, default: () => false },
    details: { type: Object, required: true },
    showName: { type: Boolean, default: () => true },
    imageStyles: { type: Object, default: () => {} },
    imageSize: { type: Number, default: () => 20 },
    progressSize: { type: [ Number, String ], default: () => 0 },
    progressThickness: { type: Number, default: () => 1 },
    genderSize: { type: String, default: () => '1rem' },
    noBorder: { type: Boolean, default: () => false },
    bg: { type: Boolean, default: () => true },
    noLabel: { type: Boolean, default: () => false },
  },
  data () {
    return {
      image_data: {},
      showConfirmation: false,
      confirmOptions: {},
    }
  },
  watch: {
    editable () {
      this.image_data = {}
    }
  },
  computed: {
    image () {
      if (this.image_data.cropped) return this.preprocess_image(this.image_data.cropped)
      if (this.details.image) return this.preprocess_image(this.details.image)
      return ''
    },
    gender () {
      return GenderHelper((this.details && this.details.gender) || 'u').toLowerCase()
    },
    name () {
      return NameHelper(this.details)
        .split(' ')
        .join(' ')
    },
    progress () {
      if (typeof this.details.progress === 'number') return this.details.progress
      return 100
    },
    gender_icon () {
      let rel = Object.values(this.details.relationships || []).filter(f => f).map(f => f.toUpperCase())
      if (! rel.length) return this.gender
      if (rel.indexOf(RELATION.FATHER) !== -1) return GenderHelper('male').toLowerCase()
      if (rel.indexOf(RELATION.MOTHER) !== -1) return GenderHelper('female').toLowerCase()
      return GenderHelper('foo').toLowerCase()
    },
    genderColor () {
      return `gender-${GenderString(this.gender)}`
    },
    genderColorLight () {
      return `gender-${GenderString(this.gender)}-light`
    },
    avatar_class () {
      const hasGender = !!(this.details.gender || '')
      return [
        // `avatar-gender-bg-${this.gender_icon}`,
        `avatar-gender-${this.gender}`,
        !hasGender ? '' : 'avatar-gender-other'
      ].join(' ')
    },
  },
  methods: {
    preprocess_image (image) {
      return image
    },
    changeImage () {
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = 'image/png, image/gif, image/jpeg'
      input.click()
      input.onchange = () => {
        if (input.value) {
          const reader = new FileReader();
          reader.onload = ev => {
            if (! ev.target || ! ev.target.result) return
            this.$emitter.emit('cropper.show', {
              image: ev.target.result,
              options: {
                aspectRatio: 1
              },
              callback: imgData => {
                this.image_data = imgData || {}
                this.$emit('imageChanged', this.image_data)
              }
            })
          }
          reader.readAsDataURL(input.files[0])
        }
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import '../../styles/relations';
@import '../../styles/gender';
.profile-comp {
  display: inline-flex;
}
.edit-btn {
  position: absolute !important;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 99;
  background: rgba(0, 0, 0, 0.5) !important;
  color: white !important;
  span {
    font-size: 1.5rem !important;
  }
}
.avatar {
  position: relative;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  border: 3px solid transparent;
  > div { z-index: 1; }
  .img-name {
    width: 3rem;
    height: 3rem;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    font-size: 1.25rem;
  }
  .gender-definer {
    position: absolute;
  }
  &.avatar-gender-f {
    $--_size: 0.7rem;
    background: $gender-female;
    margin-bottom: 0.5rem;
    /* border-color: lighten($gender-female, 10%); */
    .gender-definer {
      color: lighten($gender-female, 10%);
      bottom: -0.9rem /* rtl:ignore */;
      left: 50% /* rtl:ignore */;
      transform: translate(-50%, calc(100% - 0.8rem)) /* rtl:ignore */;
    }
  }
  &.avatar-gender-m {
    $--_size: 0.7rem;
    background: $gender-male;
    /* border-color: lighten($gender-male, 10%); */
    .gender-definer {
      color: lighten($gender-male, 10%);
      right: 0 /* rtl:ignore */;
      top: 0 /* rtl:ignore */;
      transform: rotate(45deg) translate(0, -0.8rem) /* rtl:ignore */;
    }
  }
  &.avatar-gender-u {
    background: $gender-other;
    /* border-color: lighten($gender-other, 10%); */
    .gender-definer {
      color: lighten($gender-other, 10%);
    }
    &.avatar-gender-other {
      margin-bottom: 0.5rem;
      .gender-definer {
        &.gender-definer--female {
          bottom: -0.9rem /* rtl:ignore */;
          left: 50% /* rtl:ignore */;
          transform: translate(-50%, calc(100% - 0.8rem)) /* rtl:ignore */;
        }
        &.gender-definer--male {
          right: 0 /* rtl:ignore */;
          top: 0 /* rtl:ignore */;
          transform: rotate(45deg) translate(0, -0.5rem) /* rtl:ignore */;
        }
      }
    }
  }
  &.avatar-gender-bg-m {
    background: $relation-mother !important;
    border-color: lighten($relation-mother, 10%) !important;
    .gender-definer {
      color: lighten($relation-mother, 10%) !important;
    }
  }
  &.avatar-gender-bg-f {
    background: $relation-father !important;
    border-color: lighten($relation-father, 10%) !important;
    .gender-definer {
      color: lighten($relation-father, 10%) !important;
    }
  }
  &.avatar-gender-bg-u {
    background: $relation-other !important;
    border-color: lighten($relation-other, 10%) !important;
    .gender-definer {
      color: lighten($relation-other, 10%) !important;
    }
  }
}
</style>
