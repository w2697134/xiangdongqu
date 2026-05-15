(function (root, factory) {
  const home = factory()

  if (typeof module === 'object' && module.exports) {
    module.exports = home
  }

  if (typeof window !== 'undefined') {
    window.XDQ_HOME = home
  } else if (root) {
    root.XDQ_HOME = home
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  const imageBase = '/assets/images/'

  return {
    sourceBase: 'http://www.xiangdongqu.com/',
    sourceCheckedAt: '2026-05-15',
    hero: {
      title: '向东渠',
      subtitle: '事迹数字馆',
      image: `${imageBase}hero.jpg`,
      organizations: [
        '中共云霄县委党史和地方志研究室',
        '中共云霄县委党建办'
      ]
    },
    navEntries: [
      {
        label: '全景水渠',
        icon: `${imageBase}icon-panorama.png`,
        sourceUrl: 'https://www.720yun.com/vr/c60jOOtv5k0'
      },
      {
        label: '展厅VR',
        icon: `${imageBase}icon-vr.png`,
        sourceUrl: 'https://www.720yun.com/vr/ec6jzpyarm8'
      },
      {
        label: '历史资料',
        icon: `${imageBase}icon-history.png`,
        sourceUrl: 'http://www.xiangdongqu.com/history.aspx?ClassID=9'
      },
      {
        label: '精神内涵',
        icon: `${imageBase}icon-spirit.png`,
        sourceUrl: 'http://www.xiangdongqu.com/spirit.aspx?ClassID=10'
      },
      {
        label: '时代价值',
        icon: `${imageBase}icon-value.png`,
        sourceUrl: 'http://www.xiangdongqu.com/value.aspx?ClassID=11'
      },
      {
        label: '今日云霄',
        icon: `${imageBase}icon-yunxiao.png`,
        sourceUrl: 'http://www.xiangdongqu.com/jryx.aspx?ClassID=30'
      },
      {
        label: '资讯动态',
        icon: `${imageBase}icon-news.png`,
        sourceUrl: 'http://www.xiangdongqu.com/newscenter2.aspx?ClassID=31'
      }
    ],
    panorama: {
      title: '全景水渠',
      image: `${imageBase}panorama-canal.jpg`,
      caption: '向东渠水利工程风貌',
      sourceUrl: 'https://www.720yun.com/vr/c60jOOtv5k0'
    },
    vr: {
      title: '展厅VR',
      image: `${imageBase}digital-hall.jpg`,
      name: '沉浸式云展厅',
      description: '身临其境 感受奋斗历程',
      sourceUrl: 'https://www.720yun.com/vr/ec6jzpyarm8'
    },
    history: {
      title: '历史资料',
      cards: [
        {
          title: '大事记',
          subtitle: 'Chronicle of Events',
          image: `${imageBase}history-event.jpg`,
          sourceUrl: 'http://www.xiangdongqu.com/hisDetail.aspx?ID=29'
        },
        {
          title: '旧文献',
          subtitle: 'Old literature',
          image: `${imageBase}history-doc.jpg`,
          sourceUrl: 'http://www.xiangdongqu.com/PicList.aspx?ClassID=34'
        },
        {
          title: '老照片',
          subtitle: 'Old photos',
          image: `${imageBase}history-photo.jpg`,
          sourceUrl: 'http://www.xiangdongqu.com/PicList.aspx?ClassID=35'
        }
      ]
    },
    spirit: {
      title: '精神内涵',
      image: `${imageBase}spirit.jpg`,
      keywords: ['勇于担当', '团结协作', '攻坚克难', '开拓创新']
    },
    value: {
      title: '时代价值',
      summary: '弘扬向东渠精神，汲取奋进力量。'
    },
    yunxiao: {
      title: '今日云霄',
      image: `${imageBase}yunxiao.jpg`,
      caption: '富美新云霄',
      sourceUrl: 'http://www.xiangdongqu.com/jryx.aspx?ClassID=30'
    },
    news: {
      title: '资讯动态',
      list: [
        {
          title: '中央党校副校长龚维斌到云霄调研',
          source: '官网资讯',
          sourceUrl: 'http://www.xiangdongqu.com/NewsDetail.aspx?ID=18'
        },
        {
          title: '八闽文脉·记忆丨向东渠：劈山跨海造长河',
          source: '福建共青团',
          sourceUrl: 'http://www.xiangdongqu.com/NewsDetail.aspx?ID=412'
        },
        {
          title: '向东渠旅游线路系列｜开漳圣王文化之旅',
          source: '官网资讯',
          sourceUrl: 'http://www.xiangdongqu.com/NewsDetail.aspx?ID=405'
        }
      ]
    }
  }
})
