<template>
    <div class="container">
      <svg ref="svg" viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg">
        <g ref="emojiContainer">
          <image ref="emoji" :xlink:href="emojiImageUrl" x="50%" y="400" width="10" height="10" />
        </g>
        <g ref="hitLines" transform="translate(-10,0)" stroke-width="4" fill="none" stroke="#FFC83D" stroke-miterlimit="10" stroke-linecap="round">
          <line x1="362.5" y1="400.5" x2="339.5" y2="404.5" />
          <line x1="361.6" y1="392.32" x2="339.5" y2="386.5"  opacity="0.7"/>
          <line x1="457.14" y1="391.53" x2="486.71" y2="382.12" opacity="0.7"/>
          <line x1="456.5" y1="400.5" x2="478.5" y2="404.5"  />
        </g> 
        <g ref="shadow">
          <line x1="360" y1="404" x2="440" y2="404" stroke="#111" stroke-width="4" stroke-linecap="round"/>
        </g>
      </svg>
    </div>
  </template>
  
  <script>
  import { gsap } from 'gsap';
  
  export default {
    mounted() {
      this.initializeAnimation();
    },
    computed: {
      emojiImageUrl() {
        return this.emojiArr[this.count];
      }
    },
    data() {
      return {
        emojiArr: [
          'https://sapi.kjchmc.cn/uploads/paimon_meme_006_f3cb7b70e7.png',
          'https://sapi.kjchmc.cn/uploads/paimon_meme_008_7bf6bb945b.png',
          'https://sapi.kjchmc.cn/uploads/paimon_meme_018_1fb0036020.png',
          'https://sapi.kjchmc.cn/uploads/paimon_meme_019_91d4f9f27c.png'
        ],
        hitColorArr: ['#111', '#F7894A', '#00BCF2', '#F03A17', '#00BCF2', '#000', '#8CBD18', '#333'],
        count: 0,
        scale: 4
      };
    },
    methods: {
      initializeAnimation() {
        const emojiContainer = this.$refs.emojiContainer;
        const shadow = this.$refs.shadow;
        const hitLines = this.$refs.hitLines;
        const emoji = this.$refs.emoji;
  
        gsap.set('svg', {
          visibility: 'visible'
        });
        gsap.set(emojiContainer, {
          transformOrigin: '50% 100%',
          scale: this.scale
        });
        gsap.set([shadow], {
          transformOrigin: '50% 50%'
        });
        gsap.set([shadow, emoji], {
          transformOrigin: '50% 50%'
        });
  
        const hitTl = gsap.timeline();
        hitTl.fromTo('#hitLines line', 0.2, {
          drawSVG: '0% 0%'
        }, {
          drawSVG: '0% 50%',
          ease: 'none'
        })
        .to('#hitLines line', 0.2, {
          drawSVG: '60% 80%',
          ease: 'none'
        })
        .to('#hitLines line', 0.4, {
          drawSVG: '100% 100%',
          ease: 'out'
        });
  
        const tl = gsap.timeline({ paused: false, repeat: -1 }).timeScale(3);
        tl.from(emojiContainer, 0.7, {
          y: -100,
          ease: 'power1.in'
        })
        .from(emojiContainer, 0.7, {
          scaleX: this.scale / 1.2,
          ease: 'power3.in'
        }, 0)
        .from(shadow, 0.7, {
          scaleX: 0.3,
          alpha: 0.2,
          ease: 'power3.in'
        }, '-=0.7')
        .add(() => {
          hitTl.play(0).timeScale(3);
          gsap.set(hitLines, { stroke: this.hitColorArr[this.count] });
        })
        .to(emojiContainer, 0.3, {
          scaleY: this.scale / 2,
          scaleX: this.scale + (this.scale / 4)
        })
        .add('hit', '-=0.3')
        .to(emojiContainer, 0.13, {
          scaleY: this.scale,
          scaleX: this.scale / 1.2,
          ease: 'expo.out'
        }, '+=0.1')
        .add(this.onRepeat, '-=0.08')
        .to(emojiContainer, 0.7, {
          y: -100,
          ease: 'power1.out'
        }, '-=0.1')
        .to(shadow, 0.7, {
          scaleX: 0.3,
          alpha: 0.2,
          ease: 'power3.out'
        }, '-=0.7');
  
        gsap.to(emoji, tl.duration() / 1.5, {
          rotation: '-=360',
          repeat: -1,
          ease: 'none'
        });
      },
      onRepeat() {
        this.count = (this.count === this.emojiArr.length - 1) ? 0 : this.count + 1;
        this.$refs.emoji.setAttribute('xlink:href', this.emojiArr[this.count]);
      }
    }
  };
  </script>
  
  <style scoped>
  .container {
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #FFFCF1;
  }
  
  svg {
    width: 100%;
    height: 100%;
  }
  
  #emoji {
    transform-origin: 50% 100%;
    width: 35px;
    height: 35px;
  }
  </style>
  