import Locale from '@/helpers/locale'

export default [
  {
    src: require('../images/carousel/1.jpg'),
    header: new Locale(
      '360˚ Transportation & Logistics Solution',
      'حلول متكاملة لخدمات النقل و الخدمات اللوجيستسة',
    ),
    subHeader: new Locale(
      'Wiot360 de-complexifies & streamlines IoT, fleet and supply chain use cases, maximizes asset utilization, and saves your business money',
      'سلاسة في الاستخدام, استخدام الأصول بالشكل الأمثل, توفير الأموال بالإضافة الى احدث الاجهزة المتطورة (IOT)',
    )
  },
  {
    src: require('../images/carousel/2.png'),
    class: 'sized',
  },
  {
    src: require('../images/carousel/3.png'),
    class: 'sized',
  },
  {
    src: require('../images/carousel/4.png'),
    'src-ar': require('../images/carousel/4-ar.png'),
    class: 'sized',
  },
]
