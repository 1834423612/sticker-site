export default {

    //这里的 el 就是使用了 v-lazy 指令的元素
    mounted(el) {

        //保存图片地给 imgSrc
        const imgSrc = el.src

        //清空,这样就不会加载图片了
        el.src = '';

        //观察者 IntersectionObserver 是一个 api

        // 参数 entries 是一个数组,里面的 isIntersecting 属性 ----flase 为在可视区域外, true 表示出现在可视区域,可以解构赋值[{isIntersecting}]

        const observer = new IntersectionObserver(([{ isIntersecting }]) => {

            //元素出现在可视区域的时候以及离开可视区域的时候被触发(所以一开始就会先触发下)
            if (isIntersecting) {

                //加载图片,把刚才保存的 imgSrc 赋值
                el.src = imgSrc;

                //图片加载玩,就得要停止观察了(这样图片就不会每次出现在可视区域或者离开都会触发了))
                observer.unobserve(el)
            }
        })

        //观察我锁定的元素
        observer.observe(el)

    }

}