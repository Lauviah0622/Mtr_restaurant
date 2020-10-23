function buttonHandler(e) {
    document.querySelector('.loading').classList.add('onload');
    draw()
}

async function draw() {
    let res = await fetch('/api/draw');
    let json = await res.json();
    console.log(json);
    getPrize(json);
}


function getPrize(json) {
    let modal = document.querySelector('.prize__modal');

    const wrapper = document.querySelector('.wrapper');
    const setBackground = (url) => {
        wrapper.style.background = url;
    }
    const setModal = (content, color = "#000") => {
        const prizeTitle = document.querySelector('.prize__modal h3');
        prizeTitle.innerText = content;
        prizeTitle.style.color = color;
    }

    const reset = () => {
        setBackground('url("./images/lottery/games-bn@3x.jpg");');
        wrapper.classList.add('lottery');
        wrapper.classList.remove('prize');
    }



    document.querySelector('.loading').classList.remove('onload');
    if (!json.ok) {
        alert('系統不穩定，請再試一次');
        reset()
        return
    }

    wrapper.classList.remove('lottery');
    wrapper.classList.add('prize');
    modal.classList.remove('animating');
    // reflow page
    void modal.offsetWidth
    modal.classList.add('animating');

    setBackground(`url("${json.data.imgURI}")`);
    setModal(json.data.content);
}

document.querySelectorAll('.lottery-btn')[0].addEventListener('click', buttonHandler);
document.querySelectorAll('.lottery-btn')[1].addEventListener('click', () => {
    const wrapper = document.querySelector('.wrapper');

    wrapper.classList.add('lottery');
    wrapper.classList.remove('prize');
    wrapper.style.background = 'url("./images/lottery/games-bn@3x.jpg");';
});

