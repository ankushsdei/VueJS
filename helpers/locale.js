export default class Locale {

  constructor () {
    const [ en, ar, fr ] = arguments
    this['en-us'] = en
    this.ar = ar || en
    this.fr = fr || en
  }

}
