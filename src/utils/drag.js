import Vue from 'vue'

Vue.directive('drag', {
    bind(el) {
        var dialogHeaderEl = el.querySelector('.el-dialog__header');
        var dragDom = el.querySelector('.el-dialog');
        dragDom.style.cssText += ';cursor:hand;'
        var sty = (function () {
            if (window.document.currentStyle) {
                return (dom, attr) => dom.currentStyle[attr];
            } else {
                return (dom, attr) => getComputedStyle(dom, false)[attr];
            }
        })()
        dragDom.onmousedown = (e) => {
            var disX = e.clientX - dialogHeaderEl.offsetLeft;
            var disY = e.clientY - dialogHeaderEl.offsetTop;
            var styL = sty(dragDom, 'left');
            var styT = sty(dragDom, 'top');
            var reg = /^\d/;
            if (styL.includes('%')) {
                styL = +document.body.clientWidth * (+styL.replace(/\%/g, '') / 100);
                styT = +document.body.clientHeight * (+styT.replace(/\%/g, '') / 100);
            } else {
                styL = +styL.replace(/\px/g, '');
                styT = +styT.replace(/\px/g, '');
            }
            ;
            if (e.path["0"].attributes["0"]) {
                // console.log(e.path["0"].attributes["0"].value.substr(0,1)=='#')
                var id = e.path["0"].attributes["0"].value;
                // console.log(id)
                if (id != 'text' && id != 'number' && id != 'off') {
                    // if(!(reg.test(e.path["0"].attributes["0"].value))){
                    document.onmousemove = function (e) {
                        var left = e.clientX - disX;
                        var top = e.clientY - disY;
                        dragDom.style.cssText += `;left:${left + styL}px;top:${top + styT}px;`;
                    };
                    document.onmouseup = function (e) {
                        document.onmousemove = null;
                        document.onmouseup = null;
                    };
                    // }
                }
            }


        }

    }
})
