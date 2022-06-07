import __colors from 'vuetify/es5/util/colors'
import {
  RGBAtoHex,
  HexToRGBA,
} from 'vuetify/es5/util/colorUtils'

class Colors {

  constructor () {
  }

  getColor (dotted_field) {
    // console.log(dotted_field)
    return this.getColorFromDot(dotted_field, __colors)
  }

  changeAlpha (color, offset) {
    if (typeof color !== 'string') return color
    if (offset < -1 || offset > 1) return color
    const { r, g, b, a } = HexToRGBA(color.length == 9 || color.length == 5 ? color : `${color}${color.length < 5 ? 'F' : 'FF'}`)
    const alpha = a !== 0 ? a / 100 : 0
    return RGBAtoHex({
      r, g, b,
      a: Math.round(Math.min(1, Math.max(0, alpha + offset)) * 100) / 100
    })
  }

  getColorFromDot (dotted_field, color) {
    const split = dotted_field.split('.')
    const start = split.splice(0, 1)[0];
    if (!color[start]) return null
    if (split.length) return this.getColorFromDot(split.join('.'), color[start])
    if (color[start].base) return color[start].base
    return color[start]
  }

  translateColor (color) {
    switch (color) {
      case 'info': return 'cyan'
    }
    return color
  }

}

export default new Colors()